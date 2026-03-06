import express from 'express';
import { body, validationResult } from 'express-validator';
import Favorite from '../models/Favorite.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all favorites for current user
router.get('/', auth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.id })
      .populate('propertyId')
      .sort({ createdAt: -1 });
    
    res.json({ favorites });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Add property to favorites
router.post('/',
  auth,
  [
    body('propertyId').trim().notEmpty().withMessage('Property ID is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { propertyId } = req.body;

      // Check if already favorited
      const existingFavorite = await Favorite.findOne({
        userId: req.user.id,
        propertyId
      });

      if (existingFavorite) {
        return res.status(400).json({ error: 'Property already in favorites' });
      }

      const favorite = new Favorite({
        userId: req.user.id,
        propertyId
      });

      await favorite.save();

      const populatedFavorite = await Favorite.findById(favorite._id)
        .populate('propertyId');

      res.status(201).json({ 
        favorite: populatedFavorite,
        message: 'Added to favorites' 
      });
    } catch (error) {
      console.error('Error adding favorite:', error);
      res.status(500).json({ error: 'Failed to add favorite' });
    }
  }
);

// Remove property from favorites
router.delete('/:propertyId', auth, async (req, res) => {
  try {
    const { propertyId } = req.params;

    const favorite = await Favorite.findOneAndDelete({
      userId: req.user.id,
      propertyId
    });
    
    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

// Check if property is favorited
router.get('/check/:propertyId', auth, async (req, res) => {
  try {
    const { propertyId } = req.params;

    const favorite = await Favorite.findOne({
      userId: req.user.id,
      propertyId
    });

    res.json({ isFavorited: !!favorite });
  } catch (error) {
    console.error('Error checking favorite:', error);
    res.status(500).json({ error: 'Failed to check favorite' });
  }
});

export default router;

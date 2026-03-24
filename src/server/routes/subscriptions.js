import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import Subscription from '../models/Subscription.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    let query = {};
    
    // Check if requesting plan templates (for pricing page)
    if (req.query.plansOnly === 'true') {
      query = { isPlan: true, active: true };
    } else {
      // For user subscriptions
      if (req.user.role !== 'admin') {
        query = { userId: req.userId, isPlan: { $ne: true } };
      } else {
        query = { isPlan: { $ne: true } };
      }
    }
    
    const subscriptions = await Subscription.find(query)
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 });
    res.json({ success: true, subscriptions });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ error: 'Failed to get subscriptions' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const subscription = new Subscription({ 
      ...req.body, 
      userId: req.userId,
      isPlan: false // User subscriptions are not plan templates
    });
    await subscription.save();
    res.status(201).json({ success: true, subscription });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

export default router;
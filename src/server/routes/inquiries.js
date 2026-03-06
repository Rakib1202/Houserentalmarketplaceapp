import express from 'express';
import { body, validationResult } from 'express-validator';
import Inquiry from '../models/Inquiry.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all inquiries (with optional filters)
router.get('/', auth, async (req, res) => {
  try {
    const { propertyId, userId, status } = req.query;
    
    let query = {};
    
    // If regular user, only show their inquiries
    if (req.user.role !== 'admin' && req.user.role !== 'support') {
      query.userId = req.user.id;
    }
    
    if (propertyId) query.propertyId = propertyId;
    if (userId && (req.user.role === 'admin' || req.user.role === 'support')) {
      query.userId = userId;
    }
    if (status) query.status = status;

    const inquiries = await Inquiry.find(query)
      .populate('propertyId', 'title address rent')
      .populate('userId', 'fullName email phone')
      .populate('respondedBy', 'fullName')
      .sort({ createdAt: -1 });
    
    res.json({ inquiries });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// Get inquiry by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('propertyId', 'title address rent')
      .populate('userId', 'fullName email phone')
      .populate('respondedBy', 'fullName');
    
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    // Check if user has permission to view this inquiry
    if (
      req.user.role !== 'admin' && 
      req.user.role !== 'support' && 
      inquiry.userId.toString() !== req.user.id
    ) {
      return res.status(403).json({ error: 'Not authorized to view this inquiry' });
    }

    res.json({ inquiry });
  } catch (error) {
    console.error('Error fetching inquiry:', error);
    res.status(500).json({ error: 'Failed to fetch inquiry' });
  }
});

// Create inquiry
router.post('/',
  auth,
  [
    body('propertyId').trim().notEmpty().withMessage('Property ID is required'),
    body('message').trim().notEmpty().withMessage('Message is required')
      .isLength({ min: 10, max: 1000 }).withMessage('Message must be between 10 and 1000 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { propertyId, message } = req.body;

      const inquiry = new Inquiry({
        propertyId,
        userId: req.user.id,
        message,
        status: 'pending'
      });

      await inquiry.save();

      const populatedInquiry = await Inquiry.findById(inquiry._id)
        .populate('propertyId', 'title address rent')
        .populate('userId', 'fullName email phone');

      res.status(201).json({ 
        inquiry: populatedInquiry,
        message: 'Inquiry submitted successfully' 
      });
    } catch (error) {
      console.error('Error creating inquiry:', error);
      res.status(500).json({ error: 'Failed to create inquiry' });
    }
  }
);

// Update inquiry (respond)
router.patch('/:id/respond',
  auth,
  [
    body('response').trim().notEmpty().withMessage('Response is required')
  ],
  async (req, res) => {
    try {
      // Only admin and support can respond
      if (req.user.role !== 'admin' && req.user.role !== 'support') {
        return res.status(403).json({ error: 'Not authorized to respond to inquiries' });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { response } = req.body;

      const inquiry = await Inquiry.findByIdAndUpdate(
        id,
        { 
          response,
          status: 'responded',
          respondedAt: new Date(),
          respondedBy: req.user.id
        },
        { new: true }
      )
      .populate('propertyId', 'title address rent')
      .populate('userId', 'fullName email phone')
      .populate('respondedBy', 'fullName');

      if (!inquiry) {
        return res.status(404).json({ error: 'Inquiry not found' });
      }

      res.json({ inquiry });
    } catch (error) {
      console.error('Error responding to inquiry:', error);
      res.status(500).json({ error: 'Failed to respond to inquiry' });
    }
  }
);

// Update inquiry status
router.patch('/:id/status',
  auth,
  [
    body('status').isIn(['pending', 'responded', 'closed']).withMessage('Invalid status')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { status } = req.body;

      const inquiry = await Inquiry.findById(id);
      
      if (!inquiry) {
        return res.status(404).json({ error: 'Inquiry not found' });
      }

      // Check permissions
      const isOwner = inquiry.userId.toString() === req.user.id;
      const isStaff = req.user.role === 'admin' || req.user.role === 'support';
      
      if (!isOwner && !isStaff) {
        return res.status(403).json({ error: 'Not authorized to update this inquiry' });
      }

      inquiry.status = status;
      await inquiry.save();

      const updatedInquiry = await Inquiry.findById(id)
        .populate('propertyId', 'title address rent')
        .populate('userId', 'fullName email phone')
        .populate('respondedBy', 'fullName');

      res.json({ inquiry: updatedInquiry });
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      res.status(500).json({ error: 'Failed to update inquiry status' });
    }
  }
);

// Delete inquiry (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    res.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    res.status(500).json({ error: 'Failed to delete inquiry' });
  }
});

export default router;

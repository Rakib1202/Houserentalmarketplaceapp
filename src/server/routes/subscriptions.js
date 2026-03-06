import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import Subscription from '../models/Subscription.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { userId: req.userId };
    const subscriptions = await Subscription.find(query)
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 });
    res.json({ success: true, subscriptions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get subscriptions' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const subscription = new Subscription({ ...req.body, userId: req.userId });
    await subscription.save();
    res.status(201).json({ success: true, subscription });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

export default router;

import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import EmployeeEarning from '../models/EmployeeEarning.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const query = req.user.role === 'employee' ? { employeeId: req.userId } : {};
    const earnings = await EmployeeEarning.find(query)
      .populate('employeeId', 'fullName email')
      .sort({ month: -1 });
    res.json({ success: true, earnings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get earnings' });
  }
});

router.put('/:id/mark-paid', authenticate, authorize('admin'), async (req, res) => {
  try {
    const earning = await EmployeeEarning.findByIdAndUpdate(
      req.params.id,
      { paid: true, paidAt: new Date() },
      { new: true }
    );
    res.json({ success: true, earning });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update earning' });
  }
});

export default router;

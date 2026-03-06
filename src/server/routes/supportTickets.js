import express from 'express';
import { body, validationResult } from 'express-validator';
import SupportTicket from '../models/SupportTicket.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all tickets
router.get('/', auth, async (req, res) => {
  try {
    const { status, priority, assignedTo, category } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;
    if (category) query.category = category;

    const tickets = await SupportTicket.find(query)
      .sort({ createdAt: -1 });
    
    res.json({ tickets });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// Get ticket by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json({ ticket });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
});

// Create ticket
router.post('/',
  [
    body('customerName').trim().notEmpty().withMessage('Customer name is required'),
    body('customerEmail').isEmail().withMessage('Valid email is required'),
    body('customerPhone').trim().notEmpty().withMessage('Phone is required'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('category').isIn(['General', 'Technical', 'Payment', 'Property', 'Account']).withMessage('Invalid category'),
    body('priority').isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
    body('message').trim().notEmpty().withMessage('Message is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { customerName, customerEmail, customerPhone, subject, category, priority, message } = req.body;

      // Generate ticket number
      const lastTicket = await SupportTicket.findOne().sort({ ticketNumber: -1 });
      let nextNumber = 1;
      if (lastTicket && lastTicket.ticketNumber) {
        const match = lastTicket.ticketNumber.match(/TICK-(\d+)/);
        if (match) {
          nextNumber = parseInt(match[1]) + 1;
        }
      }
      const ticketNumber = `TICK-${String(nextNumber).padStart(3, '0')}`;

      // Create ticket
      const ticket = new SupportTicket({
        ticketNumber,
        customerName,
        customerEmail,
        customerPhone,
        subject,
        category,
        priority,
        status: 'open',
        messages: [{
          sender: 'customer',
          senderName: customerName,
          message,
          timestamp: new Date()
        }]
      });

      await ticket.save();

      res.status(201).json({ 
        ticket,
        message: 'Ticket created successfully' 
      });
    } catch (error) {
      console.error('Error creating ticket:', error);
      res.status(500).json({ error: 'Failed to create ticket' });
    }
  }
);

// Assign ticket
router.post('/:id/assign',
  auth,
  [
    body('employeeId').trim().notEmpty().withMessage('Employee ID is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { employeeId } = req.body;

      const ticket = await SupportTicket.findByIdAndUpdate(
        id,
        { 
          assignedTo: employeeId,
          status: 'in-progress'
        },
        { new: true }
      );

      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      res.json({ ticket });
    } catch (error) {
      console.error('Error assigning ticket:', error);
      res.status(500).json({ error: 'Failed to assign ticket' });
    }
  }
);

// Add message to ticket
router.post('/:id/messages',
  auth,
  [
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('sender').isIn(['customer', 'support']).withMessage('Invalid sender'),
    body('senderName').trim().notEmpty().withMessage('Sender name is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { message, sender, senderName } = req.body;

      const ticket = await SupportTicket.findById(id);
      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      ticket.messages.push({
        sender,
        senderName,
        message,
        timestamp: new Date()
      });

      await ticket.save();

      res.json({ ticket });
    } catch (error) {
      console.error('Error adding message:', error);
      res.status(500).json({ error: 'Failed to add message' });
    }
  }
);

// Update ticket status
router.patch('/:id/status',
  auth,
  [
    body('status').isIn(['open', 'in-progress', 'resolved', 'closed']).withMessage('Invalid status')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { status } = req.body;

      const updateData = { status };
      if (status === 'resolved' || status === 'closed') {
        updateData.resolvedAt = new Date();
      }

      const ticket = await SupportTicket.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      res.json({ ticket });
    } catch (error) {
      console.error('Error updating ticket status:', error);
      res.status(500).json({ error: 'Failed to update ticket status' });
    }
  }
);

// Delete ticket (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const ticket = await SupportTicket.findByIdAndDelete(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
});

export default router;

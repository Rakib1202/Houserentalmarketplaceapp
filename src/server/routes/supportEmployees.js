import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import SupportEmployee from '../models/SupportEmployee.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all support employees (Admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const employees = await SupportEmployee.find()
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json({ employees });
  } catch (error) {
    console.error('Error fetching support employees:', error);
    res.status(500).json({ error: 'Failed to fetch support employees' });
  }
});

// Get next employee ID
router.get('/next-id', adminAuth, async (req, res) => {
  try {
    const lastEmployee = await SupportEmployee.findOne()
      .sort({ employeeId: -1 })
      .select('employeeId');
    
    let nextNumber = 1;
    if (lastEmployee && lastEmployee.employeeId) {
      const match = lastEmployee.employeeId.match(/SUPPORT(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }
    
    const nextId = `SUPPORT${String(nextNumber).padStart(3, '0')}`;
    res.json({ nextId });
  } catch (error) {
    console.error('Error generating next employee ID:', error);
    res.status(500).json({ error: 'Failed to generate employee ID' });
  }
});

// Create support employee (Admin only)
router.post('/',
  adminAuth,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('employeeId').trim().notEmpty().withMessage('Employee ID is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('department').trim().notEmpty().withMessage('Department is required'),
    body('maxConcurrentChats').isInt({ min: 1, max: 20 }).withMessage('Max concurrent chats must be between 1 and 20')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, employeeId, password, phone, department, maxConcurrentChats } = req.body;

      // Check if employee ID or email already exists
      const existingEmployee = await SupportEmployee.findOne({
        $or: [{ employeeId }, { email }]
      });

      if (existingEmployee) {
        return res.status(400).json({ 
          error: existingEmployee.employeeId === employeeId 
            ? 'Employee ID already exists' 
            : 'Email already exists' 
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create employee
      const employee = new SupportEmployee({
        name,
        email,
        employeeId,
        password: hashedPassword,
        phone,
        department,
        maxConcurrentChats,
        status: 'active',
        onlineStatus: 'offline',
        totalChats: 0,
        lastActive: new Date()
      });

      await employee.save();

      // Return employee without password
      const employeeData = employee.toObject();
      delete employeeData.password;

      res.status(201).json({ 
        employee: employeeData,
        message: 'Support employee created successfully' 
      });
    } catch (error) {
      console.error('Error creating support employee:', error);
      res.status(500).json({ error: 'Failed to create support employee' });
    }
  }
);

// Support employee login
router.post('/login',
  [
    body('employeeId').trim().notEmpty().withMessage('Employee ID is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { employeeId, password } = req.body;

      // Find employee
      const employee = await SupportEmployee.findOne({ employeeId });
      if (!employee) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check if active
      if (employee.status !== 'active') {
        return res.status(403).json({ error: 'Account is inactive or suspended' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, employee.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Update last active and online status
      employee.lastActive = new Date();
      employee.onlineStatus = 'online';
      await employee.save();

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: employee._id, 
          employeeId: employee.employeeId,
          type: 'support'
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      // Return employee data without password
      const employeeData = employee.toObject();
      delete employeeData.password;

      res.json({ 
        employee: employeeData,
        accessToken: token
      });
    } catch (error) {
      console.error('Error in support employee login:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

// Update support employee status (Admin only)
router.patch('/:id/status',
  adminAuth,
  [
    body('status').isIn(['active', 'inactive', 'suspended']).withMessage('Invalid status')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { status } = req.body;

      const employee = await SupportEmployee.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      ).select('-password');

      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      res.json({ employee });
    } catch (error) {
      console.error('Error updating employee status:', error);
      res.status(500).json({ error: 'Failed to update employee status' });
    }
  }
);

// Update online status
router.patch('/:id/online-status',
  auth,
  [
    body('onlineStatus').isIn(['online', 'busy', 'offline']).withMessage('Invalid online status')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { onlineStatus } = req.body;

      const employee = await SupportEmployee.findByIdAndUpdate(
        id,
        { 
          onlineStatus,
          lastActive: new Date()
        },
        { new: true }
      ).select('-password');

      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      res.json({ employee });
    } catch (error) {
      console.error('Error updating online status:', error);
      res.status(500).json({ error: 'Failed to update online status' });
    }
  }
);

// Delete support employee (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await SupportEmployee.findByIdAndDelete(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

export default router;

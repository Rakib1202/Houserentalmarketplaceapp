import express from 'express';
import { body, validationResult } from 'express-validator';
import Job from '../models/Job.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const { status, type, location } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    if (location) query.location = new RegExp(location, 'i');

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    
    res.json({ jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Get job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ job });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

// Create job (Admin only)
router.post('/',
  adminAuth,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('company').trim().notEmpty().withMessage('Company is required'),
    body('type').isIn(['Full-time', 'Part-time', 'Contract', 'Freelance']).withMessage('Invalid job type'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('salary').trim().notEmpty().withMessage('Salary is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('requirements').isArray({ min: 1 }).withMessage('At least one requirement is needed'),
    body('responsibilities').isArray({ min: 1 }).withMessage('At least one responsibility is needed')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const jobData = req.body;
      jobData.status = 'active';
      jobData.applicants = 0;

      const job = new Job(jobData);
      await job.save();

      res.status(201).json({ 
        job,
        message: 'Job created successfully' 
      });
    } catch (error) {
      console.error('Error creating job:', error);
      res.status(500).json({ error: 'Failed to create job' });
    }
  }
);

// Update job (Admin only)
router.put('/:id',
  adminAuth,
  async (req, res) => {
    try {
      const job = await Job.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      res.json({ job });
    } catch (error) {
      console.error('Error updating job:', error);
      res.status(500).json({ error: 'Failed to update job' });
    }
  }
);

// Update job status (Admin only)
router.patch('/:id/status',
  adminAuth,
  [
    body('status').isIn(['active', 'closed', 'draft']).withMessage('Invalid status')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const job = await Job.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
      );

      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      res.json({ job });
    } catch (error) {
      console.error('Error updating job status:', error);
      res.status(500).json({ error: 'Failed to update job status' });
    }
  }
);

// Delete job (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

export default router;

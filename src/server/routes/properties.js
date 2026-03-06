import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth.js';
import Property from '../models/Property.js';

const router = express.Router();

// @route   GET /api/properties
// @desc    Get all properties (with filters)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { status, location, propertyType, minPrice, maxPrice, bedrooms } = req.query;
    const query = {};

    if (status) query.status = status;
    if (location) query.location = new RegExp(location, 'i');
    if (propertyType) query.propertyType = propertyType;
    if (bedrooms) query.bedrooms = parseInt(bedrooms);
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    const properties = await Property.find(query)
      .populate('ownerId', 'fullName email phone')
      .populate('agentId', 'fullName email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: properties.length,
      properties
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ error: 'Failed to get properties' });
  }
});

// @route   GET /api/properties/:id
// @desc    Get property by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('ownerId', 'fullName email phone')
      .populate('agentId', 'fullName email phone')
      .populate('approvedBy', 'fullName');

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Increment view count
    property.views += 1;
    await property.save();

    res.json({
      success: true,
      property
    });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ error: 'Failed to get property' });
  }
});

// @route   POST /api/properties
// @desc    Create new property
// @access  Private (Owner, Agent, Admin)
router.post('/', authenticate, authorize('owner', 'agent', 'admin'), async (req, res) => {
  try {
    const propertyData = {
      ...req.body,
      ownerId: req.userId,
      status: req.user.role === 'admin' ? 'approved' : 'pending'
    };

    const property = new Property(propertyData);
    await property.save();

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      property
    });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({ 
      error: 'Failed to create property',
      details: error.message
    });
  }
});

// @route   PUT /api/properties/:id
// @desc    Update property
// @access  Private (Owner, Admin)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && property.ownerId.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this property' });
    }

    Object.assign(property, req.body);
    property.updatedAt = new Date();
    await property.save();

    res.json({
      success: true,
      message: 'Property updated successfully',
      property
    });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

// @route   DELETE /api/properties/:id
// @desc    Delete property
// @access  Private (Owner, Admin)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && property.ownerId.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this property' });
    }

    await property.deleteOne();

    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

// @route   PUT /api/properties/:id/approve
// @desc    Approve property
// @access  Private (Admin)
router.put('/:id/approve', authenticate, authorize('admin'), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    property.status = 'approved';
    property.approvedBy = req.userId;
    property.approvedAt = new Date();
    await property.save();

    res.json({
      success: true,
      message: 'Property approved successfully',
      property
    });
  } catch (error) {
    console.error('Approve property error:', error);
    res.status(500).json({ error: 'Failed to approve property' });
  }
});

// @route   PUT /api/properties/:id/reject
// @desc    Reject property
// @access  Private (Admin)
router.put('/:id/reject', authenticate, authorize('admin'), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    property.status = 'rejected';
    await property.save();

    res.json({
      success: true,
      message: 'Property rejected',
      property
    });
  } catch (error) {
    console.error('Reject property error:', error);
    res.status(500).json({ error: 'Failed to reject property' });
  }
});

export default router;

import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { authenticate, authorize } from '../middleware/auth.js';
import PhotoUpload from '../models/PhotoUpload.js';
import EmployeeEarning from '../models/EmployeeEarning.js';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 2 // Max 2 files
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// @route   POST /api/photo-uploads
// @desc    Upload photos (for employees)
// @access  Private (Employee role)
router.post('/', authenticate, authorize('employee'), upload.array('images', 2), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const { propertyId } = req.body;

    if (!propertyId) {
      return res.status(400).json({ error: 'Property ID is required' });
    }

    const uploadedPhotos = [];

    // Process each file
    for (const file of req.files) {
      try {
        // Ultra-aggressive compression (600x600px, 50% quality)
        const compressedBuffer = await sharp(file.buffer)
          .resize(600, 600, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({ quality: 50, progressive: true })
          .toBuffer();

        // Check file size (max 100KB)
        if (compressedBuffer.length > 100 * 1024) {
          console.warn(`File ${file.originalname} still too large after compression: ${compressedBuffer.length} bytes`);
          // Further compression
          const ultraCompressed = await sharp(compressedBuffer)
            .resize(500, 500, { fit: 'inside' })
            .jpeg({ quality: 40 })
            .toBuffer();
          
          if (ultraCompressed.length > 100 * 1024) {
            return res.status(400).json({ 
              error: `Image ${file.originalname} is too large. Max 100KB per image.`,
              size: Math.round(ultraCompressed.length / 1024) + 'KB'
            });
          }
        }

        // Convert to base64 for demo (in production, upload to cloud storage)
        const base64Image = `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;

        // Create photo upload record
        const photoUpload = new PhotoUpload({
          employeeId: req.userId,
          propertyId,
          imageUrl: base64Image,
          originalName: file.originalname,
          fileSize: compressedBuffer.length,
          status: 'pending'
        });

        await photoUpload.save();
        uploadedPhotos.push(photoUpload);

      } catch (compressionError) {
        console.error('Compression error:', compressionError);
        return res.status(500).json({ 
          error: `Failed to process image ${file.originalname}`,
          details: compressionError.message
        });
      }
    }

    res.status(201).json({
      success: true,
      message: `Successfully uploaded ${uploadedPhotos.length} photo(s)`,
      photos: uploadedPhotos.map(p => ({
        id: p._id,
        status: p.status,
        fileSize: Math.round(p.fileSize / 1024) + 'KB',
        uploadedAt: p.uploadedAt
      }))
    });

  } catch (error) {
    console.error('Photo upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload photos',
      details: error.message
    });
  }
});

// @route   GET /api/photo-uploads
// @desc    Get all photo uploads (with filters)
// @access  Private (Employee, Admin)
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, employeeId } = req.query;
    const query = {};

    // If employee, only show their uploads
    if (req.user.role === 'employee') {
      query.employeeId = req.userId;
    } else if (employeeId) {
      query.employeeId = employeeId;
    }

    if (status) {
      query.status = status;
    }

    const photos = await PhotoUpload.find(query)
      .populate('employeeId', 'fullName email')
      .populate('propertyId', 'title location')
      .populate('reviewedBy', 'fullName')
      .sort({ uploadedAt: -1 });

    res.json({
      success: true,
      count: photos.length,
      photos
    });
  } catch (error) {
    console.error('Get photos error:', error);
    res.status(500).json({ error: 'Failed to get photo uploads' });
  }
});

// @route   PUT /api/photo-uploads/:id/approve
// @desc    Approve photo upload
// @access  Private (Admin)
router.put('/:id/approve', authenticate, authorize('admin'), async (req, res) => {
  try {
    const photo = await PhotoUpload.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    photo.status = 'approved';
    photo.reviewedBy = req.userId;
    photo.reviewedAt = new Date();
    photo.earnings = 5.00; // ৳5 per approved photo

    await photo.save();

    // Update employee earnings
    const month = new Date().toISOString().slice(0, 7); // YYYY-MM
    await updateEmployeeEarnings(photo.employeeId, month);

    res.json({
      success: true,
      message: 'Photo approved successfully',
      photo
    });
  } catch (error) {
    console.error('Approve photo error:', error);
    res.status(500).json({ error: 'Failed to approve photo' });
  }
});

// @route   PUT /api/photo-uploads/:id/reject
// @desc    Reject photo upload
// @access  Private (Admin)
router.put('/:id/reject', authenticate, authorize('admin'), async (req, res) => {
  try {
    const photo = await PhotoUpload.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    photo.status = 'rejected';
    photo.reviewedBy = req.userId;
    photo.reviewedAt = new Date();

    await photo.save();

    res.json({
      success: true,
      message: 'Photo rejected',
      photo
    });
  } catch (error) {
    console.error('Reject photo error:', error);
    res.status(500).json({ error: 'Failed to reject photo' });
  }
});

// Helper function to update employee earnings
async function updateEmployeeEarnings(employeeId, month) {
  try {
    const photos = await PhotoUpload.find({
      employeeId,
      uploadedAt: {
        $gte: new Date(`${month}-01`),
        $lt: new Date(`${month}-32`)
      }
    });

    const totalPhotos = photos.length;
    const approvedPhotos = photos.filter(p => p.status === 'approved').length;
    const totalEarnings = approvedPhotos * 5;

    await EmployeeEarning.findOneAndUpdate(
      { employeeId, month },
      {
        employeeId,
        month,
        totalPhotos,
        approvedPhotos,
        totalEarnings,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Update earnings error:', error);
  }
}

export default router;

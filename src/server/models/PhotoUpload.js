import mongoose from 'mongoose';

const photoUploadSchema = new mongoose.Schema({
  employeeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  propertyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Property', 
    required: true 
  },
  imageUrl: { type: String, required: true },
  originalName: { type: String },
  fileSize: { type: Number },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  reviewedAt: { type: Date },
  earnings: { type: Number, default: 0 },
  uploadedAt: { type: Date, default: Date.now }
});

photoUploadSchema.index({ employeeId: 1, status: 1 });
photoUploadSchema.index({ propertyId: 1 });
photoUploadSchema.index({ uploadedAt: -1 });

export default mongoose.model('PhotoUpload', photoUploadSchema);

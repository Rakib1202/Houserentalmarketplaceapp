import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  propertyType: { 
    type: String, 
    required: true,
    enum: ['apartment', 'house', 'villa', 'room', 'office', 'shop', 'warehouse']
  },
  location: { type: String, required: true },
  address: { type: String, required: true },
  area: { type: String }, // Dhaka area (Gulshan, Banani, etc.)
  price: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  size: { type: Number }, // in sq ft
  floor: { type: String },
  furnished: { 
    type: String, 
    enum: ['furnished', 'semi-furnished', 'unfurnished'],
    default: 'unfurnished'
  },
  amenities: [{ type: String }],
  images: [{ type: String }],
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  agentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'rented', 'inactive'],
    default: 'pending'
  },
  approvedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  approvedAt: { type: Date },
  views: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  available: { type: Boolean, default: true },
  availableFrom: { type: Date },
  contactPhone: { type: String },
  contactEmail: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

propertySchema.index({ location: 1, status: 1 });
propertySchema.index({ propertyType: 1, status: 1 });
propertySchema.index({ ownerId: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ createdAt: -1 });

export default mongoose.model('Property', propertySchema);

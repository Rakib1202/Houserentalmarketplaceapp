import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  password: { type: String },
  role: { 
    type: String, 
    required: true, 
    enum: ['tenant', 'owner', 'agent', 'employee', 'admin'],
    default: 'tenant'
  },
  verified: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ['active', 'suspended', 'inactive'], 
    default: 'active' 
  },
  profileImage: { type: String },
  address: { type: String },
  nidNumber: { type: String },
  nidVerified: { type: Boolean, default: false },
  
  // Google OAuth fields
  googleId: { type: String, unique: true, sparse: true },
  authProvider: { 
    type: String, 
    enum: ['local', 'google'], 
    default: 'local' 
  },
  
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.index({ phone: 1 });
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ role: 1, status: 1 });

export default mongoose.model('User', userSchema);
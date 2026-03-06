import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['full-time', 'part-time', 'contract', 'internship']
  },
  experience: { type: String },
  salary: { type: String },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  responsibilities: [{ type: String }],
  benefits: [{ type: String }],
  status: { 
    type: String, 
    enum: ['active', 'closed', 'draft'],
    default: 'active'
  },
  deadline: { type: Date },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ department: 1 });

export default mongoose.model('Job', jobSchema);

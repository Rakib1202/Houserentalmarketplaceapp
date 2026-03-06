import mongoose from 'mongoose';

const supportEmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  employeeId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  department: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  onlineStatus: { 
    type: String, 
    enum: ['online', 'busy', 'offline'],
    default: 'offline'
  },
  totalChats: { type: Number, default: 0 },
  maxConcurrentChats: { type: Number, default: 5 },
  lastActive: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

supportEmployeeSchema.index({ employeeId: 1 });
supportEmployeeSchema.index({ status: 1, onlineStatus: 1 });

export default mongoose.model('SupportEmployee', supportEmployeeSchema);

import mongoose from 'mongoose';

const employeeEarningSchema = new mongoose.Schema({
  employeeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  month: { type: String, required: true }, // Format: YYYY-MM
  totalPhotos: { type: Number, default: 0 },
  approvedPhotos: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  paid: { type: Boolean, default: false },
  paidAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

employeeEarningSchema.index({ employeeId: 1, month: 1 }, { unique: true });
employeeEarningSchema.index({ month: -1 });
employeeEarningSchema.index({ paid: 1 });

export default mongoose.model('EmployeeEarning', employeeEarningSchema);

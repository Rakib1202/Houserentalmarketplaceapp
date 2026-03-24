import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: function() { return !this.isPlan; } // Not required if this is a plan template
  },
  // Plan template fields (when userId is null, this is a plan template)
  name: { type: String }, // e.g., "Premium Monthly"
  price: { type: Number }, // Price in BDT
  duration: { type: Number }, // Duration in days
  features: [{ type: String }], // Array of feature strings
  active: { type: Boolean, default: true }, // Whether this plan is available for purchase
  isPlan: { type: Boolean, default: false }, // true if this is a plan template, false if user subscription
  
  // User subscription fields (when userId exists)
  plan: { type: String }, // Legacy: 'basic', 'premium', 'enterprise' or plan name
  planName: { type: String }, // Name of the subscribed plan
  startDate: { type: Date },
  endDate: { type: Date },
  status: { 
    type: String, 
    enum: ['active', 'expired', 'cancelled', 'pending'],
    default: 'pending'
  },
  amount: { type: Number },
  paymentMethod: { type: String }, // BKASH, NAGAD, ROCKET, CARD
  transactionId: { type: String },
  phoneNumber: { type: String }, // Payment phone number
  autoRenew: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ endDate: 1 });
subscriptionSchema.index({ isPlan: 1, active: 1 });

export default mongoose.model('Subscription', subscriptionSchema);
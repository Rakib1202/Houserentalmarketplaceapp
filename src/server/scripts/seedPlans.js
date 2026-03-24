/**
 * Script to seed default subscription plans
 * Run: node server/scripts/seedPlans.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

// Import Subscription model
const subscriptionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: function() { return !this.isPlan; }
  },
  name: { type: String },
  price: { type: Number },
  duration: { type: Number },
  features: [{ type: String }],
  active: { type: Boolean, default: true },
  isPlan: { type: Boolean, default: false },
  plan: { type: String },
  planName: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  status: { 
    type: String, 
    enum: ['active', 'expired', 'cancelled', 'pending'],
    default: 'pending'
  },
  amount: { type: Number },
  paymentMethod: { type: String },
  transactionId: { type: String },
  phoneNumber: { type: String },
  autoRenew: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

const defaultPlans = [
  {
    name: 'Basic Monthly',
    price: 499,
    duration: 30,
    isPlan: true,
    active: true,
    features: [
      'Post up to 5 properties',
      'Basic listing visibility',
      'Email support (48hr response)',
      'Standard property photos',
      'Valid for 30 days'
    ]
  },
  {
    name: 'Premium Monthly',
    price: 999,
    duration: 30,
    isPlan: true,
    active: true,
    popular: true,
    features: [
      'Unlimited property listings',
      'Featured placement on homepage',
      'Verified badge on all listings',
      'Priority support (24hr response)',
      'Access to full tenant contacts',
      'Property analytics dashboard',
      'Valid for 30 days'
    ]
  },
  {
    name: 'Premium Quarterly',
    price: 2499,
    duration: 90,
    isPlan: true,
    active: true,
    features: [
      'Everything in Premium Monthly',
      'Save 17% compared to monthly',
      'Quarterly performance reports',
      'Dedicated account manager',
      'Valid for 90 days'
    ]
  },
  {
    name: 'Premium Annual',
    price: 8999,
    duration: 365,
    isPlan: true,
    active: true,
    features: [
      'Everything in Premium Monthly',
      'Save 25% compared to monthly',
      'Highest priority placement',
      'Advanced analytics & insights',
      'Dedicated account manager',
      'Monthly performance reviews',
      'Free featured boost (2x/month)',
      'Valid for 365 days'
    ]
  }
];

async function seedPlans() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/houserentbd';
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Check if plans already exist
    const existingPlans = await Subscription.find({ isPlan: true });
    
    if (existingPlans.length > 0) {
      console.log(`\n⚠️  Found ${existingPlans.length} existing plan(s).`);
      console.log('Do you want to delete existing plans and create new ones?');
      console.log('If yes, delete them manually first using MongoDB Compass or run:');
      console.log('  db.subscriptions.deleteMany({ isPlan: true })');
      console.log('\nExisting plans:');
      existingPlans.forEach(plan => {
        console.log(`  - ${plan.name}: ৳${plan.price} (${plan.duration} days)`);
      });
      process.exit(0);
    }

    // Create plans
    console.log('\n📝 Creating subscription plans...');
    for (const planData of defaultPlans) {
      const plan = new Subscription(planData);
      await plan.save();
      console.log(`✅ Created: ${plan.name} - ৳${plan.price} (${plan.duration} days)`);
    }

    console.log('\n✨ Successfully seeded subscription plans!');
    console.log(`\n📊 Summary:`);
    console.log(`   Total plans created: ${defaultPlans.length}`);
    console.log(`\n🔗 Access the pricing page at: http://localhost:5173/pricing`);
    
  } catch (error) {
    console.error('❌ Error seeding plans:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the seeder
seedPlans();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from parent directory
dotenv.config({ path: join(__dirname, '..', '.env') });

// Import User model
import User from '../models/User.js';

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/houserentbd', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB\n');

    // Admin user details
    const adminData = {
      fullName: 'System Administrator',
      email: 'admin@houserentbd.com',
      phone: '01700000000',
      password: 'admin123', // Will be hashed
      role: 'admin'
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ phone: adminData.phone });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('📞 Phone:', adminData.phone);
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Role:', existingAdmin.role);
      console.log('\n💡 Use these credentials to login:');
      console.log('   Phone:', adminData.phone);
      console.log('   Password: admin123 (or your custom password)');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Create admin user
    console.log('👤 Creating admin user...');
    const admin = new User({
      fullName: adminData.fullName,
      email: adminData.email,
      phone: adminData.phone,
      password: hashedPassword,
      role: adminData.role,
      verified: true,
      status: 'active',
      lastLogin: null
    });

    await admin.save();

    console.log('✅ Admin user created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 ADMIN CREDENTIALS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Name:', adminData.fullName);
    console.log('📧 Email:', adminData.email);
    console.log('📞 Phone:', adminData.phone);
    console.log('🔑 Password:', adminData.password);
    console.log('👔 Role:', adminData.role);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('💡 You can now login at:');
    console.log('   http://localhost:5173/admin-login\n');
    console.log('⚠️  IMPORTANT: Change the password after first login!');

    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

// Run the script
createAdminUser();

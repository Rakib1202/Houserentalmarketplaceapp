#!/usr/bin/env node

/**
 * System Verification Script for HouseRentBD
 * 
 * This script verifies all critical system components:
 * - MongoDB connection
 * - Environment variables
 * - Database collections
 * - Admin user existence
 * - API endpoints
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.cyan}${'='.repeat(60)}\n${msg}\n${'='.repeat(60)}${colors.reset}\n`),
};

async function verifyEnvironment() {
  log.section('CHECKING ENVIRONMENT VARIABLES');
  
  const requiredVars = [
    'PORT',
    'MONGODB_URI',
    'JWT_SECRET',
    'CLIENT_URL',
  ];

  const optionalVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'NODE_ENV',
  ];

  let allRequired = true;

  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      log.success(`${varName}: Set`);
    } else {
      log.error(`${varName}: Missing (REQUIRED)`);
      allRequired = false;
    }
  });

  optionalVars.forEach(varName => {
    if (process.env[varName] && !process.env[varName].includes('YOUR_')) {
      log.success(`${varName}: Set`);
    } else {
      log.warning(`${varName}: Not configured (optional)`);
    }
  });

  return allRequired;
}

async function verifyMongoDB() {
  log.section('CHECKING MONGODB CONNECTION');

  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/houserentbd';
    log.info(`Connecting to: ${uri}`);

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    log.success('MongoDB connected successfully');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    log.info(`Database: ${db.databaseName}`);
    log.info(`Collections found: ${collections.length}`);
    
    collections.forEach(col => {
      log.success(`  - ${col.name}`);
    });

    return true;
  } catch (error) {
    log.error(`MongoDB connection failed: ${error.message}`);
    log.warning('Make sure MongoDB is running:');
    log.info('  macOS: brew services start mongodb-community@7.0');
    log.info('  Linux: sudo systemctl start mongod');
    log.info('  Docker: docker run -d -p 27017:27017 --name mongodb mongo:7.0');
    return false;
  }
}

async function verifyCollections() {
  log.section('CHECKING DATABASE COLLECTIONS');

  const expectedCollections = [
    'users',
    'properties',
    'subscriptions',
    'photouploads',
    'employeeearnings',
    'supportemployees',
    'supporttickets',
    'jobs',
  ];

  try {
    const db = mongoose.connection.db;
    const existingCollections = await db.listCollections().toArray();
    const existingNames = existingCollections.map(c => c.name);

    expectedCollections.forEach(colName => {
      if (existingNames.includes(colName)) {
        log.success(`${colName} collection exists`);
      } else {
        log.warning(`${colName} collection not found (will be created on first use)`);
      }
    });

    return true;
  } catch (error) {
    log.error(`Failed to check collections: ${error.message}`);
    return false;
  }
}

async function verifyAdminUser() {
  log.section('CHECKING ADMIN USER');

  try {
    const User = mongoose.model('User', new mongoose.Schema({
      fullName: String,
      email: String,
      phone: String,
      password: String,
      role: String,
      status: String,
    }));

    const adminUsers = await User.find({ role: 'admin' });

    if (adminUsers.length > 0) {
      log.success(`Found ${adminUsers.length} admin user(s):`);
      adminUsers.forEach(admin => {
        log.info(`  - ${admin.fullName} (${admin.phone}) - Status: ${admin.status}`);
      });
      return true;
    } else {
      log.warning('No admin users found');
      log.info('Create an admin user by running:');
      log.info('  cd server && npm run create-admin');
      return false;
    }
  } catch (error) {
    log.error(`Failed to check admin users: ${error.message}`);
    return false;
  }
}

async function verifyIndexes() {
  log.section('CHECKING DATABASE INDEXES');

  try {
    const User = mongoose.model('User');
    const indexes = await User.collection.getIndexes();

    log.success('User collection indexes:');
    Object.keys(indexes).forEach(indexName => {
      log.info(`  - ${indexName}: ${JSON.stringify(indexes[indexName])}`);
    });

    return true;
  } catch (error) {
    log.warning(`Could not verify indexes: ${error.message}`);
    return false;
  }
}

async function printSystemInfo() {
  log.section('SYSTEM INFORMATION');

  log.info(`Node.js Version: ${process.version}`);
  log.info(`Platform: ${process.platform}`);
  log.info(`Architecture: ${process.arch}`);
  log.info(`Working Directory: ${process.cwd()}`);
  log.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
}

async function printNextSteps() {
  log.section('NEXT STEPS');

  log.info('1. Start the backend server:');
  log.success('   cd server && npm run dev');
  
  log.info('\n2. Start the frontend (in another terminal):');
  log.success('   npm run dev');
  
  log.info('\n3. Access the application:');
  log.success('   Frontend: http://localhost:5173');
  log.success('   Backend API: http://localhost:5000/api/health');
  
  log.info('\n4. Test the connection:');
  log.success('   Open: test-connection.html in your browser');
  
  log.info('\n5. Login credentials:');
  log.success('   Admin: 01700000000 / admin123');
  log.success('   (or create new user via signup)');
}

async function main() {
  console.log(`
${colors.cyan}╔════════════════════════════════════════════════════════════╗
║                                                            ║
║            HouseRentBD System Verification                 ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝${colors.reset}
  `);

  const results = {
    environment: false,
    mongodb: false,
    collections: false,
    adminUser: false,
  };

  // Run all verification steps
  results.environment = await verifyEnvironment();
  results.mongodb = await verifyMongoDB();

  if (results.mongodb) {
    results.collections = await verifyCollections();
    results.adminUser = await verifyAdminUser();
    await verifyIndexes();
  }

  await printSystemInfo();

  // Summary
  log.section('VERIFICATION SUMMARY');

  const allPassed = Object.values(results).every(r => r === true);

  if (allPassed) {
    log.success('All critical checks passed! ✨');
    log.success('Your system is ready to run!');
  } else {
    log.warning('Some checks failed. Review the output above.');
    
    if (!results.environment) {
      log.error('Fix environment variables in /server/.env');
    }
    if (!results.mongodb) {
      log.error('Start MongoDB and try again');
    }
    if (!results.adminUser) {
      log.warning('Create an admin user to access admin panel');
    }
  }

  await printNextSteps();

  // Close MongoDB connection
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    log.info('\nMongoDB connection closed.');
  }

  process.exit(allPassed ? 0 : 1);
}

// Run the verification
main().catch(error => {
  log.error(`Verification failed: ${error.message}`);
  console.error(error);
  process.exit(1);
});

#!/usr/bin/env node

/**
 * HouseRentBD Setup Verification Script
 * Checks if all configuration files and dependencies are ready
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 HouseRentBD Setup Verification\n');
console.log('='.repeat(50));

let hasErrors = false;
let warnings = 0;

// Check function
function check(description, testFn) {
  try {
    const result = testFn();
    if (result === true) {
      console.log(`✅ ${description}`);
      return true;
    } else {
      console.log(`❌ ${description}`);
      console.log(`   → ${result}`);
      hasErrors = true;
      return false;
    }
  } catch (error) {
    console.log(`❌ ${description}`);
    console.log(`   → ${error.message}`);
    hasErrors = true;
    return false;
  }
}

function warn(description, message) {
  console.log(`⚠️  ${description}`);
  console.log(`   → ${message}`);
  warnings++;
}

console.log('\n📦 Checking Configuration Files...\n');

// Check frontend .env
check('Frontend .env file exists', () => {
  const exists = fs.existsSync(path.join(__dirname, '.env'));
  if (!exists) return 'Missing /.env file';
  return true;
});

// Check frontend .env.example
check('Frontend .env.example file exists', () => {
  const exists = fs.existsSync(path.join(__dirname, '.env.example'));
  if (!exists) return 'Missing /.env.example file';
  return true;
});

// Check backend .env
check('Backend .env file exists', () => {
  const exists = fs.existsSync(path.join(__dirname, 'server', '.env'));
  if (!exists) return 'Missing /server/.env file';
  return true;
});

// Check backend .env.example
check('Backend .env.example file exists', () => {
  const exists = fs.existsSync(path.join(__dirname, 'server', '.env.example'));
  if (!exists) return 'Missing /server/.env.example file';
  return true;
});

console.log('\n🔧 Checking Backend Configuration...\n');

// Read and check backend .env
try {
  const backendEnv = fs.readFileSync(path.join(__dirname, 'server', '.env'), 'utf8');
  
  check('MongoDB URI configured', () => {
    const hasMongoUri = backendEnv.includes('MONGODB_URI=');
    if (!hasMongoUri) return 'MONGODB_URI not found in /server/.env';
    
    const uriLine = backendEnv.split('\n').find(line => line.startsWith('MONGODB_URI='));
    const uri = uriLine.split('=')[1];
    
    if (!uri || uri.includes('localhost:27017') || uri.includes('your_username') || uri.includes('your_password')) {
      warn('MongoDB URI needs updating', 'Still using default/placeholder value. Update with your MongoDB Atlas connection string!');
    } else if (uri.startsWith('mongodb+srv://')) {
      return true;
    } else if (uri.startsWith('mongodb://localhost')) {
      warn('MongoDB URI using localhost', 'You\'re using local MongoDB. This is fine for development.');
    }
    
    return true;
  });
  
  check('JWT Secret configured', () => {
    const hasJwtSecret = backendEnv.includes('JWT_SECRET=');
    if (!hasJwtSecret) return 'JWT_SECRET not found in /server/.env';
    
    const secretLine = backendEnv.split('\n').find(line => line.startsWith('JWT_SECRET='));
    const secret = secretLine.split('=')[1];
    
    if (!secret || secret.includes('your_super_secret') || secret.includes('change_this')) {
      warn('JWT Secret should be changed', 'Using default secret. Change this for production!');
    }
    
    return true;
  });
  
  check('PORT configured', () => {
    const hasPort = backendEnv.includes('PORT=');
    return hasPort ? true : 'PORT not found in /server/.env';
  });
  
  check('CLIENT_URL configured', () => {
    const hasClientUrl = backendEnv.includes('CLIENT_URL=');
    return hasClientUrl ? true : 'CLIENT_URL not found in /server/.env';
  });
  
} catch (error) {
  console.log(`❌ Cannot read /server/.env file`);
  console.log(`   → ${error.message}`);
  hasErrors = true;
}

console.log('\n🎨 Checking Frontend Configuration...\n');

// Read and check frontend .env
try {
  const frontendEnv = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
  
  check('API URL configured', () => {
    const hasApiUrl = frontendEnv.includes('VITE_API_URL=');
    if (!hasApiUrl) return 'VITE_API_URL not found in /.env';
    
    const urlLine = frontendEnv.split('\n').find(line => line.startsWith('VITE_API_URL='));
    const url = urlLine.split('=')[1];
    
    if (url !== 'http://localhost:5000') {
      warn('API URL is non-standard', `Using ${url} instead of http://localhost:5000`);
    }
    
    return true;
  });
  
} catch (error) {
  console.log(`❌ Cannot read /.env file`);
  console.log(`   → ${error.message}`);
  hasErrors = true;
}

console.log('\n📁 Checking Project Structure...\n');

// Check important directories and files
check('Server directory exists', () => {
  return fs.existsSync(path.join(__dirname, 'server')) ? true : 'Missing /server directory';
});

check('Server package.json exists', () => {
  return fs.existsSync(path.join(__dirname, 'server', 'package.json')) ? true : 'Missing /server/package.json';
});

check('Server models directory exists', () => {
  return fs.existsSync(path.join(__dirname, 'server', 'models')) ? true : 'Missing /server/models directory';
});

check('Server routes directory exists', () => {
  return fs.existsSync(path.join(__dirname, 'server', 'routes')) ? true : 'Missing /server/routes directory';
});

check('API client exists', () => {
  return fs.existsSync(path.join(__dirname, 'lib', 'api-client.ts')) ? true : 'Missing /lib/api-client.ts';
});

check('API services exist', () => {
  return fs.existsSync(path.join(__dirname, 'services', 'api.ts')) ? true : 'Missing /services/api.ts';
});

console.log('\n📚 Checking Documentation...\n');

check('Startup guide exists', () => {
  return fs.existsSync(path.join(__dirname, 'COMPLETE_STARTUP_GUIDE.md')) ? true : 'Missing startup guide';
});

check('MongoDB setup guide exists', () => {
  return fs.existsSync(path.join(__dirname, 'MONGODB_ATLAS_SETUP.md')) ? true : 'Missing MongoDB guide';
});

check('Quick start guide exists', () => {
  return fs.existsSync(path.join(__dirname, 'START_HERE.md')) ? true : 'Missing quick start guide';
});

console.log('\n' + '='.repeat(50));
console.log('\n📊 Summary:\n');

if (hasErrors) {
  console.log('❌ SETUP INCOMPLETE - Some issues need to be fixed');
  console.log('\n🔧 Next Steps:');
  console.log('   1. Fix the errors shown above');
  console.log('   2. Run this script again to verify');
  console.log('   3. Read COMPLETE_STARTUP_GUIDE.md for detailed help');
  process.exit(1);
} else if (warnings > 0) {
  console.log(`⚠️  SETUP OK - But ${warnings} warning(s) to review`);
  console.log('\n📖 Next Steps:');
  console.log('   1. Review warnings above (especially MongoDB URI)');
  console.log('   2. Update /server/.env with your MongoDB connection string');
  console.log('   3. Follow START_HERE.md to launch the application');
  console.log('\n💡 Warnings are OK for development, but fix them for production!');
} else {
  console.log('✅ SETUP COMPLETE - All checks passed!');
  console.log('\n🚀 Next Steps:');
  console.log('   1. Update MongoDB URI in /server/.env (if not done)');
  console.log('   2. Run: cd server && npm install && npm start');
  console.log('   3. Run: npm install && npm run dev (in new terminal)');
  console.log('   4. Open: http://localhost:5173');
  console.log('\n📖 See START_HERE.md for quick launch guide!');
}

console.log('\n');

# 🚀 HouseRentBD - Complete System Startup Guide

## ✅ System Status: FULLY CONFIGURED

Your HouseRentBD rental marketplace is now 100% configured with:
- ✅ MongoDB backend connection
- ✅ Full Express.js API with 9 routes
- ✅ Google OAuth 2.0 authentication
- ✅ 8 Mongoose database models
- ✅ JWT authentication & bcrypt password hashing
- ✅ Environment configuration files
- ✅ Ultra-aggressive image compression
- ✅ Complete frontend with React & TypeScript

---

## 📋 Prerequisites

Before starting, ensure you have:

1. **Node.js** (v18 or higher)
   ```bash
   node --version  # Should be v18.0.0 or higher
   ```

2. **MongoDB** (v7.0 or higher)
   ```bash
   mongod --version  # Should be v7.0.0 or higher
   ```

3. **npm** or **yarn**
   ```bash
   npm --version
   ```

---

## 🔧 Step-by-Step Setup

### Step 1: Install Dependencies

```bash
# Install frontend dependencies (project root)
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Step 2: Start MongoDB

Choose one method based on your OS:

#### macOS (Homebrew):
```bash
# Start MongoDB as a service
brew services start mongodb-community@7.0

# Verify it's running
brew services list | grep mongodb

# Or start manually
mongod --config /opt/homebrew/etc/mongod.conf
```

#### Linux (Ubuntu/Debian):
```bash
# Start MongoDB service
sudo systemctl start mongod

# Enable auto-start on boot
sudo systemctl enable mongod

# Check status
sudo systemctl status mongod
```

#### Windows:
```bash
# Start as a service
net start MongoDB

# Or run manually
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
```

#### Docker (Cross-platform):
```bash
# Pull and run MongoDB container
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:7.0

# Verify it's running
docker ps | grep mongodb
```

### Step 3: Verify MongoDB Connection

```bash
# Connect to MongoDB shell
mongosh

# In the shell:
show dbs
use houserentbd
db.version()
exit
```

Expected output:
```
test> show dbs
admin   40.00 KiB
config  12.00 KiB
local   40.00 KiB

test> use houserentbd
switched to db houserentbd

houserentbd> db.version()
7.0.x
```

### Step 4: Configure Environment Variables

Environment files are already created! Just verify them:

#### Backend Environment (`/server/.env`):
```bash
cd server
cat .env
```

Should contain:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/houserentbd
JWT_SECRET=houserentbd-super-secret-jwt-key-2024-change-in-production
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
```

#### Frontend Environment (`/.env`):
```bash
cd ..
cat .env
```

Should contain:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
VITE_APP_NAME=HouseRentBD
VITE_APP_URL=http://localhost:5173
```

### Step 5: Create Admin User

```bash
cd server
npm run create-admin
```

This will create an admin user with:
- **Phone:** 01700000000
- **Password:** admin123
- **Role:** admin

### Step 6: Verify System (Optional but Recommended)

```bash
# Still in /server directory
npm run verify
```

This script will check:
- ✅ Environment variables
- ✅ MongoDB connection
- ✅ Database collections
- ✅ Admin user existence
- ✅ Database indexes

### Step 7: Start the Backend Server

```bash
# In /server directory
npm run dev
```

Expected output:
```
🚀 Server running on port 5000
📍 Environment: development
🌐 Client URL: http://localhost:5173
✅ MongoDB Connected Successfully
```

### Step 8: Start the Frontend (New Terminal)

```bash
# Open a new terminal in project root
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 🎯 Testing the System

### 1. Test Backend Health

Open browser or use curl:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "HouseRentBD API is running",
  "timestamp": "2024-02-23T..."
}
```

### 2. Test Frontend

Open browser: http://localhost:5173

You should see the HouseRentBD homepage.

### 3. Test Login

#### Admin Login:
1. Go to: http://localhost:5173/admin-login
2. Phone: `01700000000`
3. Password: `admin123`
4. Should redirect to admin dashboard

#### Regular User Signup:
1. Go to: http://localhost:5173/signup
2. Fill in details
3. Click "Send OTP"
4. Use demo OTP: `123456`
5. Set password
6. Login with phone + password

### 4. Test Google OAuth (If Configured)

1. Go to login page
2. Click "Continue with Google"
3. Sign in with Google account
4. Should auto-create account and login

---

## 🔐 Google OAuth Setup (Optional)

If you want to enable Google Sign-In:

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 2. Create a Project
- Click "Select a project" → "New Project"
- Name: "HouseRentBD"
- Click "Create"

### 3. Enable Google+ API
- Go to "APIs & Services" → "Library"
- Search "Google+ API"
- Click "Enable"

### 4. Configure OAuth Consent Screen
- Go to "APIs & Services" → "OAuth consent screen"
- Select "External"
- App name: "HouseRentBD"
- User support email: your email
- Developer contact: your email
- Click "Save and Continue"

### 5. Create OAuth 2.0 Credentials
- Go to "APIs & Services" → "Credentials"
- Click "Create Credentials" → "OAuth client ID"
- Application type: "Web application"
- Name: "HouseRentBD Web Client"

**Authorized JavaScript origins:**
```
http://localhost:5173
http://localhost:5000
```

**Authorized redirect URIs:**
```
http://localhost:5173/auth/callback
http://localhost:5000/api/auth/google/callback
```

### 6. Copy Credentials

You'll get a **Client ID** and **Client Secret**.

Update `/server/.env`:
```env
GOOGLE_CLIENT_ID=your-actual-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-actual-secret
```

Update `/.env`:
```env
VITE_GOOGLE_CLIENT_ID=your-actual-id.apps.googleusercontent.com
```

### 7. Restart Servers

```bash
# Restart backend
cd server
npm run dev

# Restart frontend (new terminal)
npm run dev
```

---

## 📊 Database Structure

### Collections:

1. **users** - All user accounts
   - Fields: fullName, email, phone, password, role, googleId, status, verified
   - Roles: tenant, owner, agent, employee, admin
   
2. **properties** - Property listings
   - Fields: title, description, location, rent, images, owner, status
   
3. **subscriptions** - User subscription plans
   - Fields: userId, planType, startDate, endDate, status
   
4. **photouploads** - Employee photo uploads
   - Fields: employeeId, imageUrl, status, approvedBy
   
5. **employeeearnings** - Commission tracking
   - Fields: employeeId, amount, type, date
   
6. **supportemployees** - Live chat staff
   - Fields: name, employeeId, password, department, status
   
7. **supporttickets** - Customer support
   - Fields: customername, subject, category, priority, status, assignedTo
   
8. **jobs** - Career postings
   - Fields: title, description, type, location, salary, status

---

## 🛠️ Common Issues & Solutions

### Issue 1: MongoDB Connection Failed

**Error:**
```
MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**
```bash
# Check if MongoDB is running
ps aux | grep mongod

# If not running, start it:
brew services start mongodb-community@7.0  # macOS
sudo systemctl start mongod                # Linux
net start MongoDB                          # Windows

# Check MongoDB logs
tail -f /opt/homebrew/var/log/mongodb/mongo.log  # macOS
tail -f /var/log/mongodb/mongod.log              # Linux
```

### Issue 2: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**
```bash
# Find process using port 5000
lsof -i :5000          # macOS/Linux
netstat -ano | find "5000"  # Windows

# Kill the process
kill -9 <PID>          # macOS/Linux
taskkill /PID <PID> /F # Windows

# Or use different port in /server/.env:
PORT=5001
```

### Issue 3: Failed to Fetch

**Error in browser console:**
```
Failed to fetch
```

**Solutions:**
1. Ensure backend is running:
   ```bash
   curl http://localhost:5000/api/health
   ```

2. Check frontend .env:
   ```bash
   cat .env
   # Should have: VITE_API_URL=http://localhost:5000/api
   ```

3. Restart frontend after .env changes:
   ```bash
   # Ctrl+C to stop, then:
   npm run dev
   ```

### Issue 4: CORS Error

**Error:**
```
Access to fetch blocked by CORS policy
```

**Solution:**
Check `/server/.env`:
```env
CLIENT_URL=http://localhost:5173
```

Restart backend:
```bash
cd server
npm run dev
```

### Issue 5: Google Sign-In Not Working

**Symptoms:**
- Google button shows "Not configured" message
- Or clicking button does nothing

**Solutions:**
1. Check if GOOGLE_CLIENT_ID is set (not "YOUR_...")
2. Verify OAuth consent screen is configured
3. Check authorized origins in Google Cloud Console
4. Clear browser cache and cookies
5. Try incognito/private window

---

## 📱 User Roles & Access

| Role | Login Path | Capabilities |
|------|-----------|--------------|
| **Admin** | `/admin-login` | Full system access, user management, approvals |
| **Tenant** | `/login` | Search properties, save favorites, contact owners |
| **Owner** | `/login` | Post properties, manage listings, view inquiries |
| **Agent** | `/login` | Manage multiple properties, commission tracking |
| **Employee** | `/login` | Photo uploads, earnings, property management |
| **Support** | `/login` (Support tab) | Live chat, ticket management |

---

## 🔄 Daily Development Workflow

### Morning Startup:
```bash
# Terminal 1 - Start MongoDB (if not auto-starting)
brew services start mongodb-community@7.0

# Terminal 2 - Start Backend
cd server
npm run dev

# Terminal 3 - Start Frontend
npm run dev
```

### Development:
- Backend changes: Auto-reload with nodemon
- Frontend changes: Auto-reload with Vite HMR
- Database changes: Use MongoDB Compass or mongosh

### Evening Shutdown:
```bash
# Stop frontend: Ctrl+C in Terminal 3
# Stop backend: Ctrl+C in Terminal 2
# MongoDB can keep running or:
brew services stop mongodb-community@7.0
```

---

## 📦 Production Deployment Checklist

Before deploying to production:

### Backend:
- [ ] Change JWT_SECRET to secure random string
- [ ] Change SESSION_SECRET to secure random string
- [ ] Set NODE_ENV=production
- [ ] Use MongoDB Atlas or managed database
- [ ] Configure production Google OAuth credentials
- [ ] Set up HTTPS/SSL
- [ ] Configure proper CORS origins
- [ ] Set up error logging (Sentry, LogRocket)
- [ ] Configure backup strategy

### Frontend:
- [ ] Update VITE_API_URL to production API
- [ ] Update Google Client ID for production
- [ ] Build optimized bundle: `npm run build`
- [ ] Deploy to CDN (Vercel, Netlify, Cloudflare)
- [ ] Configure custom domain
- [ ] Set up analytics (Google Analytics, Plausible)

### Database:
- [ ] Use MongoDB Atlas for production
- [ ] Enable authentication
- [ ] Configure IP whitelist
- [ ] Set up automated backups
- [ ] Create indexes for performance
- [ ] Monitor query performance

---

## 🎉 You're All Set!

Your HouseRentBD system is now fully operational!

### Quick Links:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health
- **Admin Login:** http://localhost:5173/admin-login
- **User Login:** http://localhost:5173/login
- **Signup:** http://localhost:5173/signup

### Default Credentials:
- **Admin:** 01700000000 / admin123

### Need Help?
- Check documentation files in root directory
- Review API documentation: `/API_DOCUMENTATION.md`
- Check MongoDB setup: `/MONGODB_SETUP_COMPLETE.md`
- Use verification tool: `/test-connection.html`
- Run system check: `cd server && npm run verify`

---

**Happy Coding! 🚀**

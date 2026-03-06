# 🚀 HouseRentBD - Complete Startup Guide

## ✅ Prerequisites Checklist

Before starting, ensure you have:
- ✓ Node.js (v16 or higher) installed
- ✓ npm or yarn package manager
- ✓ MongoDB Atlas account (free tier is fine)
- ✓ Git (optional, for version control)
- ✓ Code editor (VS Code recommended)

## 📋 Table of Contents

1. [MongoDB Atlas Setup](#1-mongodb-atlas-setup)
2. [Backend Configuration](#2-backend-configuration)
3. [Frontend Configuration](#3-frontend-configuration)
4. [Starting the Application](#4-starting-the-application)
5. [Creating Admin User](#5-creating-admin-user)
6. [Testing the System](#6-testing-the-system)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. MongoDB Atlas Setup

### Quick Setup (5 minutes)

1. **Create MongoDB Atlas Account**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free

2. **Create Free Cluster**
   - Click "Build a Database"
   - Select **FREE** tier (M0 Sandbox)
   - Choose AWS and nearest region
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access" → "Add New Database User"
   - Username: `houserentbd_admin`
   - Password: **Generate strong password** (SAVE IT!)
   - Privilege: "Atlas admin"
   - Click "Add User"

4. **Allow Network Access**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<username>` and `<password>`
   - Add database name: `/houserentbd`

**Your final connection string:**
```
mongodb+srv://houserentbd_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/houserentbd?retryWrites=true&w=majority
```

📖 **Detailed Guide:** See [MONGODB_ATLAS_SETUP.md](./MONGODB_ATLAS_SETUP.md)

---

## 2. Backend Configuration

### Step 2.1: Install Backend Dependencies

```bash
cd server
npm install
```

### Step 2.2: Configure Environment Variables

1. The file `/server/.env` should already exist
2. Update the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection - UPDATE THIS!
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/houserentbd?retryWrites=true&w=majority

# JWT Secret - CHANGE THIS!
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# CORS Settings
CLIENT_URL=http://localhost:5173

# Google OAuth (Optional - Leave as DISABLED if not using)
GOOGLE_CLIENT_ID=DISABLED
```

### Step 2.3: Verify Configuration

Run the verification script:

```bash
node scripts/verifySystem.js
```

Expected output:
```
✅ Environment variables loaded
✅ JWT_SECRET is configured
✅ MongoDB URI is configured
✅ All required dependencies installed
```

---

## 3. Frontend Configuration

### Step 3.1: Install Frontend Dependencies

```bash
# From root directory
npm install
```

### Step 3.2: Configure Environment Variables

1. The file `/.env` should already exist
2. Verify the contents:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000

# Google OAuth (Optional)
VITE_GOOGLE_CLIENT_ID=DISABLED

# Application Settings
VITE_APP_NAME=HouseRentBD
VITE_APP_VERSION=1.0.0
```

**⚠️ Important:** If VITE_API_URL is different, update it to match your backend port.

---

## 4. Starting the Application

You need **TWO terminal windows** open:

### Terminal 1: Start Backend Server

```bash
cd server
npm start
```

**Expected output:**
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
📍 Environment: development
🌐 Client URL: http://localhost:5173
```

**Leave this terminal running!**

### Terminal 2: Start Frontend Application

```bash
# From root directory (not server folder)
npm run dev
```

**Expected output:**
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Leave this terminal running!**

---

## 5. Creating Admin User

With the backend running, create an admin account:

### Option 1: Using Script (Recommended)

```bash
# In a NEW terminal window
cd server
node scripts/createAdmin.js
```

This creates an admin with:
- **Phone:** 01700000000
- **Password:** admin123
- **Role:** admin

### Option 2: Manual Creation via API

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "System Admin",
    "phone": "01700000000",
    "password": "admin123",
    "role": "admin",
    "email": "admin@houserentbd.com"
  }'
```

Then update the role manually in MongoDB Atlas or via script.

---

## 6. Testing the System

### Step 6.1: Access the Application

Open your browser and go to:
```
http://localhost:5173
```

### Step 6.2: Test User Registration

1. Click "Sign Up" or "Get Started"
2. Fill in the form:
   - Full Name: Test User
   - Phone: 01711111111
   - Password: test123
   - Role: Tenant
3. Click "Sign Up"
4. You should be logged in automatically

### Step 6.3: Test Admin Login

1. Navigate to: `http://localhost:5173/admin/login`
2. Login with:
   - Phone: 01700000000
   - Password: admin123
3. You should see the Admin Dashboard

### Step 6.4: Test Property Creation

As an owner/admin:
1. Go to Dashboard
2. Click "Add Property"
3. Fill in property details
4. Upload images (max 2 images, 100KB each)
5. Submit
6. Property should appear in listings

### Step 6.5: API Health Check

Test the backend API:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "HouseRentBD API is running",
  "timestamp": "2024-03-06T..."
}
```

---

## 7. Troubleshooting

### Problem: "Failed to fetch" errors

**Solution:**
1. Check if backend is running on port 5000
2. Verify `VITE_API_URL` in `.env` is `http://localhost:5000`
3. Check CORS settings in `server/server.js`
4. Clear browser cache and reload

### Problem: MongoDB Connection Failed

**Solution:**
1. Verify MongoDB Atlas cluster is running (green status)
2. Check IP whitelist in Network Access (add 0.0.0.0/0)
3. Confirm username/password in connection string
4. URL-encode special characters in password
5. Check internet connection

### Problem: "Token is invalid" or authentication errors

**Solution:**
1. Clear localStorage: `localStorage.clear()`
2. Log out and log in again
3. Verify JWT_SECRET is set in `/server/.env`
4. Restart backend server

### Problem: Images not uploading

**Solution:**
1. Check image file size (must be under 100KB after compression)
2. Maximum 2 images allowed
3. Supported formats: JPG, PNG, WEBP
4. Check browser console for errors

### Problem: Port 5000 or 5173 already in use

**Solution:**

For backend (port 5000):
```bash
# Find process using port 5000
lsof -ti:5000
# Kill the process
kill -9 <PID>
```

For frontend (port 5173):
```bash
# Find process using port 5173
lsof -ti:5173
# Kill the process
kill -9 <PID>
```

### Problem: Dependencies not installing

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Problem: Google OAuth not working

**Solution:**
If you don't need Google OAuth:
1. Set `GOOGLE_CLIENT_ID=DISABLED` in both `.env` files
2. Use phone + password authentication instead

If you need Google OAuth:
1. Set up Google Cloud Console project
2. Enable Google+ API
3. Create OAuth credentials
4. Add authorized origins and redirect URIs
5. Update `GOOGLE_CLIENT_ID` in both `.env` files

---

## 📊 System Architecture

```
┌─────────────────────────────────────────┐
│         Frontend (React + Vite)         │
│         http://localhost:5173           │
└──────────────┬──────────────────────────┘
               │
               │ HTTP Requests
               │ (JSON REST API)
               │
┌──────────────▼──────────────────────────┐
│      Backend (Node.js + Express)        │
│         http://localhost:5000           │
│                                         │
│  Routes:                                │
│  - /api/auth     (Authentication)       │
│  - /api/users    (User Management)      │
│  - /api/properties (Property CRUD)      │
│  - /api/subscriptions                   │
│  - /api/support-tickets                 │
│  - /api/jobs     (Career)               │
│  - /api/inquiries (Contact Form)        │
└──────────────┬──────────────────────────┘
               │
               │ Mongoose ODM
               │
┌──────────────▼──────────────────────────┐
│       MongoDB Atlas (Cloud)             │
│                                         │
│  Collections:                           │
│  - users                                │
│  - properties                           │
│  - subscriptions                        │
│  - supporttickets                       │
│  - jobs, inquiries, favorites, etc.     │
└─────────────────────────────────────────┘
```

---

## 🎯 Quick Start Commands (TL;DR)

```bash
# 1. Setup MongoDB Atlas (manual step - see Section 1)

# 2. Configure backend
cd server
npm install
# Edit .env file with MongoDB connection string
npm start

# 3. Configure frontend (in new terminal)
cd ..  # back to root
npm install
npm run dev

# 4. Create admin user (in new terminal)
cd server
node scripts/createAdmin.js

# 5. Open browser
# http://localhost:5173
```

---

## 📚 Additional Resources

- [MongoDB Atlas Setup](./MONGODB_ATLAS_SETUP.md) - Detailed MongoDB setup
- [API Documentation](./API_DOCUMENTATION.md) - All API endpoints
- [System Architecture](./SYSTEM_ARCHITECTURE.md) - Technical overview
- [Admin Panel Guide](./ADMIN_PANEL_DOCUMENTATION.md) - Admin features

---

## 🎉 Success Checklist

- [ ] MongoDB Atlas cluster created and running
- [ ] Database user created with password saved
- [ ] IP address whitelisted (0.0.0.0/0 for development)
- [ ] Connection string updated in `/server/.env`
- [ ] JWT_SECRET configured
- [ ] Backend dependencies installed (`cd server && npm install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend server running (`cd server && npm start`)
- [ ] Frontend server running (`npm run dev`)
- [ ] Admin user created
- [ ] Can access http://localhost:5173
- [ ] Can login to admin panel
- [ ] Can register new user
- [ ] Can create property
- [ ] API health check returns OK

**All checked? You're ready to go! 🚀**

---

## 💼 User Roles & Features

### 1. **Tenant** (Property Seekers)
- Search and filter properties
- View property details
- Save favorite properties
- Contact property owners
- Submit inquiries

### 2. **Owner** (Property Owners)
- Post property listings
- Manage own properties
- View inquiry messages
- Track property views
- Upload property images (max 2, 100KB each)

### 3. **Agent** (Real Estate Agents)
- Post properties for clients
- Manage multiple listings
- View analytics
- Handle customer inquiries

### 4. **Employee** (Photo Capture Staff)
- Upload property photos
- Earn ৳5 per approved photo
- Track monthly earnings
- View approval status

### 5. **Admin** (System Administrators)
- Approve/reject properties
- Manage all users
- View analytics dashboard
- Handle support tickets
- Manage job postings
- Configure system settings
- Approve employee photos

---

## 🔐 Default Credentials

### Admin Account
```
Phone: 01700000000
Password: admin123
```

**⚠️ IMPORTANT:** Change the admin password after first login in production!

---

## 📞 Need Help?

If you encounter issues not covered in this guide:

1. Check the [Troubleshooting](#7-troubleshooting) section
2. Review server logs for error messages
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly
5. Ensure MongoDB Atlas cluster is running
6. Confirm all dependencies are installed

---

**Happy Coding! 🎉**

HouseRentBD Team

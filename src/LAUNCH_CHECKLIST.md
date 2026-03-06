# ✅ HouseRentBD Launch Checklist

Use this checklist to ensure your system is ready to run.

---

## 📋 Pre-Launch Checklist

### ✅ MongoDB Atlas Setup

- [ ] Created MongoDB Atlas account
- [ ] Created M0 free cluster
- [ ] Created database user with password
- [ ] Saved password securely
- [ ] Whitelisted IP address (0.0.0.0/0 for dev)
- [ ] Copied connection string
- [ ] Replaced `<username>` and `<password>` in connection string
- [ ] Added database name `/houserentbd` to connection string
- [ ] Updated `/server/.env` with connection string

**Connection string format:**
```
mongodb+srv://username:password@cluster.mongodb.net/houserentbd?retryWrites=true&w=majority
```

---

### ✅ Environment Configuration

- [ ] File `/.env` exists
- [ ] File `/.env.example` exists
- [ ] File `/server/.env` exists
- [ ] File `/server/.env.example` exists
- [ ] `VITE_API_URL=http://localhost:5000` in `/.env`
- [ ] `MONGODB_URI` updated in `/server/.env`
- [ ] `JWT_SECRET` configured in `/server/.env`
- [ ] `CLIENT_URL=http://localhost:5173` in `/server/.env`

**Verify with:**
```bash
npm run check
```

---

### ✅ Dependencies Installation

- [ ] Frontend dependencies installed
  ```bash
  npm install
  ```
- [ ] Backend dependencies installed
  ```bash
  cd server && npm install
  ```
- [ ] No installation errors
- [ ] `node_modules` folder exists in root
- [ ] `node_modules` folder exists in `/server`

---

### ✅ Backend Launch

- [ ] Navigate to server directory
  ```bash
  cd server
  ```
- [ ] Start backend server
  ```bash
  npm start
  ```
- [ ] See message: `✅ MongoDB Connected Successfully`
- [ ] See message: `🚀 Server running on port 5000`
- [ ] No error messages
- [ ] Backend terminal remains running

**Test health check:**
```bash
curl http://localhost:5000/api/health
```

Expected: `{"status":"OK","message":"HouseRentBD API is running",...}`

---

### ✅ Frontend Launch

- [ ] Open NEW terminal window
- [ ] Navigate to root directory
- [ ] Start frontend server
  ```bash
  npm run dev
  ```
- [ ] See message: `Local: http://localhost:5173/`
- [ ] No error messages
- [ ] Frontend terminal remains running

---

### ✅ Browser Access

- [ ] Open browser
- [ ] Navigate to `http://localhost:5173`
- [ ] Homepage loads without errors
- [ ] No console errors (press F12 to check)
- [ ] Can see navigation menu
- [ ] Can see property listings or landing page

---

### ✅ Admin Account Setup

- [ ] Open THIRD terminal window
- [ ] Navigate to server directory
  ```bash
  cd server
  ```
- [ ] Run admin creation script
  ```bash
  node scripts/createAdmin.js
  ```
- [ ] See success message
- [ ] Admin account created:
  - Phone: `01700000000`
  - Password: `admin123`

---

### ✅ Authentication Testing

#### Test User Registration
- [ ] Click "Sign Up" button
- [ ] Fill registration form:
  - Full Name: `Test User`
  - Phone: `01711111111` (or any valid number)
  - Password: `test123`
  - Role: `Tenant`
- [ ] Submit form
- [ ] Registration successful
- [ ] Redirected to dashboard

#### Test User Login
- [ ] Log out if logged in
- [ ] Click "Login" button
- [ ] Enter credentials:
  - Phone: `01711111111`
  - Password: `test123`
- [ ] Login successful
- [ ] Redirected to user dashboard

#### Test Admin Login
- [ ] Navigate to `http://localhost:5173/admin/login`
- [ ] Enter admin credentials:
  - Phone: `01700000000`
  - Password: `admin123`
- [ ] Login successful
- [ ] See admin dashboard
- [ ] Can access admin features

---

### ✅ Core Features Testing

#### Property Creation
- [ ] Login as Owner or Admin
- [ ] Navigate to "Add Property" or "Post Property"
- [ ] Fill property form:
  - Title
  - Description
  - Price
  - Location
  - Property type
  - Bedrooms, bathrooms, etc.
- [ ] Upload 1-2 images (max 2, under 5MB each)
- [ ] Submit form
- [ ] Property created successfully
- [ ] Images compressed automatically
- [ ] Property appears in listings

#### Property Search
- [ ] Navigate to property listings
- [ ] Use search filters:
  - Location
  - Price range
  - Property type
  - Bedrooms
- [ ] Filters work correctly
- [ ] Results update dynamically

#### Support Ticket
- [ ] Navigate to contact/support page
- [ ] Fill support form:
  - Name
  - Email
  - Phone
  - Subject
  - Category
  - Message
- [ ] Submit form
- [ ] Ticket created successfully
- [ ] Ticket appears in admin panel (if logged in as admin)

---

### ✅ API Endpoints Testing

#### Health Check
```bash
curl http://localhost:5000/api/health
```
- [ ] Returns `{"status":"OK"}`

#### Authentication
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"01700000000","password":"admin123"}'
```
- [ ] Returns `{"success":true,"accessToken":"..."}`

#### Properties List
```bash
curl http://localhost:5000/api/properties
```
- [ ] Returns `{"success":true,"properties":[...]}`

---

### ✅ System Stability

- [ ] Backend server runs without crashes
- [ ] Frontend server runs without crashes
- [ ] No memory leaks observed
- [ ] MongoDB connection stable
- [ ] Can refresh browser without errors
- [ ] Can navigate between pages
- [ ] Can logout and login again

---

### ✅ Documentation Review

- [ ] Read [START_HERE.md](./START_HERE.md)
- [ ] Skimmed [COMPLETE_STARTUP_GUIDE.md](./COMPLETE_STARTUP_GUIDE.md)
- [ ] Reviewed [MONGODB_ATLAS_SETUP.md](./MONGODB_ATLAS_SETUP.md)
- [ ] Checked [SYSTEM_READY.md](./SYSTEM_READY.md)
- [ ] Understand troubleshooting steps

---

## 🎉 Launch Confirmation

### All Green? You're Ready! ✅

If all checkboxes above are checked, your HouseRentBD system is:
- ✅ Properly configured
- ✅ Fully functional
- ✅ Ready for development
- ✅ Ready for testing
- ✅ Ready for deployment (after production config)

---

## 🐛 Issues Found?

### Common Issues & Quick Fixes

#### ❌ Backend won't connect to MongoDB
**Fix:**
1. Check `/server/.env` has correct `MONGODB_URI`
2. Verify IP is whitelisted in MongoDB Atlas
3. Check username/password in connection string
4. Try URL-encoding special characters in password

#### ❌ "Failed to fetch" errors
**Fix:**
1. Ensure backend is running (`cd server && npm start`)
2. Check `VITE_API_URL=http://localhost:5000` in `/.env`
3. Clear browser cache (Ctrl+Shift+Delete)
4. Restart both servers

#### ❌ Port already in use
**Fix:**
```bash
# Kill port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

#### ❌ Dependencies won't install
**Fix:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json
rm -rf server/node_modules server/package-lock.json

# Reinstall
npm install
cd server && npm install
```

---

## 📞 Need More Help?

**Documentation:**
- Quick Start: [START_HERE.md](./START_HERE.md)
- Detailed Guide: [COMPLETE_STARTUP_GUIDE.md](./COMPLETE_STARTUP_GUIDE.md)
- MongoDB Setup: [MONGODB_ATLAS_SETUP.md](./MONGODB_ATLAS_SETUP.md)
- Troubleshooting: See Section 7 in COMPLETE_STARTUP_GUIDE.md

**Verification Tools:**
```bash
npm run check  # Automated setup verification
```

---

## 🚀 Production Deployment Checklist

**Before deploying to production:**

- [ ] Update MongoDB URI to production database
- [ ] Change JWT_SECRET to strong random string
- [ ] Set NODE_ENV=production
- [ ] Update CORS origin to production domain
- [ ] Enable HTTPS/SSL
- [ ] Configure production environment variables
- [ ] Change admin password
- [ ] Set up database backups
- [ ] Configure monitoring/logging
- [ ] Test all features in production
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure CDN for static assets
- [ ] Enable database encryption
- [ ] Review security headers
- [ ] Set up auto-scaling (if needed)

---

## 📊 Performance Checklist

- [ ] Image compression working (600x600px, 50%)
- [ ] Response time < 200ms for API calls
- [ ] Page load time < 2 seconds
- [ ] No console errors
- [ ] No memory leaks
- [ ] Database queries optimized
- [ ] Rate limiting working

---

## 🔒 Security Checklist

- [ ] JWT authentication working
- [ ] Passwords hashed with bcrypt
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Security headers present (Helmet.js)
- [ ] Input validation working
- [ ] No sensitive data in code
- [ ] Environment variables secured
- [ ] Admin routes protected
- [ ] Role-based access working

---

**Happy Launching! 🎊**

Save this checklist and use it each time you set up the system!

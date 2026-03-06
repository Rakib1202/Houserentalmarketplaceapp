# 🚀 HouseRentBD - Complete Startup Instructions

## ✅ Environment Files Created

All required `.env` files have been created:
- ✅ `/.env` - Frontend configuration
- ✅ `/.env.example` - Frontend template
- ✅ `/server/.env` - Backend configuration  
- ✅ `/server/.env.example` - Backend template

---

## 🔧 Step-by-Step Startup Process

### **Step 1: Verify MongoDB is Running**

#### macOS:
```bash
# Check if MongoDB is running
brew services list | grep mongodb

# If not running, start it:
brew services start mongodb-community@7.0

# Verify it's running on port 27017:
lsof -i :27017
```

#### Linux:
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# If not running, start it:
sudo systemctl start mongod

# Verify it's running:
sudo systemctl status mongod
```

#### Windows:
MongoDB usually auto-starts. If not:
```bash
net start MongoDB
```

**Expected:** MongoDB should be running on port 27017

---

### **Step 2: Install Backend Dependencies (First Time Only)**

```bash
cd server
npm install
```

**Expected:** All dependencies installed successfully

---

### **Step 3: Start Backend Server**

```bash
# Make sure you're in the /server directory
cd server
npm run dev
```

**Expected Output:**
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
📍 Environment: development
🌐 Client URL: http://localhost:5173
```

**⚠️ Keep this terminal window open - don't close it!**

---

### **Step 4: Test Backend Health (Optional but Recommended)**

Open a new terminal and run:
```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "HouseRentBD API is running",
  "timestamp": "2026-03-05T..."
}
```

Or open in browser: http://localhost:5000/api/health

---

### **Step 5: Install Frontend Dependencies (First Time Only)**

Open a new terminal (keep backend running):
```bash
# Navigate to the root directory (where package.json is)
cd /path/to/your/project
npm install
```

**Expected:** All dependencies installed successfully

---

### **Step 6: Start Frontend Server**

```bash
# Make sure you're in the root directory
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**⚠️ Keep this terminal window open too!**

---

### **Step 7: Open Application in Browser**

Open your browser and go to:
```
http://localhost:5173
```

**Expected:** Homepage loads without errors

---

## 🧪 Testing the Fix

### **Test 1: Check Browser Console**
1. Press F12 to open Developer Tools
2. Go to Console tab
3. ❌ Should see NO "Failed to fetch" errors
4. ✅ Should see API configuration log

### **Test 2: Test Login**
1. Navigate to: http://localhost:5173/login
2. Try logging in (test account or create new one)
3. ✅ Should work without errors

### **Test 3: Test Admin Login**
1. Navigate to: http://localhost:5173/admin-login
2. Phone: `01700000000`
3. Password: `admin123`
4. ✅ Should redirect to admin dashboard

---

## 🔴 Troubleshooting Common Issues

### **Error: "Failed to fetch"**

**Cause:** Backend is not running

**Solution:**
```bash
# Terminal 1: Start backend
cd server
npm run dev

# Wait for: ✅ MongoDB Connected Successfully
# Then test in Terminal 2:
curl http://localhost:5000/api/health
```

---

### **Error: "MongoDB Connection Error"**

**Cause:** MongoDB is not running

**Solution:**
```bash
# macOS:
brew services start mongodb-community@7.0

# Linux:
sudo systemctl start mongod

# Verify:
mongosh
# Should connect without errors
```

---

### **Error: Port 5000 already in use**

**Cause:** Another process is using port 5000

**Solution:**
```bash
# Find process using port 5000:
lsof -i :5000

# Kill the process (replace PID):
kill -9 PID

# Or change port in /server/.env:
PORT=5001
```

---

### **Error: Port 5173 already in use**

**Cause:** Another Vite server is running

**Solution:**
```bash
# Find and kill the process:
lsof -i :5173
kill -9 PID

# Or Vite will automatically use next available port (5174)
```

---

### **Frontend still shows "Failed to fetch"**

**Solution:** Restart the frontend (Vite only reads .env on startup)
```bash
# Stop frontend (Ctrl+C in terminal)
# Then start again:
npm run dev
```

---

## 📋 Quick Reference - Running Processes

You should have **3 separate terminal windows** open:

### **Terminal 1: MongoDB** (Optional - if not auto-started)
```bash
# macOS
brew services start mongodb-community@7.0
# This runs in background, terminal can be closed
```

### **Terminal 2: Backend**
```bash
cd server
npm run dev
# Keep this terminal open!
```

### **Terminal 3: Frontend**
```bash
npm run dev
# Keep this terminal open!
```

---

## ✅ Success Checklist

- [ ] MongoDB is running (port 27017)
- [ ] Backend is running (port 5000)
- [ ] Backend shows: "✅ MongoDB Connected Successfully"
- [ ] Health check works: `curl http://localhost:5000/api/health`
- [ ] Frontend is running (port 5173)
- [ ] Browser loads: http://localhost:5173
- [ ] No "Failed to fetch" errors in console
- [ ] Login page works

---

## 🎯 Complete Startup Command Reference

### **Full Startup (Fresh Start):**
```bash
# Terminal 1: MongoDB
brew services start mongodb-community@7.0  # macOS
# OR
sudo systemctl start mongod                # Linux

# Terminal 2: Backend
cd server
npm install          # First time only
npm run dev

# Terminal 3: Frontend  
npm install          # First time only
npm run dev
```

### **Daily Startup (After First Time):**
```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
npm run dev
```

---

## 📊 Environment Variables Reference

### **Frontend (/.env):**
```env
VITE_API_URL=http://localhost:5000/api
```

### **Backend (/server/.env):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/houserentbd
JWT_SECRET=houserentbd-super-secret-jwt-key-2024-change-in-production
CLIENT_URL=http://localhost:5173
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# Google OAuth (Optional - currently disabled)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

---

## 🆘 Still Having Issues?

### **Check Each Service Individually:**

1. **MongoDB:**
   ```bash
   mongosh
   # Should connect to: mongodb://localhost:27017
   ```

2. **Backend:**
   ```bash
   curl http://localhost:5000/api/health
   # Should return: {"status":"OK",...}
   ```

3. **Frontend:**
   - Open browser to: http://localhost:5173
   - Press F12 for console
   - Check for errors

### **Clear Everything and Restart:**
```bash
# Stop all servers (Ctrl+C in each terminal)

# Clear node modules (if needed)
rm -rf node_modules server/node_modules
npm install
cd server && npm install && cd ..

# Restart MongoDB
brew services restart mongodb-community@7.0

# Start backend
cd server && npm run dev &

# Start frontend
npm run dev
```

---

## ✅ **YOU'RE ALL SET!**

Once all three services are running:
- MongoDB on port 27017
- Backend on port 5000  
- Frontend on port 5173

Your HouseRentBD application should be fully functional! 🎉

**Default Admin Credentials:**
- Phone: `01700000000`
- Password: `admin123`

---

**Last Updated:** March 5, 2026
**Status:** ✅ All environment files created and ready

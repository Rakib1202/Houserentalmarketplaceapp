# 🚨 FAILED TO FETCH ERROR - COMPLETE DIAGNOSTIC GUIDE

## ⚡ IMMEDIATE FIX - DO THIS NOW!

The "Failed to fetch" error means **your backend is NOT running**. Follow these steps:

---

## 📋 STEP-BY-STEP FIX (5 MINUTES)

### **Step 1: Open 3 Terminal Windows**

You need 3 separate terminal windows/tabs.

---

### **Step 2: Terminal 1 - Start MongoDB**

```bash
# macOS
brew services start mongodb-community@7.0

# Linux  
sudo systemctl start mongod

# Windows (usually auto-starts)
# If not: net start MongoDB
```

**Verify it's running:**
```bash
mongosh
# Should connect. Type: exit
```

**Expected:**
```
Current Mongosh Log ID: ...
Connecting to: mongodb://127.0.0.1:27017
✅ Connected to MongoDB
```

---

### **Step 3: Terminal 2 - Start Backend**

```bash
# Navigate to server directory
cd server

# Install dependencies (only first time)
npm install

# Start the backend
npm run dev
```

**WAIT FOR THESE MESSAGES:**
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
📍 Environment: development
🌐 Client URL: http://localhost:5173
```

**If you don't see these messages, the backend is NOT running!**

---

### **Step 4: Terminal 3 - Test Backend**

```bash
# Test if backend is responding
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "HouseRentBD API is running",
  "timestamp": "2026-02-23T..."
}
```

**❌ If you get "Connection refused":**
- Backend is not running
- Go back to Terminal 2 and start it

**❌ If you get "Failed to connect":**
- MongoDB is not running
- Go back to Terminal 1 and start it

---

### **Step 5: Terminal 4 - Start Frontend**

```bash
# In project root directory
# If frontend is already running, STOP IT FIRST (Ctrl+C)

npm run dev
```

**Expected:**
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

### **Step 6: Open Browser**

1. Open: http://localhost:5173/login
2. Press F12 (open Developer Tools)
3. Go to Console tab
4. Look for these messages:

**✅ GOOD (Working):**
```
🔧 API Configuration: {
  VITE_API_URL: 'http://localhost:5000/api',
  API_BASE_URL: 'http://localhost:5000/api',
  mode: 'development'
}
```

**❌ BAD (Not Working):**
```
API Error: TypeError: Failed to fetch
```

---

## 🔍 VISUAL TEST PAGE

Open this test page in your browser:

```
file:///[YOUR_PROJECT_PATH]/test-connection.html
```

Or just double-click on `test-connection.html` file.

This page will:
- ✅ Show you if backend is running
- ✅ Test API connection
- ✅ Test admin login
- ✅ Show CORS configuration

---

## 🎯 COMMON PROBLEMS & SOLUTIONS

### **Problem 1: MongoDB Not Running**

**Symptoms:**
```
❌ MongoDB Connection Error: connect ECONNREFUSED
```

**Solution:**
```bash
# Start MongoDB
brew services start mongodb-community@7.0

# Check if running
brew services list | grep mongodb

# Should show:
mongodb-community  started  ...
```

---

### **Problem 2: Backend Won't Start**

**Symptoms:**
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
cd server
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

### **Problem 3: Port 5000 Already in Use**

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Find what's using port 5000
lsof -i :5000

# Kill it (replace PID with actual number)
kill -9 <PID>

# Or use a different port in /server/.env:
PORT=5001
```

---

### **Problem 4: Frontend Shows "Failed to fetch"**

**Symptoms:**
- Browser console shows: `API Error: TypeError: Failed to fetch`
- Login doesn't work
- No data loads

**Solution:**
```bash
# 1. Check backend is running
curl http://localhost:5000/api/health

# 2. If fails, start backend:
cd server
npm run dev

# 3. Wait for: ✅ MongoDB Connected Successfully

# 4. Restart frontend:
# Stop with Ctrl+C, then:
npm run dev

# 5. Refresh browser with cache clear:
# F12 → Right-click refresh → Empty Cache and Hard Reload
```

---

### **Problem 5: .env File Not Loaded**

**Symptoms:**
- Console shows: `VITE_API_URL: undefined`
- API requests go to wrong URL

**Solution:**
```bash
# 1. Check .env exists
ls -la .env

# 2. Check content
cat .env

# Should show:
VITE_API_URL=http://localhost:5000/api

# 3. If missing, create it:
echo "VITE_API_URL=http://localhost:5000/api" > .env

# 4. RESTART frontend (required!):
# Stop with Ctrl+C, then:
npm run dev
```

---

## 🧪 VERIFICATION CHECKLIST

Go through this checklist:

### **System Status:**
- [ ] MongoDB is running (port 27017)
- [ ] Backend is running (port 5000)
- [ ] Frontend is running (port 5173)
- [ ] `.env` file exists with `VITE_API_URL`
- [ ] `/server/.env` file exists with MongoDB URI

### **Network Tests:**
- [ ] `curl http://localhost:5000/api/health` returns JSON
- [ ] Browser can access http://localhost:5173
- [ ] No firewall blocking ports

### **Console Checks:**
- [ ] No "Failed to fetch" errors
- [ ] API Configuration shows correct URL
- [ ] No CORS errors
- [ ] No 404 errors

### **Functional Tests:**
- [ ] Can load login page
- [ ] Can type in forms
- [ ] Can click login button
- [ ] Login either succeeds or shows proper error

---

## 📊 DEBUGGING LOGS

### **Check Backend Logs:**

Look at Terminal 2 (where backend is running).

**✅ GOOD:**
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
GET /api/health 200 2.345 ms - 123
POST /api/auth/login 200 45.678 ms - 456
```

**❌ BAD:**
```
❌ MongoDB Connection Error: connect ECONNREFUSED
```

```
Error: listen EADDRINUSE: address already in use :::5000
```

---

### **Check Frontend Console:**

Press F12 in browser, go to Console tab.

**✅ GOOD:**
```
🔧 API Configuration: { VITE_API_URL: 'http://localhost:5000/api', ... }
🌐 API Request: { url: 'http://localhost:5000/api/health', method: 'GET', ... }
✅ API Success: { url: 'http://localhost:5000/api/health', status: 200 }
```

**❌ BAD:**
```
API Error: TypeError: Failed to fetch
❌ FAILED TO FETCH ERROR!
📍 Target URL: http://localhost:5000/api/auth/login
```

---

## 🚀 COMPLETE STARTUP SEQUENCE

**Copy and paste these commands in order:**

### **Terminal 1:**
```bash
brew services start mongodb-community@7.0
mongosh
# Type: exit
```

### **Terminal 2:**
```bash
cd server
npm run dev
# Wait for: ✅ MongoDB Connected Successfully
```

### **Terminal 3:**
```bash
curl http://localhost:5000/api/health
# Should return JSON
```

### **Terminal 4:**
```bash
npm run dev
# Wait for: ➜  Local:   http://localhost:5173/
```

### **Browser:**
```
Open: http://localhost:5173/login
Press F12 (console)
Look for: 🔧 API Configuration
Try logging in
```

---

## 🔎 PORT STATUS CHECK

Run this to see all your ports:

```bash
echo "MongoDB (27017):"
lsof -i :27017 | grep LISTEN

echo ""
echo "Backend (5000):"
lsof -i :5000 | grep LISTEN

echo ""
echo "Frontend (5173):"
lsof -i :5173 | grep LISTEN
```

**Expected output:**
```
MongoDB (27017):
mongod    12345 user    9u  IPv4  ...  TCP *:27017 (LISTEN)

Backend (5000):
node      12346 user   18u  IPv4  ...  TCP *:5000 (LISTEN)

Frontend (5173):
node      12347 user   19u  IPv4  ...  TCP *:5173 (LISTEN)
```

**If any section is empty, that service is NOT running!**

---

## 💊 NUCLEAR OPTION (If Nothing Works)

If you've tried everything and it still doesn't work:

```bash
# 1. Stop everything
brew services stop mongodb-community@7.0
# Press Ctrl+C in all terminals

# 2. Kill all node processes
killall node

# 3. Clean everything
rm -rf node_modules server/node_modules
rm -rf package-lock.json server/package-lock.json

# 4. Reinstall
npm install
cd server && npm install && cd ..

# 5. Restart everything in order:

# Terminal 1: MongoDB
brew services start mongodb-community@7.0

# Terminal 2: Backend
cd server && npm run dev

# Terminal 3: Frontend
npm run dev

# 6. Test
curl http://localhost:5000/api/health
open http://localhost:5173/login
```

---

## 📞 STILL NOT WORKING?

If you've tried everything above and it STILL doesn't work:

1. **Check your error messages carefully**
   - Look at Terminal 2 (backend) for errors
   - Look at browser console for errors
   - Copy the EXACT error message

2. **Check your environment files:**
   ```bash
   cat .env
   cat server/.env
   ```
   Make sure they have the correct values.

3. **Check Node.js version:**
   ```bash
   node --version
   # Should be v18.x or higher
   ```

4. **Check MongoDB installation:**
   ```bash
   mongosh --version
   # Should be installed
   ```

5. **Check if you're in the right directory:**
   ```bash
   pwd
   ls
   # Should see: package.json, server/, components/, etc.
   ```

---

## ✅ SUCCESS INDICATORS

You know it's working when you see:

### **Terminal 2 (Backend):**
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
```

### **Terminal 4 (Frontend):**
```
➜  Local:   http://localhost:5173/
```

### **Browser Console:**
```
🔧 API Configuration: { VITE_API_URL: 'http://localhost:5000/api', ... }
```

### **Login Page:**
- Page loads without errors
- Can type in forms
- Can click buttons
- Login works (or shows proper error)

---

## 🎉 SUMMARY

**The "Failed to fetch" error means ONE THING:**

**YOUR BACKEND IS NOT RUNNING!**

**The fix:**
1. Start MongoDB
2. Start Backend (`cd server && npm run dev`)
3. Wait for "✅ MongoDB Connected Successfully"
4. Start Frontend (`npm run dev`)
5. Test login

**That's it!**

---

**Date:** February 23, 2026

**Status:** Diagnostic guide ready

**Next step:** Follow the steps above to start your backend!

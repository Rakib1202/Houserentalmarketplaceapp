# 🔄 HouseRentBD System Flow

## 📊 **SYSTEM ARCHITECTURE**

```
┌───────────────────────────────────────────────────────────────┐
│                       YOUR COMPUTER                            │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────┐                                           │
│  │   Terminal 1   │                                           │
│  │   MongoDB      │   Port 27017                              │
│  │   Database     │   Running? ☐                              │
│  └────────┬───────┘                                           │
│           │                                                    │
│           ▼                                                    │
│  ┌────────────────┐                                           │
│  │   Terminal 2   │                                           │
│  │   Backend      │   Port 5000                               │
│  │   Express.js   │   Running? ☐                              │
│  │   (server/)    │   API: /api/*                             │
│  └────────┬───────┘                                           │
│           │                                                    │
│           ▼                                                    │
│  ┌────────────────┐                                           │
│  │   Terminal 3   │                                           │
│  │   Frontend     │   Port 5173                               │
│  │   React+Vite   │   Running? ☐                              │
│  └────────┬───────┘                                           │
│           │                                                    │
│           ▼                                                    │
│  ┌────────────────┐                                           │
│  │    Browser     │   http://localhost:5173                   │
│  │   User sees    │   Working? ☐                              │
│  │   your app     │                                           │
│  └────────────────┘                                           │
│                                                                │
└───────────────────────────────────────────────────────────────┘
```

---

## 🔗 **REQUEST FLOW**

### **When user logs in:**

```
1. Browser
   ↓
   User types phone & password
   Clicks "Login"
   ↓

2. Frontend (React)
   ↓
   Reads .env file: VITE_API_URL=http://localhost:5000/api
   Makes POST request to: http://localhost:5000/api/auth/login
   ↓

3. Backend (Express)
   ↓
   Receives request at /api/auth/login
   Validates credentials
   Queries MongoDB
   ↓

4. MongoDB
   ↓
   Finds user in database
   Returns user data
   ↓

5. Backend
   ↓
   Creates JWT token
   Sends response: { accessToken: "...", user: {...} }
   ↓

6. Frontend
   ↓
   Receives token
   Stores in localStorage
   Redirects to dashboard
   ↓

7. Browser
   ↓
   Shows dashboard
   ✅ Success!
```

---

## ❌ **WHERE IT FAILS**

### **"Failed to fetch" happens when:**

```
Browser
   ↓
Frontend tries: fetch('http://localhost:5000/api/auth/login')
   ↓
   ❌ FAILS because:
   
   Option 1: Backend not running
   ┌─────────────────────────┐
   │  Port 5000: CLOSED      │
   │  Nothing listening      │
   └─────────────────────────┘
   
   Option 2: MongoDB not running
   ┌─────────────────────────┐
   │  Backend running but    │
   │  can't connect to DB    │
   └─────────────────────────┘
   
   Option 3: Wrong URL
   ┌─────────────────────────┐
   │  Frontend trying to     │
   │  connect to wrong port  │
   └─────────────────────────┘
```

---

## ✅ **STARTUP SEQUENCE**

### **Correct order to start:**

```
Step 1: MongoDB
─────────────────
Terminal 1:
$ brew services start mongodb-community@7.0

Status: ✅ Running
Port:   27017
Check:  $ mongosh


Step 2: Backend
─────────────────
Terminal 2:
$ cd server
$ npm run dev

Wait for:
✅ MongoDB Connected Successfully
🚀 Server running on port 5000

Status: ✅ Running
Port:   5000
Check:  $ curl http://localhost:5000/api/health


Step 3: Frontend
─────────────────
Terminal 3:
$ npm run dev

Wait for:
➜  Local:   http://localhost:5173/

Status: ✅ Running
Port:   5173
Check:  Open browser → http://localhost:5173


Step 4: Test
─────────────────
Browser:
1. Open http://localhost:5173/login
2. Press F12 (DevTools)
3. Check Console
4. Should see: 🔧 API Configuration
5. Try logging in
6. Should work! ✅
```

---

## 🔍 **DEPENDENCY CHAIN**

```
Frontend depends on Backend
    ↓
Backend depends on MongoDB
    ↓
MongoDB depends on nothing (base layer)

Therefore, start from bottom up:
1. MongoDB  ← Start first
2. Backend  ← Start second (needs MongoDB)
3. Frontend ← Start third (needs Backend)
```

---

## 🚫 **COMMON ERRORS**

### **Error 1: Cannot connect to MongoDB**

```
Backend Terminal:
❌ MongoDB Connection Error: connect ECONNREFUSED 127.0.0.1:27017

Cause:  MongoDB is not running
Fix:    brew services start mongodb-community@7.0
```

### **Error 2: Port already in use**

```
Backend Terminal:
❌ Error: listen EADDRINUSE: address already in use :::5000

Cause:  Something else using port 5000
Fix:    lsof -i :5000
        kill -9 <PID>
```

### **Error 3: Failed to fetch**

```
Browser Console:
❌ API Error: TypeError: Failed to fetch

Cause:  Backend is not running
Fix:    cd server && npm run dev
        Wait for: ✅ MongoDB Connected Successfully
```

### **Error 4: Module not found**

```
Terminal:
❌ Error: Cannot find module 'express'

Cause:  Dependencies not installed
Fix:    npm install (or cd server && npm install)
```

---

## 🎯 **PORT REFERENCE**

```
┌──────────┬──────────────┬─────────────────────┐
│ Service  │ Port         │ Check Command       │
├──────────┼──────────────┼─────────────────────┤
│ MongoDB  │ 27017        │ mongosh             │
│ Backend  │ 5000         │ lsof -i :5000       │
│ Frontend │ 5173         │ lsof -i :5173       │
└──────────┴──────────────┴─────────────────────┘
```

---

## 📁 **ENVIRONMENT FILES**

### **Frontend (.env)**
```
Location: /.env
Content:  VITE_API_URL=http://localhost:5000/api
Purpose:  Tell frontend where backend is
Used by:  /utils/api.ts
```

### **Backend (/server/.env)**
```
Location: /server/.env
Content:  PORT=5000
          MONGODB_URI=mongodb://localhost:27017/houserentbd
          JWT_SECRET=...
Purpose:  Configure backend server
Used by:  /server/server.js
```

---

## 🔐 **DATA FLOW**

### **Login Example:**

```
User Input:
┌─────────────────────┐
│ Phone: 01700000000  │
│ Password: admin123  │
└─────────────────────┘
          ↓
Frontend:
┌─────────────────────┐
│ POST /api/auth/login│
│ Body: { phone, pwd }│
└─────────────────────┘
          ↓
Backend:
┌─────────────────────┐
│ 1. Validate input   │
│ 2. Hash password    │
│ 3. Query MongoDB    │
└─────────────────────┘
          ↓
MongoDB:
┌─────────────────────┐
│ Find user by phone  │
│ Compare hash        │
│ Return user data    │
└─────────────────────┘
          ↓
Backend:
┌─────────────────────┐
│ 1. Create JWT       │
│ 2. Return response  │
└─────────────────────┘
          ↓
Frontend:
┌─────────────────────┐
│ 1. Store token      │
│ 2. Store user       │
│ 3. Redirect         │
└─────────────────────┘
          ↓
Browser:
┌─────────────────────┐
│ Show dashboard      │
│ ✅ Success!         │
└─────────────────────┘
```

---

## ✅ **HEALTH CHECKS**

### **Check each service:**

```bash
# 1. Check MongoDB
mongosh
# Success: Shows MongoDB version
# Fail:    Connection refused

# 2. Check Backend
curl http://localhost:5000/api/health
# Success: {"status":"OK",...}
# Fail:    Connection refused

# 3. Check Frontend
open http://localhost:5173
# Success: Page loads
# Fail:    Connection refused

# 4. Check All Ports
lsof -i :27017 # MongoDB
lsof -i :5000  # Backend
lsof -i :5173  # Frontend
# Success: Shows process
# Fail:    No output (not running)
```

---

## 🎊 **SUCCESS INDICATORS**

### **All green = Everything working!**

```
✅ MongoDB:  Port 27017 active
✅ Backend:  Port 5000 active, health check returns OK
✅ Frontend: Port 5173 active, page loads
✅ Browser:  No console errors, can login
```

---

**Date:** February 23, 2026

**Status:** ✅ System documented

**Use this:** For visual understanding of how everything connects

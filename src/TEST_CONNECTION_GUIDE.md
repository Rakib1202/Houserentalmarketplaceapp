# 🧪 API Connection Test Tool - Usage Guide

## 📖 **About This Tool**

The `test-connection.html` file is a standalone HTML diagnostic tool that helps you test and verify your HouseRentBD backend API connection without needing to start the full React frontend.

---

## 🚀 **How to Use**

### **Method 1: Open Directly in Browser**

Simply double-click the file or open it in your browser:
```bash
open test-connection.html
# OR
# Right-click → Open With → Browser
```

### **Method 2: Use with a Local Server**

```bash
# Python 3
python3 -m http.server 8080

# Then open: http://localhost:8080/test-connection.html
```

---

## 🎯 **What It Tests**

### **1. System Status Check**
- ✅ Displays current URL configuration
- ✅ Shows expected backend/frontend ports
- ✅ Verifies environment setup

### **2. Environment Check**
- ✅ Shows current frontend URL
- ✅ Displays API URL configuration
- ✅ Lists expected port configuration
- ✅ Verifies protocol and hostname

### **3. Backend Health Check**
- ✅ Tests connection to `/api/health` endpoint
- ✅ Verifies backend is running on port 5000
- ✅ Checks MongoDB connection status
- ✅ Shows response data and timestamp

### **4. Admin Login Test**
- ✅ Tests `/api/auth/admin-login` endpoint
- ✅ Verifies authentication system
- ✅ Checks JWT token generation
- ✅ Validates admin credentials

### **5. CORS Configuration Test**
- ✅ Tests cross-origin requests
- ✅ Verifies CORS headers
- ✅ Checks Allow-Origin settings
- ✅ Validates credentials support

---

## 📋 **Test Sequence**

### **Recommended Order:**

1. **Start MongoDB**
   ```bash
   brew services start mongodb-community@7.0
   ```

2. **Start Backend**
   ```bash
   cd server
   npm run dev
   ```
   Wait for: `✅ MongoDB Connected Successfully`

3. **Open Test Tool**
   - Open `test-connection.html` in browser
   - Click "Check System Status"
   - Verify all settings

4. **Run Tests**
   - Click "Test Backend Connection"
   - Should see: ✅ SUCCESS! Backend is running
   - Click "Test Admin Login"
   - Should see: ✅ SUCCESS! Admin login works
   - Click "Test CORS Configuration"
   - Should see: ✅ CORS is working!

---

## ✅ **Expected Results**

### **System Status:**
```
Frontend URL: file:/// (or http://localhost:8080)
API URL: http://localhost:5000/api
Protocol: file: (or http:)
Hostname: (empty) (or localhost)

Expected Configuration:
• Backend should be at: http://localhost:5000
• Frontend should be at: http://localhost:5173
• MongoDB should be at: localhost:27017
```

### **Backend Health Check:**
```
✅ SUCCESS! Backend is running

Status: OK
Message: HouseRentBD API is running
Timestamp: 2026-02-23T...
✅ Backend API is operational!
```

### **Admin Login Test:**
```
✅ SUCCESS! Admin login works

Token received: Yes ✅
User data: Yes ✅
Admin name: Super Admin
Admin role: admin
🎉 Authentication is working!
```

### **CORS Test:**
```
✅ CORS is working!

CORS Headers:
Allow-Origin: http://localhost:5173
Allow-Credentials: true
Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE

Cross-origin requests should work correctly.
```

---

## ❌ **Troubleshooting Failed Tests**

### **Problem: "FAILED TO CONNECT!" Error**

**Cause:** Backend is not running

**Solution:**
```bash
cd server
npm run dev
```

Wait for the success message, then retry the test.

---

### **Problem: "LOGIN FAILED!" Error**

**Cause:** Admin user doesn't exist in database

**Solution:**
```bash
cd server
npm run create-admin
```

This creates the default admin user with credentials:
- Phone: `01700000000`
- Password: `admin123`

---

### **Problem: MongoDB Connection Error**

**Cause:** MongoDB is not running

**Solution:**
```bash
# macOS
brew services start mongodb-community@7.0

# Linux
sudo systemctl start mongod

# Verify
mongosh
# Type: exit
```

---

### **Problem: CORS Error**

**Cause:** Backend CORS not configured for your origin

**Check:** `/server/.env` should have:
```env
CLIENT_URL=http://localhost:5173
```

**Restart backend** after changing:
```bash
cd server
# Ctrl+C to stop
npm run dev
```

---

## 🔍 **Understanding the Results**

### **Green Success Box:**
```
Background: Light green
Text: Dark green
Icon: Green dot ●
```
✅ Test passed successfully!

### **Red Error Box:**
```
Background: Light red
Text: Dark red
Icon: Red dot ●
```
❌ Test failed - check error details

### **Blue Info Box:**
```
Background: Light blue
Text: Dark blue
Icon: Yellow dot ●
```
ℹ️ Information or test in progress

---

## 🎯 **Use Cases**

### **1. Quick Backend Verification**
Before starting the full frontend, use this tool to verify the backend is working correctly.

### **2. Debugging API Issues**
When you encounter "Failed to fetch" errors in the main app, use this tool to isolate the problem.

### **3. CORS Configuration Testing**
Verify CORS headers are set correctly for cross-origin requests.

### **4. Authentication Testing**
Test admin login without going through the full React app.

### **5. CI/CD Pipeline Testing**
Can be automated with headless browsers for continuous testing.

---

## 📊 **Status Indicators**

| Indicator | Color | Meaning |
|-----------|-------|---------|
| ● | Green | System running |
| ● | Red | System stopped |
| ● | Yellow | Status unknown |

---

## 🛠️ **Customization**

### **Change API URL:**

Edit line 150 in `test-connection.html`:
```javascript
const API_URL = 'http://localhost:5000/api';
```

Change to your backend URL if different.

### **Change Admin Credentials:**

Edit lines 235-236 in `test-connection.html`:
```javascript
phone: '01700000000',
password: 'admin123'
```

Update if you use different admin credentials.

---

## 📁 **File Location**

```
/
├── test-connection.html     ✅ This tool
├── TEST_CONNECTION_GUIDE.md ✅ This guide
└── server/
    ├── server.js            Backend API
    └── .env                 Backend config
```

---

## 🎨 **Features**

✅ **Standalone** - Works without React or Node.js
✅ **No Dependencies** - Pure HTML/CSS/JavaScript
✅ **Responsive Design** - Works on all screen sizes
✅ **Clear Error Messages** - Detailed troubleshooting info
✅ **One-Click Testing** - Test all endpoints easily
✅ **Visual Feedback** - Color-coded results
✅ **Auto-Run** - Environment check runs on load

---

## 💡 **Tips**

1. **Keep it open** while developing - quickly test API changes
2. **Use browser DevTools** (F12) - see network requests
3. **Check Console tab** - view detailed error logs
4. **Test before frontend** - catch backend issues early
5. **Bookmark it** - quick access during development

---

## 🔗 **Related Documentation**

- `/QUICK_START.md` - How to start the system
- `/STARTUP_GUIDE.md` - Detailed startup instructions
- `/FIX_FAILED_TO_FETCH.md` - Troubleshooting fetch errors
- `/ERROR_FIX_SUMMARY.md` - All error fixes

---

## 🆘 **Quick Help**

### **Nothing Works?**

1. Check MongoDB is running:
   ```bash
   mongosh
   ```

2. Start backend:
   ```bash
   cd server && npm run dev
   ```

3. Create admin user:
   ```bash
   cd server && npm run create-admin
   ```

4. Refresh test page and try again

---

## ✅ **Success Checklist**

- [ ] MongoDB is running
- [ ] Backend is running on port 5000
- [ ] Admin user exists in database
- [ ] Health check passes
- [ ] Login test passes
- [ ] CORS test passes

---

## 🎉 **All Tests Pass?**

**Congratulations!** Your backend is working perfectly!

Now you can:
1. Start the React frontend: `npm run dev`
2. Access the app: http://localhost:5173
3. Login with admin credentials
4. Start developing features

---

**Status:** ✅ Tool is ready to use

**Created:** February 23, 2026

**Happy Testing! 🚀**

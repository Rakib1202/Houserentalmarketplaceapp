# 🚀 QUICK START GUIDE - HouseRentBD MongoDB System

## ⚡ **5-MINUTE SETUP**

### **Prerequisites**
- Node.js 18+ installed
- MongoDB installed (local) OR MongoDB Atlas account (cloud)
- Terminal/Command Prompt

---

## 📝 **STEP-BY-STEP GUIDE**

### **Step 1: Install MongoDB (Choose One)**

**Option A: Local MongoDB (Recommended for Development)**

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

**Ubuntu/Debian:**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Windows:**
1. Download from: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Server
3. MongoDB will start automatically as a service

**Option B: MongoDB Atlas (Cloud - Free Tier)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster (choose free tier)
4. Get connection string (copy it for Step 3)

---

### **Step 2: Clone and Install Dependencies**

```bash
# Navigate to your project directory
cd houserentbd

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

---

### **Step 3: Configure Environment Variables**

**Backend Configuration:**

```bash
# Create backend .env file
cd server
cp .env.example .env

# Edit .env file (use your preferred editor)
nano .env  # or vim, code, etc.
```

**For Local MongoDB:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/houserentbd
JWT_SECRET=your-super-secret-key-change-this
CLIENT_URL=http://localhost:5173
```

**For MongoDB Atlas:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/houserentbd?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-change-this
CLIENT_URL=http://localhost:5173
```

**Frontend Configuration:**

```bash
# Go back to root directory
cd ..

# Create frontend .env file
cp .env.example .env

# Edit .env file
nano .env  # or your preferred editor
```

```env
VITE_API_URL=http://localhost:5000/api
```

---

### **Step 4: Create Admin User (MongoDB Shell)**

```bash
# Open MongoDB shell
mongosh

# Switch to database
use houserentbd

# Create admin user
db.users.insertOne({
  fullName: "Admin User",
  email: "admin@houserentbd.com",
  phone: "01700000000",
  password: "$2a$10$YourHashedPasswordHere",  // Will hash password in next step
  role: "admin",
  verified: true,
  status: "active",
  createdAt: new Date(),
  updatedAt: new Date()
})

# Exit MongoDB shell
exit
```

**Or use this helper script:**

```bash
# Create a file: server/scripts/createAdmin.js
cd server
node scripts/createAdmin.js
```

---

### **Step 5: Start the Servers**

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

Expected output:
```
🚀 Server running on port 5000
📍 Environment: development
🌐 Client URL: http://localhost:5173
✅ MongoDB Connected Successfully
```

**Terminal 2 - Frontend:**
```bash
# Open new terminal
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

---

## ✅ **VERIFICATION STEPS**

### **1. Test Backend Health**

Open browser or use curl:
```bash
curl http://localhost:5000/api/health
```

Expected Response:
```json
{
  "status": "OK",
  "message": "HouseRentBD API is running",
  "timestamp": "2024-02-22T12:00:00.000Z"
}
```

### **2. Test Frontend**

1. Open: http://localhost:5173
2. You should see the HouseRentBD homepage

### **3. Test Admin Login**

1. Go to: http://localhost:5173/admin-login
2. Enter:
   - Phone: `01700000000`
   - Password: `admin123` (or whatever you set)
3. Click "Login"
4. Should redirect to admin dashboard

### **4. Create Support Employee**

1. After admin login, go to: http://localhost:5173/admin/livechat/employees
2. Click "Create Employee"
3. Fill form:
   ```
   Name: Test Support
   Email: test@houserentbd.com
   Employee ID: SUPPORT001
   Password: support123
   Phone: 01712345678
   Department: General Support
   Max Chats: 5
   ```
4. Click "Create Employee"
5. Should see success message

### **5. Test Support Employee Login**

1. Go to: http://localhost:5173/login
2. Click "Support Login"
3. Enter:
   - Employee ID: `SUPPORT001`
   - Password: `support123`
4. Click "Login"
5. Should redirect to support dashboard

---

## 🎯 **WHAT IF SOMETHING FAILS?**

### **Problem: MongoDB Connection Error**

**Solution:**
```bash
# Check if MongoDB is running
# macOS
brew services list | grep mongodb

# Ubuntu/Linux
sudo systemctl status mongod

# If not running, start it
# macOS
brew services start mongodb-community@7.0

# Ubuntu/Linux
sudo systemctl start mongod
```

### **Problem: Port 5000 Already in Use**

**Solution:**
```bash
# Find and kill process on port 5000
# macOS/Linux
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Or change port in server/.env
PORT=5001
```

### **Problem: Frontend Can't Connect to Backend**

**Solution:**
```bash
# Check VITE_API_URL in .env
echo $VITE_API_URL  # Should be http://localhost:5000/api

# Check CORS in server/server.js
# Should have CLIENT_URL=http://localhost:5173

# Restart both servers
```

### **Problem: "Failed to fetch employees"**

**Solution:**
```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Check MongoDB connection
# Look for "✅ MongoDB Connected Successfully" in backend console

# Check if admin token is valid
# Login to admin panel again to get fresh token
```

---

## 🔑 **DEFAULT CREDENTIALS**

### **Admin Account:**
```
Phone: 01700000000
Password: admin123
Role: admin
```

### **Support Employee (After Creation):**
```
Employee ID: SUPPORT001
Password: support123
Department: General Support
```

---

## 🧪 **TEST SCENARIOS**

### **Scenario 1: Complete Admin Flow**
1. ✅ Login as admin
2. ✅ View admin dashboard
3. ✅ Navigate to Live Chat Employees
4. ✅ Create new support employee
5. ✅ View employee in list
6. ✅ Update employee status
7. ✅ Delete employee

### **Scenario 2: Complete Support Flow**
1. ✅ Login as support employee
2. ✅ View support dashboard
3. ✅ See assigned tickets
4. ✅ Click on a ticket
5. ✅ Send message
6. ✅ Resolve ticket

### **Scenario 3: API Testing**
```bash
# Test admin login
curl -X POST http://localhost:5000/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"phone":"01700000000","password":"admin123"}'

# Copy the accessToken from response

# Test get employees
curl http://localhost:5000/api/support-employees \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📊 **MONITORING**

### **Backend Logs:**
Watch backend terminal for:
- ✅ `MongoDB Connected Successfully`
- ✅ `Server running on port 5000`
- ✅ API request logs (with Morgan)

### **Frontend Logs:**
Open browser DevTools (F12) → Console
- ✅ No CORS errors
- ✅ Successful API responses
- ✅ No 404 or 500 errors

### **MongoDB Logs:**
```bash
# View MongoDB logs
# macOS
tail -f /usr/local/var/log/mongodb/mongo.log

# Linux
tail -f /var/log/mongodb/mongod.log
```

---

## 📚 **USEFUL COMMANDS**

### **Development:**
```bash
# Start backend (dev mode with auto-reload)
cd server && npm run dev

# Start frontend (dev mode with HMR)
npm run dev

# View MongoDB data
mongosh
use houserentbd
db.users.find().pretty()
db.supportemployees.find().pretty()
```

### **Production:**
```bash
# Build frontend
npm run build

# Start backend (production)
cd server && npm start

# Preview production build
npm run preview
```

### **Database:**
```bash
# Backup database
mongodump --db houserentbd --out ./backup

# Restore database
mongorestore --db houserentbd ./backup/houserentbd

# Drop database (CAREFUL!)
mongosh
use houserentbd
db.dropDatabase()
```

---

## 🎊 **YOU'RE ALL SET!**

Your HouseRentBD MongoDB system is now running!

**Access Points:**
- 🏠 Homepage: http://localhost:5173
- 🔐 Admin Login: http://localhost:5173/admin-login
- 💬 Support Login: http://localhost:5173/login (click "Support Login")
- 👤 User Login: http://localhost:5173/login
- 📊 API Health: http://localhost:5000/api/health

**Next Steps:**
1. Explore the admin dashboard
2. Create support employees
3. Test support employee login
4. Implement remaining features (Properties, Subscriptions, etc.)
5. Prepare for production deployment

**Need Help?**
- Check `/MONGODB_INTEGRATION_COMPLETE.md` for detailed documentation
- Check `/SUPPORT_LOGIN_FIX_FINAL.md` for support login specifics
- Review API endpoints in `/utils/api.ts`

**Happy Building! 🚀**

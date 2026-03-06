# 🚀 HouseRentBD Backend Server

MongoDB + Express.js REST API for HouseRentBD rental marketplace application.

---

## 📁 **Directory Structure**

```
server/
├── models/              # Mongoose models (database schemas)
│   ├── User.js
│   ├── SupportEmployee.js
│   ├── SupportTicket.js
│   ├── Job.js
│   ├── Property.js
│   ├── Subscription.js
│   ├── PhotoUpload.js
│   └── EmployeeEarning.js
│
├── routes/              # API route handlers
│   ├── auth.js
│   ├── supportEmployees.js
│   ├── supportTickets.js
│   ├── jobs.js
│   ├── users.js
│   ├── properties.js
│   ├── subscriptions.js
│   ├── photoUploads.js
│   └── employeeEarnings.js
│
├── middleware/          # Custom middleware
│   └── auth.js         # Authentication & authorization
│
├── scripts/             # Utility scripts
│   └── createAdmin.js  # Create admin user
│
├── server.js            # Main server entry point
├── package.json
├── .env.example
└── .env
```

---

## 🔧 **Setup**

### **1. Install Dependencies**

```bash
npm install
```

### **2. Configure Environment**

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### **3. Start MongoDB**

**Local:**
```bash
# macOS
brew services start mongodb-community@7.0

# Ubuntu/Linux
sudo systemctl start mongod
```

**Cloud (MongoDB Atlas):**
- Get connection string from Atlas dashboard
- Update `MONGODB_URI` in `.env`

### **4. Create Admin User**

```bash
npm run create-admin
```

### **5. Start Server**

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

---

## 📡 **API Endpoints**

### **Base URL:** `http://localhost:5000/api`

### **Authentication**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/signup` | User registration | No |
| POST | `/auth/login` | User login | No |
| POST | `/auth/admin-login` | Admin login | No |
| GET | `/auth/me` | Get current user | Yes |

### **Support Employees**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/support-employees` | Get all employees | Admin |
| GET | `/support-employees/next-id` | Get next employee ID | Admin |
| POST | `/support-employees` | Create employee | Admin |
| POST | `/support-employees/login` | Employee login | No |
| PATCH | `/support-employees/:id/status` | Update status | Admin |
| PATCH | `/support-employees/:id/online-status` | Update online status | Auth |
| DELETE | `/support-employees/:id` | Delete employee | Admin |

### **Support Tickets**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/support-tickets` | Get all tickets | Auth |
| GET | `/support-tickets/:id` | Get ticket by ID | Auth |
| POST | `/support-tickets` | Create ticket | No |
| POST | `/support-tickets/:id/assign` | Assign ticket | Auth |
| POST | `/support-tickets/:id/messages` | Add message | Auth |
| PATCH | `/support-tickets/:id/status` | Update status | Auth |
| DELETE | `/support-tickets/:id` | Delete ticket | Admin |

### **Jobs**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/jobs` | Get all jobs | No |
| GET | `/jobs/:id` | Get job by ID | No |
| POST | `/jobs` | Create job | Admin |
| PUT | `/jobs/:id` | Update job | Admin |
| PATCH | `/jobs/:id/status` | Update status | Admin |
| DELETE | `/jobs/:id` | Delete job | Admin |

### **Users**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users` | Get all users | Admin |
| GET | `/users/:id` | Get user by ID | Auth |
| PUT | `/users/:id` | Update user | Auth |
| PATCH | `/users/:id/status` | Update status | Admin |
| DELETE | `/users/:id` | Delete user | Admin |
| GET | `/users/stats` | Get statistics | Admin |

---

## 🔐 **Authentication**

The API uses JWT (JSON Web Tokens) for authentication.

### **How to Authenticate:**

1. **Login** to get access token:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"01700000000","password":"admin123"}'
```

2. **Use token** in subsequent requests:
```bash
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### **Token Structure:**
```javascript
{
  userId: "user_id_here",      // or id for support employees
  role: "admin",               // or type: "support"
  iat: 1708012345,             // Issued at
  exp: 1708098745              // Expires at (24 hours)
}
```

---

## 🗄️ **Database Models**

### **User**
```javascript
{
  fullName: String (required),
  email: String (unique),
  phone: String (unique, required),
  password: String (hashed, required),
  role: Enum ['tenant', 'owner', 'agent', 'employee', 'admin'],
  verified: Boolean,
  status: Enum ['active', 'suspended', 'inactive'],
  profileImage: String,
  address: String,
  nidNumber: String,
  nidVerified: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### **SupportEmployee**
```javascript
{
  name: String (required),
  email: String (unique, required),
  employeeId: String (unique, required),
  password: String (hashed, required),
  phone: String (required),
  department: String (required),
  status: Enum ['active', 'inactive', 'suspended'],
  onlineStatus: Enum ['online', 'busy', 'offline'],
  totalChats: Number,
  maxConcurrentChats: Number,
  lastActive: Date,
  createdAt: Date
}
```

### **SupportTicket**
```javascript
{
  ticketNumber: String (unique),
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  subject: String,
  category: Enum ['General', 'Technical', 'Payment', 'Property', 'Account'],
  priority: Enum ['low', 'medium', 'high', 'urgent'],
  status: Enum ['open', 'in-progress', 'resolved', 'closed'],
  assignedTo: String (employeeId),
  messages: Array [{
    sender: Enum ['customer', 'support'],
    senderName: String,
    message: String,
    timestamp: Date
  }],
  createdAt: Date,
  resolvedAt: Date
}
```

---

## 🛡️ **Security Features**

- ✅ **Helmet.js** - Secure HTTP headers
- ✅ **CORS** - Cross-Origin Resource Sharing
- ✅ **Rate Limiting** - Prevent brute force attacks
- ✅ **bcrypt** - Password hashing (10 rounds)
- ✅ **JWT** - Secure token-based authentication
- ✅ **express-validator** - Input validation
- ✅ **Morgan** - HTTP request logging

---

## 🧪 **Testing**

### **Health Check**
```bash
curl http://localhost:5000/api/health
```

### **Create Support Employee**
```bash
# Login as admin first
curl -X POST http://localhost:5000/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"phone":"01700000000","password":"admin123"}'

# Use token to create employee
curl -X POST http://localhost:5000/api/support-employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Test Employee",
    "email": "test@example.com",
    "employeeId": "SUPPORT001",
    "password": "test123",
    "phone": "01712345678",
    "department": "General Support",
    "maxConcurrentChats": 5
  }'
```

### **Support Employee Login**
```bash
curl -X POST http://localhost:5000/api/support-employees/login \
  -H "Content-Type: application/json" \
  -d '{"employeeId":"SUPPORT001","password":"test123"}'
```

---

## 📊 **Scripts**

```bash
# Start development server (with nodemon)
npm run dev

# Start production server
npm start

# Create admin user
npm run create-admin
```

---

## 🐛 **Common Issues**

### **MongoDB Connection Error**

**Problem:**
```
❌ MongoDB Connection Error: MongoServerError: connect ECONNREFUSED
```

**Solution:**
```bash
# Check if MongoDB is running
# macOS
brew services list | grep mongodb

# Linux
sudo systemctl status mongod

# Start MongoDB
# macOS
brew services start mongodb-community@7.0

# Linux
sudo systemctl start mongod
```

### **Port Already in Use**

**Problem:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Find process using port 5000
lsof -ti:5000

# Kill the process
lsof -ti:5000 | xargs kill -9

# Or change port in .env
PORT=5001
```

### **JWT Secret Not Found**

**Problem:**
```
Error: JWT_SECRET must be defined
```

**Solution:**
```bash
# Add JWT_SECRET to .env
echo "JWT_SECRET=your-secret-key-here" >> .env
```

---

## 📝 **Environment Variables**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/houserentbd

# JWT Secret (CHANGE THIS!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

---

## 📚 **Dependencies**

### **Core:**
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `dotenv` - Environment variables

### **Security:**
- `helmet` - Security headers
- `cors` - CORS middleware
- `express-rate-limit` - Rate limiting

### **Utilities:**
- `express-validator` - Input validation
- `multer` - File uploads
- `sharp` - Image processing
- `morgan` - HTTP logging
- `compression` - Response compression

### **Development:**
- `nodemon` - Auto-reload

---

## 🚀 **Deployment**

### **Production Checklist:**

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB Atlas for database
- [ ] Enable MongoDB authentication
- [ ] Set up SSL/TLS
- [ ] Configure firewall rules
- [ ] Set up monitoring and logging
- [ ] Configure backup and recovery
- [ ] Set up CI/CD pipeline

### **Deployment Platforms:**

- **Heroku:** `git push heroku main`
- **DigitalOcean:** Use App Platform or Droplet
- **AWS:** EC2 or Elastic Beanstalk
- **Railway:** Connect GitHub repository
- **Render:** Connect GitHub repository

---

## 📖 **API Documentation**

For full API documentation, see:
- `/MONGODB_INTEGRATION_COMPLETE.md`
- `/QUICK_START_GUIDE.md`

---

## 🤝 **Contributing**

1. Create a new feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## 📄 **License**

Copyright © 2024 HouseRentBD. All rights reserved.

---

## 💬 **Support**

For issues and questions:
- Check documentation in root directory
- Review error logs in terminal
- Check MongoDB connection
- Verify environment variables

**Happy Coding! 🚀**

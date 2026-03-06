# 🏠 HouseRentBD - Comprehensive Rental Marketplace

A full-stack rental marketplace application for Dhaka city with MongoDB backend, Express.js API, React frontend, and TypeScript. Features complete authentication, property management, live chat support system, and admin dashboard.

---

## 🌟 **Features**

### **User Roles:**
- 👤 **Tenants** - Search and rent properties
- 🏘️ **Property Owners** - List and manage properties
- 🤝 **Agents** - Facilitate transactions
- 👔 **Employees** - Handle property photos and verification
- 👨‍💼 **Admin** - Complete system management
- 💬 **Support Employees** - Live chat customer support

### **Core Features:**
- ✅ User authentication (JWT + bcrypt)
- ✅ Role-based access control
- ✅ Live chat support system
- ✅ Support employee management
- ✅ Support ticket system
- ✅ Job management system
- ✅ Admin dashboard
- ⏳ Property listing and search
- ⏳ Photo upload with compression
- ⏳ Subscription management
- ⏳ Employee earnings tracker

---

## 🏗️ **Tech Stack**

### **Frontend:**
- React 18 with TypeScript
- React Router v7 for navigation
- Tailwind CSS v4 for styling
- Shadcn/ui components
- Vite for building

### **Backend:**
- Node.js + Express.js
- MongoDB with Mongoose ODM
- JWT authentication
- bcrypt password hashing
- Express Validator for input validation

### **Security:**
- Helmet.js for HTTP headers
- CORS configuration
- Rate limiting
- Password hashing (bcrypt)
- JWT token authentication

---

## 📁 **Project Structure**

```
houserentbd/
├── server/                      # Backend
│   ├── models/                  # Mongoose schemas
│   ├── routes/                  # API routes
│   ├── middleware/              # Auth middleware
│   ├── scripts/                 # Utility scripts
│   └── server.js                # Entry point
│
├── components/                  # React components
│   ├── admin/                   # Admin components
│   ├── support/                 # Support components
│   ├── auth/                    # Authentication
│   └── ui/                      # UI components
│
├── utils/
│   ├── api.ts                   # API client
│   └── supabase/                # (Legacy)
│
├── .env                         # Frontend env
├── server/.env                  # Backend env
└── README.md                    # This file
```

---

## 🚀 **Quick Start**

### **Prerequisites:**
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### **Installation:**

```bash
# 1. Install frontend dependencies
npm install

# 2. Install backend dependencies
cd server
npm install
cd ..

# 3. Start MongoDB
# macOS: brew services start mongodb-community@7.0
# Linux: sudo systemctl start mongod

# 4. Create admin user
cd server
npm run create-admin
cd ..

# 5. Start backend (Terminal 1)
cd server
npm run dev

# 6. Start frontend (Terminal 2)
npm run dev
```

### **Access:**
- 🌐 Frontend: http://localhost:5173
- 🔧 Backend API: http://localhost:5000/api
- 🔐 Admin Login: http://localhost:5173/admin-login
- 💬 Support Login: http://localhost:5173/login (Support Login tab)

---

## 🔑 **Default Credentials**

### **Admin (created via script):**
```
Phone: 01700000000
Password: admin123
```

### **Support Employee (create via admin panel):**
```
Employee ID: SUPPORT001
Password: (set during creation)
```

---

## 📖 **Documentation**

Comprehensive documentation available in:

1. **[QUICK_START_GUIDE.md](./QUICK_START_GUIDE.md)**
   - 5-minute setup guide
   - Step-by-step instructions
   - Troubleshooting

2. **[MONGODB_INTEGRATION_COMPLETE.md](./MONGODB_INTEGRATION_COMPLETE.md)**
   - Complete technical docs
   - API reference
   - Database models
   - Security features

3. **[SYSTEM_FIXED_SUMMARY.md](./SYSTEM_FIXED_SUMMARY.md)**
   - System overview
   - What works
   - Testing guide

4. **[server/README.md](./server/README.md)**
   - Backend-specific documentation
   - API endpoints
   - Testing

---

## 🔌 **API Endpoints**

### **Base URL:** `http://localhost:5000/api`

#### **Authentication:**
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/admin-login` - Admin login
- `GET /auth/me` - Get current user

#### **Support Employees:**
- `GET /support-employees` - List all (Admin)
- `POST /support-employees` - Create (Admin)
- `POST /support-employees/login` - Employee login
- `PATCH /support-employees/:id/status` - Update status
- `DELETE /support-employees/:id` - Delete (Admin)

#### **Support Tickets:**
- `GET /support-tickets` - List all tickets
- `POST /support-tickets` - Create ticket
- `POST /support-tickets/:id/assign` - Assign ticket
- `POST /support-tickets/:id/messages` - Add message
- `PATCH /support-tickets/:id/status` - Update status

#### **Jobs:**
- `GET /jobs` - List jobs
- `POST /jobs` - Create job (Admin)
- `PUT /jobs/:id` - Update job (Admin)
- `DELETE /jobs/:id` - Delete job (Admin)

Full API documentation: [MONGODB_INTEGRATION_COMPLETE.md](./MONGODB_INTEGRATION_COMPLETE.md)

---

## 🗄️ **Database Models**

### **Implemented:**
1. **User** - User accounts (all roles)
2. **SupportEmployee** - Live chat support staff
3. **SupportTicket** - Customer support tickets
4. **Job** - Job postings

### **To Implement:**
5. **Property** - Property listings
6. **Subscription** - User subscriptions
7. **PhotoUpload** - Property photos
8. **EmployeeEarning** - Employee earnings

---

## 🧪 **Testing**

### **Backend Health Check:**
```bash
curl http://localhost:5000/api/health
```

### **Create Support Employee:**
```bash
# 1. Login as admin
curl -X POST http://localhost:5000/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"phone":"01700000000","password":"admin123"}'

# 2. Use token to create employee
curl -X POST http://localhost:5000/api/support-employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Test Support",
    "email": "test@example.com",
    "employeeId": "SUPPORT001",
    "password": "test123",
    "phone": "01712345678",
    "department": "General Support",
    "maxConcurrentChats": 5
  }'
```

### **Frontend Testing:**
1. Open http://localhost:5173/admin-login
2. Login with admin credentials
3. Navigate to "Live Chat Employees"
4. Create a new support employee
5. Logout and try support employee login
6. Access support dashboard

---

## 🔒 **Security**

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens (24-hour expiry)
- ✅ Role-based authorization
- ✅ Input validation on all endpoints
- ✅ CORS protection
- ✅ Rate limiting (100 req/15 min)
- ✅ Helmet.js security headers
- ✅ Mongoose injection prevention

---

## 📊 **Environment Variables**

### **Frontend (`.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

### **Backend (`server/.env`):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/houserentbd
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:5173
```

---

## 🐛 **Troubleshooting**

### **MongoDB Connection Error:**
```bash
# Check if MongoDB is running
brew services list | grep mongodb  # macOS
sudo systemctl status mongod       # Linux

# Start MongoDB
brew services start mongodb-community@7.0  # macOS
sudo systemctl start mongod                # Linux
```

### **Port Already in Use:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change PORT in server/.env
PORT=5001
```

### **Failed to Fetch Errors:**
```bash
# 1. Verify backend is running
curl http://localhost:5000/api/health

# 2. Check VITE_API_URL in .env
# 3. Check CLIENT_URL in server/.env
# 4. Restart both servers
```

---

## 🚢 **Deployment**

### **MongoDB Atlas (Database):**
1. Create account at mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `MONGODB_URI` in server/.env

### **Backend (Heroku/Railway/Render):**
```bash
# Set environment variables
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=strong-random-string
CLIENT_URL=https://your-frontend-url.com
```

### **Frontend (Vercel/Netlify):**
```bash
# Set environment variable
VITE_API_URL=https://your-backend-url.com/api
```

---

## 📝 **Development Scripts**

### **Frontend:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### **Backend:**
```bash
cd server
npm run dev          # Start with nodemon
npm start            # Start production server
npm run create-admin # Create admin user
```

---

## 🎯 **Roadmap**

### **Phase 1: Core Features** ✅
- [x] MongoDB backend setup
- [x] User authentication
- [x] Support employee system
- [x] Support ticket system
- [x] Job management
- [x] Admin dashboard

### **Phase 2: Property Management** ⏳
- [ ] Property listing
- [ ] Property search
- [ ] Photo upload system
- [ ] Property verification

### **Phase 3: Subscriptions** ⏳
- [ ] Subscription plans
- [ ] Payment integration
- [ ] Invoice generation

### **Phase 4: Advanced Features** ⏳
- [ ] Real-time chat with WebSocket
- [ ] Email notifications
- [ ] SMS OTP verification
- [ ] Analytics dashboard

---

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 **License**

Copyright © 2024 HouseRentBD. All rights reserved.

---

## 💬 **Support**

For issues and questions:
- Check documentation files
- Review error logs
- Verify MongoDB connection
- Check environment variables

---

## 🎉 **Acknowledgments**

Built with:
- React + TypeScript
- Express.js + MongoDB
- Tailwind CSS
- Shadcn/ui
- And many other amazing open-source libraries

---

**Built with ❤️ for the people of Dhaka**

**Happy Renting! 🏠**

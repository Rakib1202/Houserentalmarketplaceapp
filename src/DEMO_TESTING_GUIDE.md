# 🧪 Quick Demo Testing Guide

## Quick Test Scenarios

### 🏠 Scenario 1: Tenant Looking for Property

1. **Homepage** (`/`)
   - View hero section with search
   - Click "Search" button or "View All Properties"

2. **Search Page** (`/search`)
   - Apply filters:
     - Area: Dhanmondi
     - Rent: ৳20,000 - ৳30,000
     - Bedrooms: 3
   - Click "Search Properties"
   - View results

3. **Property Details** (`/property/:id`)
   - Click on any property card
   - View full details, photos, amenities
   - Note: Premium features locked (shows upgrade message)

4. **Sign Up as Tenant** (`/signup`)
   - Name: "John Tenant"
   - Phone: "01812345678"
   - Role: "Tenant"
   - Click "Send OTP"
   - Enter OTP: `123456`
   - Set Password: "test1234"
   - Complete signup

5. **Login** (`/login`)
   - Phone: "01812345678"
   - Password: "test1234"
   - Click "Login"
   - Redirected to `/tenant` dashboard

6. **Tenant Dashboard** (`/tenant`)
   - View stats (favorites, inquiries)
   - Click "Search Properties"
   - Save a property (❤️ heart icon)
   - Send inquiry to owner
   - View saved favorites
   - Track inquiries

### 📝 Scenario 2: Owner Posting Property

1. **Sign Up as Owner** (`/signup`)
   - Name: "Sarah Owner"
   - Phone: "01912345678"
   - Role: "Property Owner"
   - Complete OTP & password setup

2. **Owner Dashboard** (`/owner`)
   - Click "Add Property" button
   - Fill property form:
     - Title: "Beautiful 3BHK in Dhanmondi"
     - Area: "Dhanmondi"
     - Address: "Road 5, Dhanmondi"
     - Rent: ৳25,000
     - Advance: ৳75,000
     - Bedrooms: 3
     - Bathrooms: 2
     - Size: 1200 sqft
     - Tenant Type: Family
     - Amenities: Lift, Parking, Gas
     - Photos: (Use Unsplash URLs)
   - Submit property
   - Status: "Pending" (awaiting admin approval)

3. **View Property Status**
   - Check "All Properties" tab
   - See property in "Pending Approval" section

4. **Edit Property**
   - Click "Edit" button
   - Update any details
   - Save changes

5. **View Inquiries**
   - Click "Inquiries" tab
   - See tenant messages
   - Call/WhatsApp tenant directly

### 👔 Scenario 3: Agent Managing Multiple Properties

1. **Sign Up as Agent** (`/signup`)
   - Name: "Mike Agent"
   - Phone: "01712345680"
   - Role: "Real Estate Agent"
   - Complete signup

2. **Agent Dashboard** (`/agent`)
   - Same as Owner dashboard
   - Add multiple properties
   - View all managed listings
   - See verified agent badge (if subscribed)

### 📸 Scenario 4: Employee Uploading Photos

1. **Login as Employee** (`/login`)
   - Use demo credentials:
   - Phone: "01712345681"
   - Password: "employee123"

2. **Employee Dashboard** (`/employee`)
   - View earnings stats:
     - Total Earnings: ৳0 (initially)
     - Approved Photos: 0
     - Pending Review: 0

3. **Upload Photo**
   - Area: "Gulshan, Road 12"
   - Photo URL: (Use any Unsplash image URL)
   - Example: `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2`
   - Click "Upload Photo"
   - Status: "Pending" (awaiting admin approval)

4. **View Upload History**
   - Scroll down to "My Photos"
   - See all uploaded photos with status
   - Pending photos show "Pending" badge
   - Approved photos show earnings (৳5)

### 👨‍💼 Scenario 5: Admin Managing Platform

1. **Admin Login** (`/admin-login`)
   - Username: `admin`
   - Password: `admin`
   - Click "Login"
   - Redirected to `/admin` dashboard

2. **Admin Dashboard** (`/admin`)
   - View overview stats:
     - Total Users
     - Total Properties
     - Pending Approvals
     - Total Revenue
     - Active Subscriptions

3. **Approve Properties** (`/admin/properties/approvals`)
   - Click "Properties" → "Approvals"
   - View pending properties
   - Click "Approve" on property
   - Property status changes to "Approved"
   - Owner can now see it live
   - Tenants can search and find it

4. **Approve Employee Photos** (`/admin/photos`)
   - Click "Photo Approvals"
   - View all pending employee photos
   - Click "Approve" on photo
   - Employee earns ৳5
   - Photo added to private storage

5. **Manage Users** (`/admin/users`)
   - View all users by role
   - Filter: Tenants, Owners, Agents, Employees
   - Verify accounts
   - Block spam users
   - Update user roles

6. **Track Employee Earnings** (`/admin/earnings`)
   - View earnings by employee
   - See approved photos count
   - Total earnings per employee
   - Generate reports

7. **Handle Complaints** (`/admin/reports`)
   - View reported listings
   - See tenant complaints
   - Take action (remove, warn, block)
   - Mark as resolved

8. **View Analytics** (`/admin/analytics`)
   - Business metrics
   - User growth charts
   - Revenue trends
   - Geographic distribution

## 🚀 Quick Demo Credentials

### Tenant
- Phone: `01712345678`
- Password: `tenant123`

### Property Owner
- Phone: `01712345679`
- Password: `owner123`

### Agent
- Phone: `01712345680`
- Password: `agent123`

### Employee
- Phone: `01712345681`
- Password: `employee123`

### Admin
- Username: `admin`
- Password: `admin`

## 🔄 Complete User Flow Test

### End-to-End Flow (15 minutes)

1. **Start as Admin** (2 min)
   - Login to admin panel
   - View empty dashboard
   - Navigate through all admin pages

2. **Create Property Owner** (3 min)
   - Sign up as owner
   - Login
   - Add a property with details
   - See "Pending" status

3. **Admin Approves Property** (1 min)
   - Switch to admin login
   - Go to Property Approvals
   - Approve the property
   - Property goes live

4. **Create Tenant** (3 min)
   - Sign up as tenant
   - Login to tenant dashboard
   - Search for properties
   - Find the approved property
   - Save as favorite
   - Send inquiry to owner

5. **Owner Sees Inquiry** (2 min)
   - Switch to owner login
   - View "Inquiries" tab
   - See tenant message
   - Contact tenant via call/WhatsApp

6. **Employee Uploads Photo** (2 min)
   - Login as employee
   - Upload a house photo
   - See "Pending" status

7. **Admin Approves Photo** (2 min)
   - Switch to admin
   - Go to Photo Approvals
   - Approve employee photo
   - Employee earns ৳5

8. **Employee Sees Earnings** (1 min)
   - Switch to employee login
   - Check dashboard
   - See ৳5 earnings
   - View approved photo

**Total Time**: ~15 minutes

## 🧪 Feature Checklist

### Authentication ✓
- [ ] Password login works
- [ ] OTP login works (demo OTP: 123456)
- [ ] Google sign-in available
- [ ] Signup flow complete
- [ ] Role-based redirect works

### Tenant Features ✓
- [ ] Search properties with filters
- [ ] View property details
- [ ] Save favorites
- [ ] Send inquiries
- [ ] View saved properties
- [ ] Track inquiries
- [ ] Premium upgrade banner visible

### Owner Features ✓
- [ ] Add property form works
- [ ] Upload multiple photos
- [ ] Edit property
- [ ] Delete property
- [ ] View property status (Pending/Approved/Rejected)
- [ ] See tenant inquiries
- [ ] Call/WhatsApp tenant

### Agent Features ✓
- [ ] Same as owner
- [ ] Can add multiple properties
- [ ] Subscription plans visible
- [ ] Verified badge shown (if subscribed)

### Employee Features ✓
- [ ] Photo upload form
- [ ] View upload history
- [ ] Track earnings
- [ ] See approval status
- [ ] Earnings calculation (৳5 per photo)

### Admin Features ✓
- [ ] Dashboard overview
- [ ] Approve properties
- [ ] Reject properties
- [ ] Approve photos
- [ ] User management
- [ ] Track employee earnings
- [ ] View reports/complaints
- [ ] Analytics dashboard
- [ ] Subscription management
- [ ] Payment tracking

### Navigation ✓
- [ ] All routes accessible
- [ ] Protected routes work
- [ ] Role-based menus correct
- [ ] Breadcrumbs show
- [ ] Back buttons functional

### UI/UX ✓
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Responsive on desktop
- [ ] Animations smooth
- [ ] Toast notifications show
- [ ] Loading states visible
- [ ] Error handling works
- [ ] Forms validate correctly

## 🐛 Common Issues & Solutions

### Issue: OTP not working
**Solution**: Use hardcoded demo OTP: `123456`

### Issue: Login fails
**Solution**: Check you're using the correct demo credentials listed above

### Issue: Property not showing in search
**Solution**: Admin must approve the property first

### Issue: Employee not earning
**Solution**: Admin must approve the photo in Photo Approvals section

### Issue: Can't access admin panel
**Solution**: Go to `/admin-login` (not `/login`) and use admin/admin

### Issue: Page not found
**Solution**: Check the route is correct. Main routes:
- Homepage: `/`
- Search: `/search`
- Login: `/login`
- Signup: `/signup`
- Admin: `/admin-login`
- Dashboards: `/tenant`, `/owner`, `/agent`, `/employee`, `/admin`

## 📱 Mobile Testing

### Responsive Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### Test On
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] iPad (Safari)
- [ ] Desktop (Chrome, Firefox, Safari)

## ⚡ Performance Testing

### Load Times
- Homepage: < 2s
- Search Page: < 1s
- Dashboard: < 1.5s
- Property Details: < 1s

### Optimization
- Images lazy loaded
- Components code-split
- Tailwind CSS purged
- Minimal bundle size

---

## 🎯 Success Criteria

✅ All 5 user roles functional  
✅ Authentication working (Password + OTP)  
✅ Property CRUD operations complete  
✅ Admin approval workflow functional  
✅ Employee photo & earnings system working  
✅ Search & filters operational  
✅ Responsive on all devices  
✅ Professional UI/UX  
✅ No console errors  
✅ All routes accessible  

---

**Happy Testing! 🚀**

*For issues or questions, refer to the COMPREHENSIVE_FEATURES.md document.*

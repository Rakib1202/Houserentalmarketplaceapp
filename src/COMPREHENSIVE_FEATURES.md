# HouseRentBD - Comprehensive Feature Documentation

## Overview
HouseRentBD is a complete rental marketplace application for Dhaka city with five different user roles: Tenants, Property Owners, Real Estate Agents, Executive Employees, and Admin. The system includes full authentication, role-based access control, and comprehensive management features.

## 🔐 Authentication System

### Login Methods
- **Password Login**: Traditional phone + password authentication
- **OTP Login**: SMS-based one-time password verification
- **Google Sign-In**: OAuth integration with Google accounts

### Demo Credentials
For testing, use these demo accounts:

**Tenant**: Phone: `01712345678`, Password: `tenant123`
**Owner**: Phone: `01712345679`, Password: `owner123`
**Agent**: Phone: `01712345680`, Password: `agent123`
**Employee**: Phone: `01712345681`, Password: `employee123`
**Admin**: Username: `admin`, Password: `admin`

### Signup Flow
1. Enter name, phone number, and select role
2. Receive OTP verification (demo OTP: `123456`)
3. Set password (min 6 characters)
4. Account created and redirected to login

## 👥 User Roles & Features

### 1. TENANT (Rent Seeker)

**Purpose**: Looking for houses/flats to rent

**Features**:
- ✅ Register/Login with OTP
- ✅ Search properties by:
  - Area (Dhanmondi, Gulshan, Banani, Uttara, Mirpur, etc.)
  - Rent range (min/max)
  - Number of bedrooms
  - Tenant type (Family, Bachelor, Both)
- ✅ Filter by amenities (Lift, Parking, Furnished, etc.)
- ✅ View property details & photos
- ✅ Save favorite listings (❤️ Heart icon)
- ✅ Contact owner via Call / WhatsApp
- ✅ Submit inquiries to property owners
- ✅ Report fake listings
- ✅ Access premium details if subscribed (full address + owner contact)

**Premium Benefits**:
- Full property address visibility
- Direct owner contact information
- Priority support

**Restrictions**:
- ❌ Cannot post properties
- ❌ Cannot approve listings
- ❌ Cannot view private employee photos
- ❌ Cannot see other tenants' data

**Navigation**: `/tenant`

---

### 2. PROPERTY OWNER

**Purpose**: Post properties for rent

**Features**:
- ✅ Register/Login with OTP
- ✅ Post new property listings:
  - Property title & description
  - Area/location details
  - Monthly rent & advance amount
  - Bedrooms, bathrooms, size (sqft)
  - Tenant type preference
  - Amenities (Lift, Parking, Gas, Wi-Fi, etc.)
  - House rules
  - Multiple property photos
- ✅ Edit own listings
- ✅ Delete own listings
- ✅ View tenant inquiries with contact details
- ✅ Receive calls/messages from tenants
- ✅ Boost listing (featured ad - optional)
- ✅ Track property status:
  - Pending (⏳ awaiting admin approval)
  - Approved (✅ live on platform)
  - Rejected (❌ needs revision)

**Dashboard Stats**:
- Total properties count
- Pending approvals
- Approved listings
- Inquiry count

**Restrictions**:
- ❌ Cannot approve other listings
- ❌ Cannot see full analytics
- ❌ Cannot see private employee photos

**Navigation**: `/owner`

---

### 3. REAL ESTATE AGENT (Premium)

**Purpose**: Professional agent managing multiple properties

**Features**:
- ✅ All Owner features
- ✅ Post multiple properties under subscription plan
- ✅ Get verified badge (⭐)
- ✅ Featured placement for listings
- ✅ Manage listings for multiple properties
- ✅ Professional profile display

**Subscription Plans**:
- Basic: 5 properties
- Pro: 20 properties + verified badge
- Premium: Unlimited + featured placement

**Restrictions**:
- ⚠️ Must pay subscription to unlock premium features
- ❌ Cannot access employee private photos

**Navigation**: `/agent`

---

### 4. EXECUTIVE EMPLOYEE

**Purpose**: Field staff capturing house photos

**Features**:
- ✅ Login with OTP / Employee ID
- ✅ Map view of Dhaka areas
- ✅ Capture house photos on-site
- ✅ Upload photos to private storage
- ✅ View only their own uploaded photos
- ✅ Track approved photos & earnings (৳5 per approved photo)
- ✅ Earnings dashboard:
  - Total earnings (৳)
  - Approved photos count
  - Pending review count
  - Total uploads

**Photo Upload Process**:
1. Select area/location
2. Upload photo URL (or capture directly)
3. Submit for admin approval
4. Earn ৳5 when approved

**Restrictions**:
- ❌ Cannot view tenant data
- ❌ Cannot see other employees' photos
- ❌ Cannot make photos public
- ❌ Cannot approve own photos

**Navigation**: `/employee`

---

### 5. ADMIN (Superuser)

**Purpose**: Platform management and oversight

**Features**:

#### Property Management
- ✅ Approve/reject property listings
- ✅ View all pending properties
- ✅ Verify owner/agent accounts
- ✅ Manage featured ads

#### User Management
- ✅ View all users (Tenant, Owner, Agent, Employee)
- ✅ Verify accounts
- ✅ Block fake users or spam accounts
- ✅ Manage user subscriptions
- ✅ Update user roles

#### Photo Approval System
- ✅ View all employee-uploaded photos
- ✅ Approve/reject photos
- ✅ Automatic earnings calculation (৳5 per approved photo)
- ✅ Track employee performance

#### Employee Earnings Management
- ✅ View earnings by employee
- ✅ Track approved photos count
- ✅ Generate earnings reports
- ✅ Payment management

#### Complaints & Reports
- ✅ View tenant-reported listings
- ✅ Handle fake listing complaints
- ✅ Take action (warning, suspension, removal)
- ✅ Complaint resolution tracking

#### Business Analytics
- ✅ Total listings count
- ✅ Total inquiries
- ✅ Payment tracking
- ✅ Subscription revenue
- ✅ User growth metrics
- ✅ Geographic distribution

#### Subscription Management
- ✅ Create subscription plans
- ✅ Manage agent subscriptions
- ✅ Premium user management
- ✅ Payment processing

**Admin Dashboard Stats**:
- Total users
- Total properties
- Pending approvals
- Total revenue
- Active subscriptions
- Employee earnings

**Restrictions**:
- ⚠️ Admin cannot post property as Tenant/Owner role (optional restriction)

**Navigation**: `/admin` or `/admin-login`

---

## 🔍 Property Search System

### Search Filters
- **Location**: Dropdown with Dhaka areas
- **Budget**: Rent range slider or predefined ranges
- **Bedrooms**: 1, 2, 3, 4+
- **Tenant Type**: Family, Bachelor, Both
- **Amenities**: Multi-select (Lift, Parking, Furnished, Gas, Wi-Fi, etc.)

### Search Results
- Grid/list view of properties
- Property cards showing:
  - Featured badge (if applicable)
  - Property image
  - Price (৳/month)
  - Location
  - Bedrooms/Bathrooms
  - Size (sqft)
  - Quick actions (Save, View, Contact)

**Navigation**: `/search`

---

## 📱 Key Pages & Routes

### Public Pages
- `/` - Homepage with hero section and featured properties
- `/about` - About Us page
- `/contact` - Contact Us page
- `/properties` or `/listings` - Browse all properties
- `/search` - Advanced property search
- `/property/:id` - Property details page

### Authentication
- `/login` - Login page (Password/OTP/Google)
- `/signup` - Registration page
- `/admin-login` - Admin-specific login
- `/auth/callback` - OAuth callback handler

### Role Dashboards
- `/tenant` - Tenant dashboard (favorites, inquiries)
- `/owner` - Owner dashboard (properties, inquiries)
- `/agent` - Agent dashboard (same as owner with premium features)
- `/employee` - Employee dashboard (photo uploads, earnings)
- `/admin` - Admin panel (full management interface)

### Admin Panel Routes
- `/admin` - Main dashboard
- `/admin/properties` - Property management
- `/admin/properties/approvals` - Approve/reject listings
- `/admin/users` - User management
- `/admin/subscriptions` - Subscription management
- `/admin/payments` - Payment tracking
- `/admin/photos` - Photo approval system
- `/admin/earnings` - Employee earnings
- `/admin/reports` - Complaints & reports
- `/admin/analytics` - Business analytics
- `/admin/settings` - System settings

---

## 💳 Premium & Subscription System

### Tenant Premium
**Price**: ৳299/month
**Benefits**:
- Full property addresses
- Direct owner contact
- Priority search placement
- Save unlimited favorites
- Premium support

### Agent Subscription Plans

**Basic - ৳999/month**
- Post up to 5 properties
- Standard listing visibility

**Pro - ৳2,999/month**
- Post up to 20 properties
- Verified agent badge
- Priority listing placement
- Featured in search results

**Premium - ৳5,999/month**
- Unlimited properties
- Verified agent badge
- Top placement in all searches
- Featured on homepage
- Dedicated account manager

---

## 📊 Analytics & Reporting

### Admin Analytics Dashboard
- **User Metrics**:
  - Total users by role
  - New registrations (daily/weekly/monthly)
  - Active users
  - User retention rate

- **Property Metrics**:
  - Total listings
  - Approved/Pending/Rejected
  - Properties by area
  - Average rent by location
  - Featured properties performance

- **Financial Metrics**:
  - Total revenue
  - Subscription revenue
  - Employee photo earnings
  - Payment trends

- **Engagement Metrics**:
  - Total inquiries
  - Inquiry response rate
  - Favorite counts
  - Search queries

---

## 🔔 Notifications System

### Tenant Notifications
- Property approval status
- Owner response to inquiry
- New properties matching saved searches
- Premium subscription renewal

### Owner/Agent Notifications
- Property approval/rejection
- New tenant inquiry
- Subscription expiration warning
- Featured listing expiration

### Employee Notifications
- Photo approval/rejection
- Earnings milestone reached
- New area assignments

### Admin Notifications
- New property submissions
- User complaints
- System alerts
- Revenue milestones

---

## 🛡️ Security Features

- ✅ Role-based access control (RBAC)
- ✅ JWT authentication tokens
- ✅ Password hashing (bcrypt)
- ✅ OTP verification
- ✅ Google OAuth integration
- ✅ Protected routes
- ✅ Admin-only actions
- ✅ User verification system
- ✅ Spam detection
- ✅ Report & block functionality

---

## 🎨 UI/UX Features

### Modern Design
- Clean white backgrounds
- Light blue gradients
- Glassmorphism cards
- Modern startup-style layout
- Corporate and trustworthy feel
- Responsive design (mobile, tablet, desktop)

### Navigation
- Sticky header with logo
- Role-based menu items
- Quick action buttons
- Breadcrumbs
- Search bar always accessible

### Components
- Property cards with hover effects
- Image galleries with lightbox
- Interactive filters
- Real-time search
- Skeleton loaders
- Toast notifications
- Modal dialogs
- Dropdown menus

---

## 📞 Contact Methods

### Tenant → Owner Communication
- **Direct Call**: Click-to-call phone number
- **WhatsApp**: One-click WhatsApp message
- **Inquiry Form**: In-app message system
- **Email**: (if provided)

### Owner → Tenant Communication
- View tenant contact from inquiries
- Call/WhatsApp tenant directly
- Mark inquiry as contacted/closed

---

## 🚀 Future Enhancements

### Planned Features
- [ ] Map integration (Google Maps)
- [ ] Virtual property tours (360° photos)
- [ ] Video property walkthroughs
- [ ] Chat system (real-time messaging)
- [ ] Property comparison tool
- [ ] Mortgage calculator
- [ ] Rent agreement templates
- [ ] Background verification service
- [ ] Move-in checklists
- [ ] Maintenance request system
- [ ] Payment gateway integration
- [ ] Mobile app (iOS/Android)

---

## 📚 Technical Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom component library
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **State**: React Hooks + Local Storage
- **Notifications**: Sonner (Toast)

### Backend (Supabase)
- **Database**: PostgreSQL
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Functions**: Edge Functions
- **Real-time**: Supabase Realtime

### Authentication
- JWT tokens
- OTP via SMS (demo mode active)
- Google OAuth 2.0
- Role-based permissions

---

## 📖 Quick Start Guide

### For Tenants
1. Visit homepage → Click "Search Properties"
2. Apply filters (location, budget, bedrooms)
3. Browse results → Click property card
4. View details → Save favorite (❤️)
5. Login to send inquiry or contact owner
6. Track inquiries in dashboard

### For Property Owners
1. Sign up → Select "Property Owner"
2. Complete OTP verification
3. Login → Navigate to dashboard
4. Click "Add Property"
5. Fill property details & upload photos
6. Submit for approval
7. Track status (Pending → Approved)
8. Receive tenant inquiries
9. Respond via Call/WhatsApp

### For Agents
1. Sign up → Select "Real Estate Agent"
2. Choose subscription plan
3. Add multiple properties
4. Get verified badge
5. Feature listings for visibility
6. Manage all properties from dashboard

### For Employees
1. Login with Employee ID
2. Navigate to map/area view
3. Capture house photos
4. Upload with location details
5. Wait for admin approval
6. Track earnings (৳5 per approved photo)
7. View earnings dashboard

### For Admins
1. Login at `/admin-login`
2. Username: `admin`, Password: `admin`
3. View dashboard overview
4. Navigate to:
   - Properties → Approve/Reject listings
   - Users → Manage accounts
   - Photos → Approve employee photos
   - Earnings → Track employee payments
   - Reports → Handle complaints
   - Analytics → View business metrics

---

## 🐛 Known Issues & Limitations

### Current Limitations
- Demo mode active (production APIs commented out)
- OTP hardcoded as `123456` for testing
- No actual SMS sending (requires Twilio/similar)
- Payment gateway not integrated
- Map view not implemented yet
- Real-time chat not available

### Demo Mode Notice
This application is running in **DEMO MODE** for testing purposes. In production:
- Real OTP will be sent via SMS
- Payment processing will be enabled
- All security features will be active
- Database will use production Supabase project

---

## 📝 License & Credits

**Built for**: Dhaka House Rental Marketplace
**Framework**: React + TypeScript + Tailwind CSS
**Backend**: Supabase
**UI Components**: Custom built with Shadcn/ui inspiration
**Icons**: Lucide React
**Images**: Unsplash (placeholder images)

---

## 📧 Support

For technical support or feature requests, contact the development team.

**Admin Demo Access**: 
- URL: `/admin-login`
- Username: `admin`
- Password: `admin`

---

*Last Updated: February 10, 2026*
*Version: 1.0.0*

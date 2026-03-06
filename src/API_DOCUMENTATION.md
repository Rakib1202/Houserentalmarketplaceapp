# 🔌 API Documentation - HouseRentBD

Complete API reference for all backend services in the HouseRentBD application.

---

## 📋 Table of Contents

1. [Authentication API](#authentication-api)
2. [Properties API](#properties-api)
3. [Users API](#users-api)
4. [Subscriptions API](#subscriptions-api)
5. [Photo Uploads API](#photo-uploads-api)
6. [Employee Earnings API](#employee-earnings-api)
7. [CMS Content API](#cms-content-api)
8. [SEO API](#seo-api)
9. [Media Library API](#media-library-api)
10. [Analytics API](#analytics-api)
11. [Complaints API](#complaints-api)
12. [Payments API](#payments-api)
13. [CRM Leads API](#crm-leads-api)
14. [Jobs API](#jobs-api)
15. [Activity Logs API](#activity-logs-api)

---

## 🔐 Authentication API

**Import**: `import { authService } from './services/api'`

### Sign Up

```typescript
const result = await authService.signUp(
  email: string,
  password: string,
  fullName: string,
  phone: string,
  role: 'tenant' | 'owner' | 'agent' | 'employee'
);

// Response
{
  success: boolean;
  user?: User;
  error?: string;
}
```

### Sign In

```typescript
const result = await authService.signIn(
  email: string,
  password: string
);

// Response
{
  success: boolean;
  user?: User;
  profile?: UserProfile;
  error?: string;
}
```

### Sign In with Google

```typescript
const result = await authService.signInWithGoogle();

// Redirects to Google OAuth
```

### Send OTP

```typescript
const result = await authService.sendOTP(phone: string);

// Response
{
  success: boolean;
  data?: any;
  error?: string;
}
```

### Verify OTP

```typescript
const result = await authService.verifyOTP(
  phone: string,
  token: string
);

// Response
{
  success: boolean;
  user?: User;
  error?: string;
}
```

### Sign Out

```typescript
const result = await authService.signOut();
```

### Get Current User

```typescript
const result = await authService.getCurrentUser();

// Response
{
  success: boolean;
  user?: User;
  profile?: UserProfile;
  error?: string;
}
```

---

## 🏠 Properties API

**Import**: `import { propertiesService } from './services/api'`

### Get All Properties

```typescript
const result = await propertiesService.getAll(filters?: {
  status?: 'pending' | 'approved' | 'rejected' | 'rented';
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  bedrooms?: number;
});

// Response
{
  success: boolean;
  data?: Property[];
  error?: string;
}
```

### Get Property by ID

```typescript
const result = await propertiesService.getById(id: string);

// Response
{
  success: boolean;
  data?: Property;
  error?: string;
}
```

### Create Property

```typescript
const result = await propertiesService.create({
  owner_id: string;
  title: string;
  description: string;
  property_type: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  size_sqft: number;
  location: string;
  area: string;
  address: string;
  amenities: string[];
  images: string[];
  status: 'pending'; // Default
});

// Response
{
  success: boolean;
  data?: Property;
  error?: string;
}
```

### Update Property

```typescript
const result = await propertiesService.update(id: string, propertyData);

// Response
{
  success: boolean;
  data?: Property;
  error?: string;
}
```

### Delete Property

```typescript
const result = await propertiesService.delete(id: string);
```

### Approve Property (Admin)

```typescript
const result = await propertiesService.approve(
  id: string,
  adminId: string
);

// Response
{
  success: boolean;
  data?: Property;
  error?: string;
}
```

### Reject Property (Admin)

```typescript
const result = await propertiesService.reject(id: string);
```

---

## 👥 Users API

**Import**: `import { usersService } from './services/api'`

### Get All Users

```typescript
const result = await usersService.getAll(filters?: {
  role?: 'tenant' | 'owner' | 'agent' | 'employee' | 'admin';
  status?: 'active' | 'inactive' | 'suspended';
});

// Response
{
  success: boolean;
  data?: User[];
  error?: string;
}
```

### Update User

```typescript
const result = await usersService.update(id: string, {
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  status?: 'active' | 'inactive' | 'suspended';
});
```

### Suspend User

```typescript
const result = await usersService.suspend(id: string);
```

### Activate User

```typescript
const result = await usersService.activate(id: string);
```

### Delete User

```typescript
const result = await usersService.delete(id: string);
```

---

## 💳 Subscriptions API

**Import**: `import { subscriptionsService } from './services/api'`

### Get All Subscriptions

```typescript
const result = await subscriptionsService.getAll();

// Response
{
  success: boolean;
  data?: Subscription[];
  error?: string;
}
```

### Get User Subscriptions

```typescript
const result = await subscriptionsService.getByUserId(userId: string);
```

### Create Subscription

```typescript
const result = await subscriptionsService.create({
  user_id: string;
  plan_name: string;
  plan_type: 'basic' | 'premium' | 'business';
  price: number;
  start_date: string;
  end_date: string;
  features: string[];
  auto_renew: boolean;
});
```

### Cancel Subscription

```typescript
const result = await subscriptionsService.cancel(id: string);
```

---

## 📸 Photo Uploads API (Employee)

**Import**: `import { photoUploadsService } from './services/api'`

### Get All Photo Uploads

```typescript
const result = await photoUploadsService.getAll(filters?: {
  status?: 'pending' | 'approved' | 'rejected';
  employeeId?: string;
});

// Response
{
  success: boolean;
  data?: PhotoUpload[];
  error?: string;
}
```

### Upload Photo

```typescript
const result = await photoUploadsService.upload({
  employee_id: string;
  property_id: string;
  photo_url: string;
  status: 'pending';
});
```

### Approve Photo (Admin)

```typescript
const result = await photoUploadsService.approve(
  id: string,
  reviewerId: string
);

// Automatically adds ৳5 to employee earnings
```

### Reject Photo (Admin)

```typescript
const result = await photoUploadsService.reject(
  id: string,
  reviewerId: string
);
```

---

## 💰 Employee Earnings API

**Import**: `import { employeeEarningsService } from './services/api'`

### Get All Earnings

```typescript
const result = await employeeEarningsService.getAll();

// Response
{
  success: boolean;
  data?: EmployeeEarnings[];
  error?: string;
}
```

### Get Employee Earnings

```typescript
const result = await employeeEarningsService.getByEmployeeId(
  employeeId: string
);
```

### Mark as Paid

```typescript
const result = await employeeEarningsService.markAsPaid(id: string);
```

---

## 📝 CMS Content API

**Import**: `import { cmsContentService } from './services/cms-api'`

### Get All Content

```typescript
const result = await cmsContentService.getAll(filters?: {
  type?: 'page' | 'article' | 'banner' | 'notification';
  status?: 'published' | 'draft';
});
```

### Get Content by Slug

```typescript
const result = await cmsContentService.getBySlug(slug: string);

// Automatically increments view count
```

### Create Content

```typescript
const result = await cmsContentService.create({
  title: string;
  slug: string;
  content: string;
  type: 'page' | 'article' | 'banner' | 'notification';
  status: 'published' | 'draft';
  author_id: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
});
```

### Update Content

```typescript
const result = await cmsContentService.update(id: string, contentData);
```

### Delete Content

```typescript
const result = await cmsContentService.delete(id: string);
```

### Publish Content

```typescript
const result = await cmsContentService.publish(id: string);
```

---

## 🔍 SEO API

**Import**: `import { seoService } from './services/cms-api'`

### Get All SEO Settings

```typescript
const result = await seoService.getAll();

// Response
{
  success: boolean;
  data?: SEOSettings[];
  error?: string;
}
```

### Get SEO by URL

```typescript
const result = await seoService.getByUrl(url: string);
```

### Create SEO Settings

```typescript
const result = await seoService.create({
  page_name: string;
  url: string;
  title: string;
  meta_description: string;
  keywords: string[];
  og_image?: string;
  focus_keyword: string;
});

// Automatically calculates SEO score
```

### Update SEO Settings

```typescript
const result = await seoService.update(id: string, seoData);

// Automatically recalculates SEO score
```

### Calculate SEO Score

```typescript
const score = seoService.calculateSEOScore({
  title: string;
  meta_description: string;
  focus_keyword: string;
  keywords: string[];
  og_image?: string;
});

// Returns: 0-100
```

**Scoring Criteria**:
- Title (50-60 chars): 30 points
- Meta Description (150-160 chars): 30 points
- Focus Keyword: 20 points
- Focus Keyword in Title: +5 bonus
- Keywords array: 10 points
- OG Image: 5 points

---

## 🖼️ Media Library API

**Import**: `import { mediaService } from './services/cms-api'`

### Get All Media Files

```typescript
const result = await mediaService.getAll(filters?: {
  fileType?: 'image' | 'document' | 'video';
  folder?: string;
});
```

### Upload File

```typescript
const result = await mediaService.upload(
  file: File,
  folder: string,
  uploadedBy: string
);

// Automatically:
// - Uploads to Supabase Storage
// - Generates public URL
// - Calculates dimensions for images
// - Saves metadata to database
```

### Delete File

```typescript
const result = await mediaService.delete(id: string);

// Automatically:
// - Deletes from Supabase Storage
// - Removes from database
```

### Get Folders

```typescript
const result = await mediaService.getFolders();

// Returns unique folder names
```

---

## 📊 Analytics API

**Import**: `import { analyticsService } from './services/cms-api'`

### Track Page View

```typescript
const result = await analyticsService.trackPageView(pageUrl: string);

// Automatically creates or updates daily analytics
```

### Get Analytics by Date Range

```typescript
const result = await analyticsService.getByDateRange(
  startDate: string, // 'YYYY-MM-DD'
  endDate: string
);
```

### Get Aggregated Stats

```typescript
const result = await analyticsService.getAggregatedStats(days: number = 30);

// Returns aggregated stats per page:
{
  success: boolean;
  data?: {
    pageUrl: string;
    totalViews: number;
    totalUniqueVisitors: number;
    avgTimeSeconds: number;
    avgBounceRate: number;
  }[];
}
```

---

## 📢 Complaints API

**Import**: `import { complaintsService } from './services/admin-api'`

### Get All Complaints

```typescript
const result = await complaintsService.getAll(filters?: {
  status?: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  priority?: 'low' | 'medium' | 'high';
});
```

### Create Complaint

```typescript
const result = await complaintsService.create({
  reporter_id: string;
  reported_user_id?: string;
  property_id?: string;
  category: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
});
```

### Update Complaint Status

```typescript
const result = await complaintsService.updateStatus(
  id: string,
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected',
  resolvedBy?: string
);
```

### Update Priority

```typescript
const result = await complaintsService.updatePriority(
  id: string,
  priority: 'low' | 'medium' | 'high'
);
```

### Delete Complaint

```typescript
const result = await complaintsService.delete(id: string);
```

---

## 💵 Payments API

**Import**: `import { paymentsService } from './services/admin-api'`

### Get All Payments

```typescript
const result = await paymentsService.getAll(filters?: {
  status?: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentType?: 'subscription' | 'commission' | 'refund';
});
```

### Create Payment

```typescript
const result = await paymentsService.create({
  user_id: string;
  amount: number;
  payment_type: 'subscription' | 'commission' | 'refund';
  payment_method: string;
  transaction_id: string;
  status: 'pending';
});
```

### Update Payment Status

```typescript
const result = await paymentsService.updateStatus(
  id: string,
  status: 'completed' | 'failed'
);
```

### Process Refund

```typescript
const result = await paymentsService.refund(id: string);
```

### Get Payment Statistics

```typescript
const result = await paymentsService.getStatistics(
  startDate?: string,
  endDate?: string
);

// Returns:
{
  totalRevenue: number;
  completedPayments: number;
  pendingPayments: number;
  failedPayments: number;
  refundedAmount: number;
  subscriptionRevenue: number;
  commissionRevenue: number;
}
```

---

## 🤝 CRM Leads API

**Import**: `import { crmLeadsService } from './services/admin-api'`

### Get All Leads

```typescript
const result = await crmLeadsService.getAll(filters?: {
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  assignedTo?: string;
});
```

### Create Lead

```typescript
const result = await crmLeadsService.create({
  name: string;
  email: string;
  phone: string;
  source: string;
  status: 'new';
  property_interest?: string;
  budget?: number;
  notes?: string;
});
```

### Update Lead

```typescript
const result = await crmLeadsService.update(id: string, leadData);
```

### Update Lead Status

```typescript
const result = await crmLeadsService.updateStatus(
  id: string,
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
);
```

### Assign Lead

```typescript
const result = await crmLeadsService.assign(
  id: string,
  assignedTo: string
);
```

### Get Lead Statistics

```typescript
const result = await crmLeadsService.getStatistics();

// Returns:
{
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  converted: number;
  lost: number;
}
```

---

## 💼 Jobs API

**Import**: `import { jobsService } from './services/admin-api'`

### Get All Jobs

```typescript
const result = await jobsService.getAll(filters?: {
  status?: 'active' | 'closed';
  department?: string;
});
```

### Get Job by ID

```typescript
const result = await jobsService.getById(id: string);
```

### Create Job

```typescript
const result = await jobsService.create({
  title: string;
  department: string;
  location: string;
  job_type: 'full-time' | 'part-time' | 'remote' | 'contract';
  description: string;
  requirements: string[];
  responsibilities: string[];
  salary_min?: number;
  salary_max?: number;
  application_email: string;
  status: 'active';
});
```

### Update Job

```typescript
const result = await jobsService.update(id: string, jobData);
```

### Toggle Job Status

```typescript
const result = await jobsService.toggleStatus(id: string);

// Switches between 'active' and 'closed'
```

### Delete Job

```typescript
const result = await jobsService.delete(id: string);
```

### Increment Applicants

```typescript
const result = await jobsService.incrementApplicants(id: string);

// Called when someone applies
```

---

## 📋 Activity Logs API

**Import**: `import { activityLogsService } from './services/admin-api'`

### Log Activity

```typescript
const result = await activityLogsService.log({
  user_id: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: any;
  ip_address?: string;
});
```

### Get All Logs

```typescript
const result = await activityLogsService.getAll(filters?: {
  userId?: string;
  entityType?: string;
  limit?: number;
});
```

### Get Recent Activity

```typescript
const result = await activityLogsService.getRecent(limit: number = 50);
```

---

## 📊 Dashboard API

**Import**: `import { dashboardService } from './services/admin-api'`

### Get Admin Dashboard Stats

```typescript
const result = await dashboardService.getAdminStats();

// Returns comprehensive statistics:
{
  users: {
    total: number;
    tenants: number;
    owners: number;
    agents: number;
    employees: number;
    active: number;
  };
  properties: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    rented: number;
  };
  subscriptions: {
    total: number;
    active: number;
    revenue: number;
  };
  payments: {
    total: number;
    completed: number;
    pending: number;
    totalRevenue: number;
  };
  complaints: {
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
  };
  photoUploads: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}
```

---

## 🔄 Real-time Subscriptions

Subscribe to real-time changes using Supabase Realtime:

```typescript
import { supabase } from './lib/supabase';

// Subscribe to property changes
const subscription = supabase
  .channel('properties-channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'properties' },
    (payload) => {
      console.log('Property changed:', payload);
    }
  )
  .subscribe();

// Unsubscribe
subscription.unsubscribe();
```

---

## ⚠️ Error Handling

All API functions return a standardized response:

```typescript
{
  success: boolean;
  data?: any;
  error?: string;
}
```

**Example Usage**:

```typescript
const result = await propertiesService.getAll();

if (result.success) {
  // Handle successful response
  console.log(result.data);
} else {
  // Handle error
  console.error(result.error);
  toast.error(result.error);
}
```

---

## 🔐 Authentication Required

Most API calls require authentication. Ensure user is logged in:

```typescript
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  // Redirect to login
  navigate('/login');
}
```

---

## 📝 TypeScript Types

All types are defined in `/lib/supabase.ts` under the `Database` interface.

**Import Types**:

```typescript
import type { Database } from './lib/supabase';

type Property = Database['public']['Tables']['properties']['Row'];
type PropertyInsert = Database['public']['Tables']['properties']['Insert'];
type PropertyUpdate = Database['public']['Tables']['properties']['Update'];
```

---

## 🎯 Quick Reference

| Feature | Service | Import |
|---------|---------|--------|
| Authentication | `authService` | `./services/api` |
| Properties | `propertiesService` | `./services/api` |
| Users | `usersService` | `./services/api` |
| Subscriptions | `subscriptionsService` | `./services/api` |
| Photo Uploads | `photoUploadsService` | `./services/api` |
| Employee Earnings | `employeeEarningsService` | `./services/api` |
| CMS Content | `cmsContentService` | `./services/cms-api` |
| SEO | `seoService` | `./services/cms-api` |
| Media | `mediaService` | `./services/cms-api` |
| Analytics | `analyticsService` | `./services/cms-api` |
| Complaints | `complaintsService` | `./services/admin-api` |
| Payments | `paymentsService` | `./services/admin-api` |
| CRM Leads | `crmLeadsService` | `./services/admin-api` |
| Jobs | `jobsService` | `./services/admin-api` |
| Activity Logs | `activityLogsService` | `./services/admin-api` |
| Dashboard Stats | `dashboardService` | `./services/admin-api` |

---

## ✅ Complete!

All API services are documented and ready to use. For implementation examples, check the component files in your application.

**Need help?** Refer to:
- `/DATABASE_SETUP.md` for database configuration
- `/lib/supabase.ts` for type definitions
- Individual service files for implementation details

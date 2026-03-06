# 🗄️ Database Setup Instructions

Complete guide to set up the Supabase database for HouseRentBD application.

---

## 📋 Prerequisites

1. **Supabase Account**: Sign up at [https://supabase.com](https://supabase.com)
2. **Node.js & npm**: Ensure you have Node.js installed
3. **Git**: For version control

---

## 🚀 Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in project details:
   - **Name**: HouseRentBD
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to Dhaka (Singapore/Mumbai)
4. Click **"Create new project"**
5. Wait 2-3 minutes for project to be ready

---

## 🔑 Step 2: Get API Credentials

1. Go to **Project Settings** > **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJhbG...`)

3. Create `.env` file in your project root:
```bash
cp .env.example .env
```

4. Update `.env` with your credentials:
```env
VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

---

## 📊 Step 3: Create Database Schema

### Option A: Using SQL Editor (Recommended)

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **"New Query"**
3. Copy the entire contents from `/database/schema.sql`
4. Paste into the SQL editor
5. Click **"Run"** (or press Ctrl/Cmd + Enter)
6. Wait for execution to complete
7. You should see ✅ Success message

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-id

# Run migrations
supabase db push
```

---

## 🔐 Step 4: Configure Authentication

### Enable Email/Password Authentication

1. Go to **Authentication** > **Providers**
2. **Email** provider:
   - Should be enabled by default
   - ✅ Enable email confirmations (optional)

### Enable Google OAuth (Optional)

1. Go to **Authentication** > **Providers**
2. Find **Google** and click configure
3. Enable the provider
4. Add credentials:
   - Get Client ID and Secret from [Google Cloud Console](https://console.cloud.google.com)
   - Follow Supabase's Google OAuth setup guide
5. Set redirect URL: `https://your-project.supabase.co/auth/v1/callback`

### Enable Phone/OTP Authentication (Optional)

1. Go to **Authentication** > **Providers**
2. Find **Phone** and click configure
3. Enable the provider
4. Choose SMS provider (Twilio recommended)
5. Add your SMS provider credentials

---

## 💾 Step 5: Configure Storage

### Create Storage Buckets

1. Go to **Storage** in Supabase Dashboard
2. Click **"Create bucket"**
3. Create the following buckets:

#### Media Bucket
- **Name**: `media`
- **Public**: ✅ Enable (for public access to images)
- **File size limit**: 10 MB
- **Allowed MIME types**: 
  - `image/*`
  - `video/*`
  - `application/pdf`

#### Property Images Bucket (Optional separate bucket)
- **Name**: `property-images`
- **Public**: ✅ Enable
- **File size limit**: 5 MB
- **Allowed MIME types**: `image/*`

### Set Storage Policies

For the `media` bucket:

```sql
-- Allow public read access
CREATE POLICY "Public can view media files"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

-- Users can delete their own files
CREATE POLICY "Users can delete own media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## 🔒 Step 6: Configure Row Level Security (RLS)

The schema.sql already includes basic RLS policies. For production, you may want to add more specific policies:

### Admin Role Setup

1. Go to **SQL Editor**
2. Run this to create admin user:

```sql
-- Insert admin user (replace with your actual email)
INSERT INTO users (
  id,
  email,
  full_name,
  phone,
  role,
  verified,
  status
) VALUES (
  '00000000-0000-0000-0000-000000000001', -- Replace with actual UUID
  'admin@houserentbd.com',
  'System Administrator',
  '+8801712345678',
  'admin',
  true,
  'active'
);
```

3. Grant admin privileges in Supabase Auth:
   - Go to **Authentication** > **Users**
   - Find the admin user
   - Edit their metadata to add `{ "role": "admin" }`

---

## 📈 Step 7: Seed Sample Data (Optional)

The schema.sql includes basic sample data. To add more:

```sql
-- Add sample properties
INSERT INTO properties (
  owner_id,
  title,
  description,
  property_type,
  price,
  bedrooms,
  bathrooms,
  size_sqft,
  location,
  area,
  amenities,
  images,
  status
) VALUES
  ('user-id-here', '3 Bedroom Apartment', 'Beautiful apartment in Dhanmondi', 'Apartment', 35000, 3, 2, 1400, 'Dhaka', 'Dhanmondi', 
   ARRAY['parking', 'generator', 'security'],
   ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'],
   'approved');

-- Add sample SEO settings (already in schema.sql)

-- Add sample job postings (already in schema.sql)
```

---

## 🎯 Step 8: Test Database Connection

### In Your Application

1. Start your development server:
```bash
npm run dev
```

2. Open browser console (F12)
3. Check for Supabase connection

### Test Queries in SQL Editor

```sql
-- Test: Count users
SELECT COUNT(*) FROM users;

-- Test: Get all properties
SELECT * FROM properties LIMIT 5;

-- Test: Check SEO settings
SELECT * FROM seo_settings;
```

---

## 🔧 Step 9: Configure Real-time (Optional)

Enable real-time updates for specific tables:

1. Go to **Database** > **Replication**
2. Enable replication for:
   - ✅ `properties`
   - ✅ `complaints`
   - ✅ `photo_uploads`
   - ✅ `crm_leads`

This allows real-time updates in your application.

---

## 📱 Step 10: Mobile & Production Setup

### For Production Deployment

1. **Create production project** (separate from development)
2. Update `.env.production` with production credentials
3. Set up **database backups**:
   - Go to **Settings** > **Database**
   - Enable daily backups
4. Configure **custom domain** (optional):
   - Go to **Settings** > **Custom Domains**

### Environment Variables for Production

```env
# Production .env
VITE_SUPABASE_URL=https://your-production-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

---

## 🧪 Step 11: Verify Everything Works

### Checklist

- [ ] Database tables created
- [ ] Sample data inserted
- [ ] Storage buckets created
- [ ] Authentication providers enabled
- [ ] RLS policies active
- [ ] Environment variables configured
- [ ] Application connects successfully

### Test Each Module

1. **Authentication**:
   - Sign up a new user
   - Sign in with email/password
   - Test Google OAuth (if enabled)

2. **Properties**:
   - Create a property
   - View property list
   - Update property status

3. **CMS**:
   - Create content
   - Update SEO settings
   - Upload media file

4. **Admin Functions**:
   - Approve properties
   - Manage users
   - View analytics

---

## 🆘 Troubleshooting

### Connection Issues

**Problem**: "Failed to connect to Supabase"
- ✅ Check `.env` file exists
- ✅ Verify VITE_ prefix on environment variables
- ✅ Restart development server
- ✅ Check Supabase project is active

**Problem**: "Invalid API key"
- ✅ Copy fresh keys from Supabase dashboard
- ✅ Don't use service role key for client

### RLS Policy Issues

**Problem**: "Row level security policy violation"
- ✅ Check if RLS is enabled on table
- ✅ Verify policies exist for your use case
- ✅ Check user authentication state

### Storage Issues

**Problem**: "Cannot upload file"
- ✅ Check bucket exists and is public
- ✅ Verify storage policies
- ✅ Check file size limits
- ✅ Verify MIME type is allowed

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)

---

## 🔄 Database Migrations

For future schema changes:

1. Create migration file: `migrations/YYYYMMDD_description.sql`
2. Add your SQL changes
3. Run in Supabase SQL Editor
4. Document in version control

---

## ✅ Setup Complete!

Your database is now ready for development. All tables, policies, and configurations are in place.

**Next Steps**:
1. Start building your application
2. Test all features
3. Add more sample data as needed
4. Configure production environment when ready

---

## 🎉 You're Ready to Build!

The complete backend infrastructure is now set up with:
- ✅ 14 database tables
- ✅ Row level security
- ✅ Storage buckets
- ✅ Authentication configured
- ✅ Sample data loaded
- ✅ API services ready

Start coding and let the database handle the rest! 🚀

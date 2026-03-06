-- HouseRentBD Database Schema
-- Complete SQL schema for Supabase PostgreSQL database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================
-- USERS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) NOT NULL CHECK (role IN ('tenant', 'owner', 'agent', 'employee', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  verified BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- ==============================================
-- PROPERTIES TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  property_type VARCHAR(100) NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  size_sqft INTEGER,
  location VARCHAR(255) NOT NULL,
  area VARCHAR(255),
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  amenities TEXT[], -- Array of amenities
  images TEXT[], -- Array of image URLs
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'rented')),
  featured BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES users(id)
);

CREATE INDEX idx_properties_owner ON properties(owner_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_location ON properties(location);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_featured ON properties(featured);

-- ==============================================
-- SUBSCRIPTIONS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_name VARCHAR(100) NOT NULL,
  plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('basic', 'premium', 'business')),
  price DECIMAL(10, 2) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  features TEXT[],
  auto_renew BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_end_date ON subscriptions(end_date);

-- ==============================================
-- PHOTO UPLOADS TABLE (Employee Photo System)
-- ==============================================
CREATE TABLE IF NOT EXISTS photo_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES users(id),
  earnings DECIMAL(10, 2) DEFAULT 0.00
);

CREATE INDEX idx_photo_uploads_employee ON photo_uploads(employee_id);
CREATE INDEX idx_photo_uploads_property ON photo_uploads(property_id);
CREATE INDEX idx_photo_uploads_status ON photo_uploads(status);

-- ==============================================
-- EMPLOYEE EARNINGS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS employee_earnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  total_photos INTEGER DEFAULT 0,
  approved_photos INTEGER DEFAULT 0,
  total_earnings DECIMAL(10, 2) DEFAULT 0.00,
  paid BOOLEAN DEFAULT FALSE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_employee_earnings_employee ON employee_earnings(employee_id);
CREATE INDEX idx_employee_earnings_month ON employee_earnings(month);
CREATE UNIQUE INDEX idx_employee_earnings_unique ON employee_earnings(employee_id, month);

-- ==============================================
-- COMPLAINTS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS complaints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES users(id),
  property_id UUID REFERENCES properties(id),
  category VARCHAR(100) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'rejected')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES users(id)
);

CREATE INDEX idx_complaints_reporter ON complaints(reporter_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_priority ON complaints(priority);

-- ==============================================
-- CMS CONTENT TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS cms_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  content TEXT,
  type VARCHAR(50) NOT NULL CHECK (type IN ('page', 'article', 'banner', 'notification')),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
  author_id UUID NOT NULL REFERENCES users(id),
  meta_title VARCHAR(255),
  meta_description TEXT,
  keywords TEXT[],
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_cms_content_slug ON cms_content(slug);
CREATE INDEX idx_cms_content_type ON cms_content(type);
CREATE INDEX idx_cms_content_status ON cms_content(status);

-- ==============================================
-- SEO SETTINGS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS seo_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_name VARCHAR(255) NOT NULL,
  url VARCHAR(500) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  meta_description TEXT,
  keywords TEXT[],
  og_image TEXT,
  focus_keyword VARCHAR(255),
  seo_score INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_seo_settings_url ON seo_settings(url);

-- ==============================================
-- MEDIA FILES TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS media_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(500) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50) NOT NULL CHECK (file_type IN ('image', 'document', 'video')),
  file_size BIGINT NOT NULL, -- Size in bytes
  folder VARCHAR(255),
  dimensions VARCHAR(50), -- e.g., "1920x1080"
  uploaded_by UUID NOT NULL REFERENCES users(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_media_files_type ON media_files(file_type);
CREATE INDEX idx_media_files_folder ON media_files(folder);
CREATE INDEX idx_media_files_uploaded_by ON media_files(uploaded_by);

-- ==============================================
-- PAGE ANALYTICS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS page_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_url VARCHAR(500) NOT NULL,
  views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  avg_time_seconds INTEGER DEFAULT 0,
  bounce_rate DECIMAL(5, 2) DEFAULT 0.00,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_page_analytics_url ON page_analytics(page_url);
CREATE INDEX idx_page_analytics_date ON page_analytics(date);
CREATE UNIQUE INDEX idx_page_analytics_unique ON page_analytics(page_url, date);

-- ==============================================
-- JOB POSTINGS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS job_postings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  department VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  job_type VARCHAR(50) NOT NULL CHECK (job_type IN ('full-time', 'part-time', 'remote', 'contract')),
  description TEXT NOT NULL,
  requirements TEXT[],
  responsibilities TEXT[],
  salary_min DECIMAL(12, 2),
  salary_max DECIMAL(12, 2),
  application_email VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  applicants_count INTEGER DEFAULT 0,
  posted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_job_postings_status ON job_postings(status);
CREATE INDEX idx_job_postings_department ON job_postings(department);

-- ==============================================
-- PAYMENTS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  payment_type VARCHAR(50) NOT NULL CHECK (payment_type IN ('subscription', 'commission', 'refund')),
  payment_method VARCHAR(100) NOT NULL,
  transaction_id VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_transaction ON payments(transaction_id);

-- ==============================================
-- CRM LEADS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS crm_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  source VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  assigned_to UUID REFERENCES users(id),
  property_interest VARCHAR(255),
  budget DECIMAL(12, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_crm_leads_status ON crm_leads(status);
CREATE INDEX idx_crm_leads_assigned ON crm_leads(assigned_to);
CREATE INDEX idx_crm_leads_email ON crm_leads(email);

-- ==============================================
-- ACTIVITY LOGS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID,
  details JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at DESC);

-- ==============================================
-- TRIGGERS FOR UPDATED_AT
-- ==============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON complaints
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cms_content_updated_at BEFORE UPDATE ON cms_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seo_settings_updated_at BEFORE UPDATE ON seo_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_postings_updated_at BEFORE UPDATE ON job_postings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_leads_updated_at BEFORE UPDATE ON crm_leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Public read access for job postings and published CMS content
CREATE POLICY "Public can view active job postings" ON job_postings
  FOR SELECT USING (status = 'active');

CREATE POLICY "Public can view published CMS content" ON cms_content
  FOR SELECT USING (status = 'published');

-- Users can view their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Property policies
CREATE POLICY "Anyone can view approved properties" ON properties
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Owners can manage own properties" ON properties
  FOR ALL USING (owner_id = auth.uid());

-- Admin full access (requires custom claims)
-- This would be set up through Supabase Auth custom claims

-- ==============================================
-- SAMPLE DATA INSERT
-- ==============================================

-- Insert admin user
INSERT INTO users (email, full_name, phone, role, verified, status) VALUES
('admin@houserentbd.com', 'System Admin', '+8801712345678', 'admin', TRUE, 'active')
ON CONFLICT (email) DO NOTHING;

-- Insert SEO settings for main pages
INSERT INTO seo_settings (page_name, url, title, meta_description, keywords, focus_keyword, seo_score) VALUES
('Homepage', '/', 'HouseRentBD - Find Your Perfect Home in Dhaka', 'Discover thousands of rental properties in Dhaka. Connect with verified owners, agents, and find your dream home today.', ARRAY['house rent', 'dhaka rental', 'apartment', 'property'], 'house rent dhaka', 85),
('Property Listings', '/listings', 'Property Listings - Houses & Apartments in Dhaka', 'Browse available rental properties in Dhaka. Filter by location, price, and amenities.', ARRAY['property listings', 'rental apartments', 'houses for rent'], 'rental apartments dhaka', 72),
('About Us', '/about', 'About Us - HouseRentBD', 'Learn about HouseRentBD and our mission to connect people with their perfect homes.', ARRAY['about', 'company'], 'house rent company', 45)
ON CONFLICT (url) DO NOTHING;

-- Insert sample job postings
INSERT INTO job_postings (title, department, location, job_type, description, requirements, responsibilities, salary_min, salary_max, application_email, status) VALUES
('Senior Software Engineer', 'Engineering', 'Dhaka, Bangladesh', 'full-time', 
'Join our engineering team to build the future of rental marketplace technology.', 
ARRAY['5+ years experience', 'React & Node.js', 'Database design'], 
ARRAY['Develop new features', 'Code reviews', 'Mentor junior developers'],
80000, 120000, 'careers@houserentbd.com', 'active'),
('Marketing Manager', 'Marketing', 'Dhaka, Bangladesh', 'full-time',
'Lead our marketing initiatives and grow our brand presence.',
ARRAY['3+ years in digital marketing', 'SEO/SEM expertise', 'Team management'],
ARRAY['Develop marketing strategies', 'Manage campaigns', 'Analyze metrics'],
60000, 90000, 'careers@houserentbd.com', 'active')
ON CONFLICT DO NOTHING;

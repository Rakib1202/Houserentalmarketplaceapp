import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// Create Supabase client for auth and storage
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Initialize storage buckets on startup
async function initStorageBuckets() {
  const buckets = ['make-449053da-properties', 'make-449053da-employee-photos'];
  
  for (const bucketName of buckets) {
    const { data: existingBuckets } = await supabase.storage.listBuckets();
    const bucketExists = existingBuckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, { public: false });
      console.log(`Created bucket: ${bucketName}`);
    }
  }
}

initStorageBuckets();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-449053da/health", (c) => {
  return c.json({ status: "ok" });
});

// ==================== AUTH ROUTES ====================

// Sign up new user
app.post("/make-server-449053da/signup", async (c) => {
  try {
    const { phone, name, role } = await c.req.json();
    
    if (!phone || !name || !role) {
      return c.json({ error: 'Phone, name, and role are required' }, 400);
    }

    // Create user with email auth (phone number used as email identifier)
    // We're not using Supabase phone auth to avoid E.164 format requirements
    const email = `${phone}@dhaka-rent.app`;
    const password = Math.random().toString(36).slice(-8); // Generate random password
    
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role, phone },
      email_confirm: true, // Auto-confirm since email server not configured
    });

    if (authError) {
      console.log('Authorization error during signup:', authError);
      return c.json({ error: authError.message }, 400);
    }

    // Store user data in KV
    const user = {
      id: authData.user.id,
      phone,
      name,
      role,
      verified: false,
      premium: false,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`user:${authData.user.id}`, user);

    return c.json({ user, password }); // Return password for demo purposes
  } catch (error) {
    console.log('Error during signup:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Sign in user
app.post("/make-server-449053da/login", async (c) => {
  try {
    const { phone, password } = await c.req.json();
    
    if (!phone || !password) {
      return c.json({ error: 'Phone and password are required' }, 400);
    }

    const email = `${phone}@dhaka-rent.app`;
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('Authorization error during login:', error);
      return c.json({ error: error.message }, 401);
    }

    // Get user data from KV
    const user = await kv.get(`user:${data.user.id}`);
    
    if (!user) {
      // User authenticated but no user data in KV - create it from auth metadata
      const newUser = {
        id: data.user.id,
        phone: data.user.phone || phone,
        name: data.user.user_metadata?.name || 'User',
        role: data.user.user_metadata?.role || 'tenant',
        verified: false,
        premium: false,
        createdAt: new Date().toISOString(),
      };
      await kv.set(`user:${data.user.id}`, newUser);
      
      return c.json({ 
        accessToken: data.session.access_token,
        user: newUser
      });
    }

    return c.json({ 
      accessToken: data.session.access_token,
      user 
    });
  } catch (error) {
    console.log('Error during login:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get current user
app.get("/make-server-449053da/me", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user: authUser }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !authUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const user = await kv.get(`user:${authUser.id}`);
    
    return c.json({ user });
  } catch (error) {
    console.log('Error getting current user:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Complete signup after OTP/Google auth
app.post("/make-server-449053da/complete-signup", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !authUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user already exists
    const existingUser = await kv.get(`user:${authUser.id}`);
    if (existingUser) {
      return c.json({ user: existingUser });
    }

    const { phone, name, role } = await c.req.json();
    
    if (!name || !role) {
      return c.json({ error: 'Name and role are required' }, 400);
    }

    // Create user profile
    const user = {
      id: authUser.id,
      phone: phone || authUser.phone || '',
      name,
      role,
      verified: false,
      premium: false,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`user:${authUser.id}`, user);

    return c.json({ user });
  } catch (error) {
    console.log('Error completing signup:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Demo mode: Create user without Supabase Auth
app.post("/make-server-449053da/signup-demo", async (c) => {
  try {
    const { phone, name, role } = await c.req.json();
    
    if (!phone || !name || !role) {
      return c.json({ error: 'Phone, name, and role are required' }, 400);
    }

    // Check if user already exists
    const existingUsers = await kv.getByPrefix('user:');
    const existingUser = existingUsers.find((u: any) => u.phone === phone);
    
    if (existingUser) {
      return c.json({ error: 'User with this phone already exists' }, 400);
    }

    // Generate a unique user ID
    const userId = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create user profile without password yet
    const user = {
      id: userId,
      phone,
      name,
      role,
      verified: false,
      premium: false,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`user:${userId}`, user);

    return c.json({ userId, user });
  } catch (error) {
    console.log('Error in demo signup:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Check if user exists by phone
app.post("/make-server-449053da/check-user", async (c) => {
  try {
    const { phone } = await c.req.json();
    
    if (!phone) {
      return c.json({ error: 'Phone is required' }, 400);
    }

    // Find user by phone
    const allUsers = await kv.getByPrefix('user:');
    const user = allUsers.find((u: any) => u.phone === phone);
    
    if (user) {
      return c.json({ exists: true, user });
    }

    return c.json({ exists: false });
  } catch (error) {
    console.log('Error checking user:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Demo mode: Complete signup with password
app.post("/make-server-449053da/complete-demo-signup", async (c) => {
  try {
    const { phone, password, userId } = await c.req.json();
    
    if (!phone || !password || !userId) {
      return c.json({ error: 'Phone, password, and userId are required' }, 400);
    }

    // Get user
    const user = await kv.get(`user:${userId}`);
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Hash password (simple demo - in production use bcrypt or similar)
    const hashedPassword = btoa(password); // Base64 encoding for demo

    // Update user with password
    const updatedUser = {
      ...user,
      password: hashedPassword,
    };

    await kv.set(`user:${userId}`, updatedUser);

    return c.json({ success: true });
  } catch (error) {
    console.log('Error completing demo signup:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Demo mode: Login with OTP
app.post("/make-server-449053da/login-otp-demo", async (c) => {
  try {
    const { phone } = await c.req.json();
    
    if (!phone) {
      return c.json({ error: 'Phone is required' }, 400);
    }

    // Find user by phone
    const allUsers = await kv.getByPrefix('user:');
    const user = allUsers.find((u: any) => u.phone === phone);
    
    if (!user) {
      return c.json({ error: 'User not found. Please sign up first.' }, 404);
    }

    // Generate a demo access token
    const accessToken = `demo_token_${user.id}_${Date.now()}`;

    return c.json({ 
      user, 
      accessToken 
    });
  } catch (error) {
    console.log('Error in OTP demo login:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Demo mode: Login with password
app.post("/make-server-449053da/login-demo", async (c) => {
  try {
    const { phone, password } = await c.req.json();
    
    if (!phone || !password) {
      return c.json({ error: 'Phone and password are required' }, 400);
    }

    // Find user by phone
    const allUsers = await kv.getByPrefix('user:');
    const user = allUsers.find((u: any) => u.phone === phone);
    
    if (!user) {
      return c.json({ error: 'User not found. Please sign up first.' }, 404);
    }

    // Check if user has a password set
    if (!user.password) {
      return c.json({ error: 'Password not set. Please complete signup or use OTP login.' }, 400);
    }

    // Verify password (demo: decode base64)
    const storedPassword = atob(user.password);
    
    if (password !== storedPassword) {
      return c.json({ error: 'Invalid login credentials' }, 401);
    }

    // Generate a demo access token
    const accessToken = `demo_token_${user.id}_${Date.now()}`;

    return c.json({ 
      user, 
      accessToken 
    });
  } catch (error) {
    console.log('Error in password demo login:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== PROPERTY ROUTES ====================

// Create property listing
app.post("/make-server-449053da/properties", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !authUser) {
      console.log('Auth error:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userData = await kv.get(`user:${authUser.id}`);
    
    if (!userData || !['owner', 'agent', 'admin'].includes(userData.role)) {
      console.log('User role error:', userData?.role);
      return c.json({ error: 'Only owners, agents, and admins can create properties' }, 403);
    }

    const propertyData = await c.req.json();
    
    // Log payload size for debugging
    const payloadSize = JSON.stringify(propertyData).length;
    console.log(`Property payload size: ${(payloadSize / 1024).toFixed(2)} KB`);
    
    // Check if photos array is too large
    if (propertyData.photos && propertyData.photos.length > 0) {
      const photosSize = JSON.stringify(propertyData.photos).length;
      console.log(`Photos size: ${(photosSize / 1024).toFixed(2)} KB`);
      console.log(`Number of photos: ${propertyData.photos.length}`);
      
      // If photos are too large, reject
      if (photosSize > 500 * 1024) { // 500KB limit for photos
        return c.json({ error: 'Photos size too large. Please reduce image quality or number of photos.' }, 400);
      }
    }
    
    const property = {
      id: crypto.randomUUID(),
      ownerId: authUser.id,
      ownerName: userData.name,
      ownerPhone: userData.phone,
      status: userData.role === 'admin' ? 'approved' : 'pending',
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...propertyData,
    };

    console.log('Attempting to save property:', property.id);
    await kv.set(`property:${property.id}`, property);
    console.log('Property saved successfully:', property.id);

    return c.json({ property }, 201);
  } catch (error) {
    console.error('Error creating property:', error);
    return c.json({ error: `Failed to create property: ${String(error)}` }, 500);
  }
});

// Get all properties (with filters)
app.get("/make-server-449053da/properties", async (c) => {
  try {
    const area = c.req.query('area');
    const minRent = c.req.query('minRent');
    const maxRent = c.req.query('maxRent');
    const bedrooms = c.req.query('bedrooms');
    const tenantType = c.req.query('tenantType');
    const status = c.req.query('status') || 'approved';

    const allProperties = await kv.getByPrefix('property:');
    
    let filtered = allProperties.filter((p: any) => p.status === status);

    if (area) {
      filtered = filtered.filter((p: any) => 
        p.area.toLowerCase().includes(area.toLowerCase())
      );
    }

    if (minRent) {
      filtered = filtered.filter((p: any) => p.rent >= parseInt(minRent));
    }

    if (maxRent) {
      filtered = filtered.filter((p: any) => p.rent <= parseInt(maxRent));
    }

    if (bedrooms) {
      filtered = filtered.filter((p: any) => p.bedrooms === parseInt(bedrooms));
    }

    if (tenantType && tenantType !== 'both') {
      filtered = filtered.filter((p: any) => 
        p.tenantType === tenantType || p.tenantType === 'both'
      );
    }

    // Sort featured first
    filtered.sort((a: any, b: any) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return c.json({ properties: filtered });
  } catch (error) {
    console.log('Error fetching properties:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get single property
app.get("/make-server-449053da/properties/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const property = await kv.get(`property:${id}`);
    
    if (!property) {
      return c.json({ error: 'Property not found' }, 404);
    }

    return c.json({ property });
  } catch (error) {
    console.log('Error fetching property:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Update property
app.put("/make-server-449053da/properties/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !authUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const id = c.req.param('id');
    const property = await kv.get(`property:${id}`);
    
    if (!property) {
      return c.json({ error: 'Property not found' }, 404);
    }

    const userData = await kv.get(`user:${authUser.id}`);
    
    if (property.ownerId !== authUser.id && userData.role !== 'admin') {
      return c.json({ error: 'Not authorized to update this property' }, 403);
    }

    const updates = await c.req.json();
    const updatedProperty = {
      ...property,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`property:${id}`, updatedProperty);

    return c.json({ property: updatedProperty });
  } catch (error) {
    console.log('Error updating property:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Delete property
app.delete("/make-server-449053da/properties/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !authUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const id = c.req.param('id');
    const property = await kv.get(`property:${id}`);
    
    if (!property) {
      return c.json({ error: 'Property not found' }, 404);
    }

    const userData = await kv.get(`user:${authUser.id}`);
    
    if (property.ownerId !== authUser.id && userData.role !== 'admin') {
      return c.json({ error: 'Not authorized to delete this property' }, 403);
    }

    await kv.del(`property:${id}`);

    return c.json({ success: true });
  } catch (error) {
    console.log('Error deleting property:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== INQUIRY ROUTES ====================

// Create inquiry
app.post("/make-server-449053da/inquiries", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !authUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userData = await kv.get(`user:${authUser.id}`);
    const { propertyId, message } = await c.req.json();
    
    const property = await kv.get(`property:${propertyId}`);
    
    if (!property) {
      return c.json({ error: 'Property not found' }, 404);
    }

    const inquiry = {
      id: crypto.randomUUID(),
      tenantId: authUser.id,
      tenantName: userData.name,
      tenantPhone: userData.phone,
      propertyId,
      propertyTitle: property.title,
      message,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`inquiry:${inquiry.id}`, inquiry);

    return c.json({ inquiry }, 201);
  } catch (error) {
    console.log('Error creating inquiry:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get inquiries (for property owner or tenant)
app.get("/make-server-449053da/inquiries", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !authUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userData = await kv.get(`user:${authUser.id}`);
    const allInquiries = await kv.getByPrefix('inquiry:');
    
    let filtered = [];
    
    if (userData.role === 'tenant') {
      // Tenant sees their own inquiries
      filtered = allInquiries.filter((inq: any) => inq.tenantId === authUser.id);
    } else if (['owner', 'agent'].includes(userData.role)) {
      // Owners/Agents see inquiries for their properties
      const myProperties = await kv.getByPrefix('property:');
      const myPropertyIds = myProperties
        .filter((p: any) => p.ownerId === authUser.id)
        .map((p: any) => p.id);
      
      filtered = allInquiries.filter((inq: any) => myPropertyIds.includes(inq.propertyId));
    } else if (userData.role === 'admin') {
      // Admin sees all
      filtered = allInquiries;
    }

    filtered.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return c.json({ inquiries: filtered });
  } catch (error) {
    console.log('Error fetching inquiries:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== FAVORITES ROUTES ====================

// Add to favorites
app.post("/make-server-449053da/favorites", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !authUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { propertyId } = await c.req.json();
    
    const favorite = {
      userId: authUser.id,
      propertyId,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`favorite:${authUser.id}:${propertyId}`, favorite);

    return c.json({ favorite }, 201);
  } catch (error) {
    console.log('Error adding favorite:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Remove from favorites
app.delete("/make-server-449053da/favorites/:propertyId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !authUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const propertyId = c.req.param('propertyId');
    await kv.del(`favorite:${authUser.id}:${propertyId}`);

    return c.json({ success: true });
  } catch (error) {
    console.log('Error removing favorite:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get user's favorites
app.get("/make-server-449053da/favorites", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !authUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const favorites = await kv.getByPrefix(`favorite:${authUser.id}:`);
    const propertyIds = favorites.map((f: any) => f.propertyId);
    
    const properties = await Promise.all(
      propertyIds.map((id: string) => kv.get(`property:${id}`))
    );

    return c.json({ favorites: properties.filter(Boolean) });
  } catch (error) {
    console.log('Error fetching favorites:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== ADMIN ROUTES ====================

// Approve/Reject property
app.post("/make-server-449053da/admin/properties/:id/review", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !authUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userData = await kv.get(`user:${authUser.id}`);
    
    if (userData.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const id = c.req.param('id');
    const { status } = await c.req.json();
    
    const property = await kv.get(`property:${id}`);
    
    if (!property) {
      return c.json({ error: 'Property not found' }, 404);
    }

    const updatedProperty = {
      ...property,
      status,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`property:${id}`, updatedProperty);

    return c.json({ property: updatedProperty });
  } catch (error) {
    console.log('Error reviewing property:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get all users (admin only)
app.get("/make-server-449053da/admin/users", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !authUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userData = await kv.get(`user:${authUser.id}`);
    
    if (userData.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const users = await kv.getByPrefix('user:');

    return c.json({ users });
  } catch (error) {
    console.log('Error fetching users:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Update user verification status
app.post("/make-server-449053da/admin/users/:id/verify", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !authUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const adminData = await kv.get(`user:${authUser.id}`);
    
    if (adminData.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const userId = c.req.param('id');
    const { verified } = await c.req.json();
    
    const user = await kv.get(`user:${userId}`);
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    const updatedUser = {
      ...user,
      verified,
    };

    await kv.set(`user:${userId}`, updatedUser);

    return c.json({ user: updatedUser });
  } catch (error) {
    console.log('Error verifying user:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get analytics (admin only)
app.get("/make-server-449053da/admin/analytics", async (c) => {
  try {
    const analytics = {
      popularAreas: [
        { name: 'Dhanmondi', count: 245 },
        { name: 'Gulshan', count: 198 },
        { name: 'Banani', count: 156 },
        { name: 'Mirpur', count: 134 },
        { name: 'Uttara', count: 112 },
      ],
      priceRanges: [
        { range: '৳5,000 - ৳10,000', count: 89 },
        { range: '৳10,000 - ৳20,000', count: 156 },
        { range: '৳20,000 - ৳30,000', count: 234 },
        { range: '৳30,000+', count: 98 },
      ],
      propertyTypes: [
        { type: 'apartment', percentage: 45 },
        { type: 'house', percentage: 25 },
        { type: 'bachelor', percentage: 15 },
        { type: 'sublet', percentage: 10 },
        { type: 'hostel', percentage: 5 },
      ],
      conversionRates: {
        inquiryRate: 23,
        premiumRate: 12,
        activeRate: 67,
      },
    };

    return c.json(analytics);
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== EMPLOYEE PHOTO ROUTES ====================

// Upload employee photo
app.post("/make-server-449053da/employee/photos", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !authUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userData = await kv.get(`user:${authUser.id}`);
    
    if (userData.role !== 'employee' && userData.role !== 'admin') {
      return c.json({ error: 'Employee access required' }, 403);
    }

    const { area, photoUrl, propertyId } = await c.req.json();
    
    const photo = {
      id: crypto.randomUUID(),
      employeeId: authUser.id,
      employeeName: userData.name,
      propertyId,
      area,
      photoUrl,
      approved: false,
      earnings: 0,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`photo:${photo.id}`, photo);

    return c.json({ photo }, 201);
  } catch (error) {
    console.log('Error uploading employee photo:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get employee photos
app.get("/make-server-449053da/employee/photos", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !authUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userData = await kv.get(`user:${authUser.id}`);
    const allPhotos = await kv.getByPrefix('photo:');
    
    let filtered = [];
    
    if (userData.role === 'employee') {
      // Employee sees only their photos
      filtered = allPhotos.filter((p: any) => p.employeeId === authUser.id);
    } else if (userData.role === 'admin') {
      // Admin sees all
      filtered = allPhotos;
    } else {
      return c.json({ error: 'Access denied' }, 403);
    }

    filtered.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return c.json({ photos: filtered });
  } catch (error) {
    console.log('Error fetching employee photos:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Approve employee photo (admin only)
app.post("/make-server-449053da/admin/photos/:id/approve", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !authUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userData = await kv.get(`user:${authUser.id}`);
    
    if (userData.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const photoId = c.req.param('id');
    const photo = await kv.get(`photo:${photoId}`);
    
    if (!photo) {
      return c.json({ error: 'Photo not found' }, 404);
    }

    const updatedPhoto = {
      ...photo,
      approved: true,
      earnings: 5, // ৳5 per approved photo
      approvedAt: new Date().toISOString(),
    };

    await kv.set(`photo:${photoId}`, updatedPhoto);

    return c.json({ photo: updatedPhoto });
  } catch (error) {
    console.log('Error approving photo:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get employee earnings
app.get("/make-server-449053da/employee/earnings", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !authUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userData = await kv.get(`user:${authUser.id}`);
    
    if (userData.role !== 'employee') {
      return c.json({ error: 'Employee access required' }, 403);
    }

    const allPhotos = await kv.getByPrefix('photo:');
    const myPhotos = allPhotos.filter((p: any) => p.employeeId === authUser.id);
    
    const totalEarnings = myPhotos.reduce((sum: number, p: any) => sum + (p.earnings || 0), 0);
    const approvedPhotos = myPhotos.filter((p: any) => p.approved).length;
    const pendingPhotos = myPhotos.filter((p: any) => !p.approved).length;

    return c.json({
      totalEarnings,
      approvedPhotos,
      pendingPhotos,
      totalPhotos: myPhotos.length,
    });
  } catch (error) {
    console.log('Error fetching employee earnings:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ========== ADMIN API ENDPOINTS ==========

// Admin Dashboard Stats
app.get("/make-server-449053da/admin/dashboard-stats", async (c) => {
  try {
    const adminToken = c.req.header('Authorization')?.split(' ')[1];
    if (!adminToken || !adminToken.startsWith('admin_token_')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const allUsers = await kv.getByPrefix('user:');
    const allProperties = await kv.getByPrefix('property:');
    const allPhotos = await kv.getByPrefix('photo:');
    const allPayments = await kv.getByPrefix('payment:');
    const allReports = await kv.getByPrefix('report:');

    const stats = {
      totalProperties: allProperties.length,
      pendingApprovals: allProperties.filter((p: any) => p.status === 'pending').length,
      totalTenants: allUsers.filter((u: any) => u.role === 'tenant').length,
      totalOwners: allUsers.filter((u: any) => u.role === 'owner').length,
      totalAgents: allUsers.filter((u: any) => u.role === 'agent').length,
      totalEmployees: allUsers.filter((u: any) => u.role === 'employee').length,
      premiumRevenue: allPayments.filter((p: any) => p.status === 'completed').reduce((sum: number, p: any) => sum + p.amount, 0),
      fakeReports: allReports.filter((r: any) => r.status === 'pending').length,
      pendingPhotos: allPhotos.filter((p: any) => p.status === 'pending').length,
      approvedPhotos: allPhotos.filter((p: any) => p.status === 'approved').length,
      totalEarnings: allPhotos.filter((p: any) => p.status === 'approved').length * 5,
      activeListings: allProperties.filter((p: any) => p.status === 'active').length,
    };

    const recentActivities = [
      {
        type: 'approval',
        title: 'Property Approved',
        description: 'New property listing approved in Dhanmondi',
        time: '5 minutes ago',
      },
      {
        type: 'payment',
        title: 'Premium Subscription',
        description: 'User upgraded to premium plan',
        time: '23 minutes ago',
      },
      {
        type: 'report',
        title: 'New Report',
        description: 'Property reported as fake listing',
        time: '1 hour ago',
      },
    ];

    return c.json({ stats, recentActivities });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Admin - Get all properties
app.get("/make-server-449053da/admin/properties", async (c) => {
  try {
    const allProperties = await kv.getByPrefix('property:');
    return c.json({ properties: allProperties });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Admin - Get pending properties
app.get("/make-server-449053da/admin/properties/pending", async (c) => {
  try {
    const allProperties = await kv.getByPrefix('property:');
    const pending = allProperties.filter((p: any) => p.status === 'pending');
    return c.json({ properties: pending });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Admin - Approve property
app.patch("/make-server-449053da/admin/properties/:id/approve", async (c) => {
  try {
    const propertyId = c.req.param('id');
    const property = await kv.get(`property:${propertyId}`);
    
    if (!property) {
      return c.json({ error: 'Property not found' }, 404);
    }

    await kv.set(`property:${propertyId}`, { ...property, status: 'active' });
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Admin - Reject property
app.patch("/make-server-449053da/admin/properties/:id/reject", async (c) => {
  try {
    const propertyId = c.req.param('id');
    const { reason } = await c.req.json();
    const property = await kv.get(`property:${propertyId}`);
    
    if (!property) {
      return c.json({ error: 'Property not found' }, 404);
    }

    await kv.set(`property:${propertyId}`, { 
      ...property, 
      status: 'rejected',
      rejectionReason: reason 
    });
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Admin - Delete property
app.delete("/make-server-449053da/admin/properties/:id", async (c) => {
  try {
    const propertyId = c.req.param('id');
    await kv.delete(`property:${propertyId}`);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Admin - Toggle featured status
app.patch("/make-server-449053da/admin/properties/:id/featured", async (c) => {
  try {
    const propertyId = c.req.param('id');
    const { featured } = await c.req.json();
    const property = await kv.get(`property:${propertyId}`);
    
    if (!property) {
      return c.json({ error: 'Property not found' }, 404);
    }

    await kv.set(`property:${propertyId}`, { ...property, featured });
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Admin - Get all users
app.get("/make-server-449053da/admin/users", async (c) => {
  try {
    const allUsers = await kv.getByPrefix('user:');
    return c.json({ users: allUsers });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Admin - Block/Unblock user
app.patch("/make-server-449053da/admin/users/:id/block", async (c) => {
  try {
    const userId = c.req.param('id');
    const { blocked } = await c.req.json();
    const user = await kv.get(`user:${userId}`);
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    await kv.set(`user:${userId}`, { ...user, blocked });
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Admin - Verify/Unverify user
app.patch("/make-server-449053da/admin/users/:id/verify", async (c) => {
  try {
    const userId = c.req.param('id');
    const { verified } = await c.req.json();
    const user = await kv.get(`user:${userId}`);
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    await kv.set(`user:${userId}`, { ...user, verified });
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Admin - Get subscriptions
app.get("/make-server-449053da/admin/subscriptions", async (c) => {
  try {
    const plans = await kv.getByPrefix('subscription_plan:');
    return c.json({ plans });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Admin - Create subscription plan
app.post("/make-server-449053da/admin/subscriptions", async (c) => {
  try {
    const { name, price, duration, features } = await c.req.json();
    const planId = `plan_${Date.now()}`;
    
    const plan = {
      id: planId,
      name,
      price,
      duration,
      features,
      active: true,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`subscription_plan:${planId}`, plan);
    return c.json({ plan });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Admin - Update subscription plan
app.put("/make-server-449053da/admin/subscriptions/:id", async (c) => {
  try {
    const planId = c.req.param('id');
    const { name, price, duration, features } = await c.req.json();
    const plan = await kv.get(`subscription_plan:${planId}`);
    
    if (!plan) {
      return c.json({ error: 'Plan not found' }, 404);
    }

    await kv.set(`subscription_plan:${planId}`, { 
      ...plan, 
      name, 
      price, 
      duration, 
      features 
    });
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Admin - Toggle plan active status
app.patch("/make-server-449053da/admin/subscriptions/:id/toggle", async (c) => {
  try {
    const planId = c.req.param('id');
    const { active } = await c.req.json();
    const plan = await kv.get(`subscription_plan:${planId}`);
    
    if (!plan) {
      return c.json({ error: 'Plan not found' }, 404);
    }

    await kv.set(`subscription_plan:${planId}`, { ...plan, active });
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Admin - Get payments
app.get("/make-server-449053da/admin/payments", async (c) => {
  try {
    const payments = await kv.getByPrefix('payment:');
    return c.json({ payments });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Admin - Get pending photos
app.get("/make-server-449053da/admin/photos/pending", async (c) => {
  try {
    const allPhotos = await kv.getByPrefix('photo:');
    const pending = allPhotos.filter((p: any) => p.status === 'pending');
    return c.json({ photos: pending });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Admin - Approve photo
app.patch("/make-server-449053da/admin/photos/:id/approve", async (c) => {
  try {
    const photoId = c.req.param('id');
    const photo = await kv.get(`photo:${photoId}`);
    
    if (!photo) {
      return c.json({ error: 'Photo not found' }, 404);
    }

    // Update photo status
    await kv.set(`photo:${photoId}`, { ...photo, status: 'approved' });

    // Add earning to employee
    const employee = await kv.get(`user:${photo.employeeId}`);
    if (employee) {
      const earnings = (employee.earnings || 0) + 5;
      await kv.set(`user:${photo.employeeId}`, { ...employee, earnings });
    }

    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Admin - Reject photo
app.patch("/make-server-449053da/admin/photos/:id/reject", async (c) => {
  try {
    const photoId = c.req.param('id');
    const photo = await kv.get(`photo:${photoId}`);
    
    if (!photo) {
      return c.json({ error: 'Photo not found' }, 404);
    }

    await kv.set(`photo:${photoId}`, { ...photo, status: 'rejected' });
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Admin - Get employee earnings
app.get("/make-server-449053da/admin/employee-earnings", async (c) => {
  try {
    const allUsers = await kv.getByPrefix('user:');
    const employees = allUsers.filter((u: any) => u.role === 'employee');
    
    const allPhotos = await kv.getByPrefix('photo:');
    
    const employeeData = employees.map((emp: any) => {
      const empPhotos = allPhotos.filter((p: any) => p.employeeId === emp.id);
      return {
        employeeId: emp.id,
        employeeName: emp.name,
        employeePhone: emp.phone,
        totalPhotos: empPhotos.length,
        approvedPhotos: empPhotos.filter((p: any) => p.status === 'approved').length,
        rejectedPhotos: empPhotos.filter((p: any) => p.status === 'rejected').length,
        pendingPhotos: empPhotos.filter((p: any) => p.status === 'pending').length,
        totalEarnings: empPhotos.filter((p: any) => p.status === 'approved').length * 5,
        lastUpload: empPhotos[0]?.uploadedAt || emp.createdAt,
      };
    });

    return c.json({ employees: employeeData });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Admin - Get reports
app.get("/make-server-449053da/admin/reports", async (c) => {
  try {
    const reports = await kv.getByPrefix('report:');
    return c.json({ reports });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Admin - Resolve report
app.patch("/make-server-449053da/admin/reports/:id/resolve", async (c) => {
  try {
    const reportId = c.req.param('id');
    const { action, resolution } = await c.req.json();
    const report = await kv.get(`report:${reportId}`);
    
    if (!report) {
      return c.json({ error: 'Report not found' }, 404);
    }

    if (action === 'remove_property') {
      await kv.delete(`property:${report.propertyId}`);
    }

    await kv.set(`report:${reportId}`, { 
      ...report, 
      status: action === 'remove_property' ? 'resolved' : 'dismissed',
      resolution 
    });

    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Admin - Get analytics
app.get("/make-server-449053da/admin/analytics", async (c) => {
  try {
    const analytics = {
      popularAreas: [
        { name: 'Dhanmondi', count: 245 },
        { name: 'Gulshan', count: 198 },
        { name: 'Banani', count: 156 },
        { name: 'Mirpur', count: 134 },
        { name: 'Uttara', count: 112 },
      ],
      priceRanges: [
        { range: '৳5,000 - ৳10,000', count: 89 },
        { range: '৳10,000 - ৳20,000', count: 156 },
        { range: '৳20,000 - ৳30,000', count: 234 },
        { range: '৳30,000+', count: 98 },
      ],
      propertyTypes: [
        { type: 'apartment', percentage: 45 },
        { type: 'house', percentage: 25 },
        { type: 'bachelor', percentage: 15 },
        { type: 'sublet', percentage: 10 },
        { type: 'hostel', percentage: 5 },
      ],
      conversionRates: {
        inquiryRate: 23,
        premiumRate: 12,
        activeRate: 67,
      },
    };

    return c.json(analytics);
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Admin - Get activity logs
app.get("/make-server-449053da/admin/logs", async (c) => {
  try {
    const logs = await kv.getByPrefix('log:');
    return c.json({ logs: logs.slice(0, 50) });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Admin - Update settings
app.put("/make-server-449053da/admin/settings", async (c) => {
  try {
    const settings = await c.req.json();
    await kv.set('admin_settings', settings);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== LIVE CHAT SUPPORT EMPLOYEE ROUTES ====================

// Create support employee
app.post("/make-server-449053da/support-employees", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !authUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userData = await kv.get(`user:${authUser.id}`);
    
    if (!userData || userData.role !== 'admin') {
      return c.json({ error: 'Only admins can create support employees' }, 403);
    }

    const employeeData = await c.req.json();
    
    // Store employee
    await kv.set(`support-employee:${employeeData.id}`, employeeData);
    
    // Also store by employeeId for login lookup
    await kv.set(`support-employee-id:${employeeData.employeeId}`, employeeData.id);

    return c.json({ employee: employeeData }, 201);
  } catch (error) {
    console.error('Error creating support employee:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get all support employees
app.get("/make-server-449053da/support-employees", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !authUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userData = await kv.get(`user:${authUser.id}`);
    
    if (!userData || userData.role !== 'admin') {
      return c.json({ error: 'Only admins can view support employees' }, 403);
    }

    const employees = await kv.getByPrefix('support-employee:');
    
    return c.json({ employees });
  } catch (error) {
    console.error('Error getting support employees:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Update support employee
app.put("/make-server-449053da/support-employees/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !authUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userData = await kv.get(`user:${authUser.id}`);
    
    if (!userData || userData.role !== 'admin') {
      return c.json({ error: 'Only admins can update support employees' }, 403);
    }

    const employeeId = c.req.param('id');
    const employeeData = await c.req.json();
    
    await kv.set(`support-employee:${employeeId}`, employeeData);

    return c.json({ employee: employeeData });
  } catch (error) {
    console.error('Error updating support employee:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Delete support employee
app.delete("/make-server-449053da/support-employees/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !authUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userData = await kv.get(`user:${authUser.id}`);
    
    if (!userData || userData.role !== 'admin') {
      return c.json({ error: 'Only admins can delete support employees' }, 403);
    }

    const employeeId = c.req.param('id');
    const employee = await kv.get(`support-employee:${employeeId}`);
    
    if (employee) {
      await kv.delete(`support-employee:${employeeId}`);
      await kv.delete(`support-employee-id:${employee.employeeId}`);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting support employee:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Support employee login
app.post("/make-server-449053da/support-login", async (c) => {
  try {
    const { employeeId, password } = await c.req.json();
    
    if (!employeeId || !password) {
      return c.json({ error: 'Employee ID and password are required' }, 400);
    }

    // Demo mode: Check demo employees first
    const demoEmployees = [
      {
        id: '1',
        name: 'Rahul Ahmed',
        email: 'rahul.support@houserentbd.com',
        employeeId: 'SUPPORT001',
        password: btoa('support123'),
        phone: '01712345001',
        department: 'General Support',
        status: 'active',
        onlineStatus: 'online',
        createdAt: '2024-01-15',
        lastActive: new Date().toISOString(),
        totalChats: 247,
        maxConcurrentChats: 5
      },
      {
        id: '2',
        name: 'Fatima Khan',
        email: 'fatima.support@houserentbd.com',
        employeeId: 'SUPPORT002',
        password: btoa('support456'),
        phone: '01712345002',
        department: 'Technical Support',
        status: 'active',
        onlineStatus: 'busy',
        createdAt: '2024-01-20',
        lastActive: new Date().toISOString(),
        totalChats: 189,
        maxConcurrentChats: 5
      },
      {
        id: '3',
        name: 'Karim Hassan',
        email: 'karim.support@houserentbd.com',
        employeeId: 'SUPPORT003',
        password: btoa('support789'),
        phone: '01712345003',
        department: 'Sales Support',
        status: 'inactive',
        onlineStatus: 'offline',
        createdAt: '2024-02-01',
        lastActive: new Date().toISOString(),
        totalChats: 98,
        maxConcurrentChats: 7
      }
    ];

    // Find demo employee
    const demoEmployee = demoEmployees.find(e => e.employeeId === employeeId);
    
    if (demoEmployee) {
      // Check if employee is active
      if (demoEmployee.status !== 'active') {
        return c.json({ error: 'Account is inactive or suspended' }, 403);
      }

      // Verify password (base64 encoded)
      const storedPassword = atob(demoEmployee.password);
      
      if (password !== storedPassword) {
        return c.json({ error: 'Invalid credentials' }, 401);
      }

      // Update last active time
      demoEmployee.lastActive = new Date().toISOString();
      demoEmployee.onlineStatus = 'online';

      // Generate access token
      const accessToken = `support_token_${demoEmployee.id}_${Date.now()}`;

      return c.json({ 
        employee: demoEmployee, 
        accessToken 
      });
    }

    // Production mode: Get employee UUID from employeeId
    const employeeUUID = await kv.get(`support-employee-id:${employeeId}`);
    
    if (!employeeUUID) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Get employee data
    const employee = await kv.get(`support-employee:${employeeUUID}`);
    
    if (!employee) {
      return c.json({ error: 'Employee not found' }, 404);
    }

    // Check if employee is active
    if (employee.status !== 'active') {
      return c.json({ error: 'Account is inactive or suspended' }, 403);
    }

    // Verify password (base64 encoded)
    const storedPassword = atob(employee.password);
    
    if (password !== storedPassword) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Update last active time
    employee.lastActive = new Date().toISOString();
    employee.onlineStatus = 'online';
    await kv.set(`support-employee:${employee.id}`, employee);

    // Generate access token
    const accessToken = `support_token_${employee.id}_${Date.now()}`;

    return c.json({ 
      employee, 
      accessToken 
    });
  } catch (error) {
    console.error('Error in support employee login:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get all support tickets
app.get("/make-server-449053da/support-tickets", async (c) => {
  try {
    const tickets = await kv.getByPrefix('support-ticket:');
    
    return c.json({ tickets });
  } catch (error) {
    console.error('Error getting support tickets:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Assign ticket to support employee
app.post("/make-server-449053da/support-tickets/:id/assign", async (c) => {
  try {
    const ticketId = c.req.param('id');
    const { employeeId } = await c.req.json();
    
    const ticket = await kv.get(`support-ticket:${ticketId}`);
    
    if (!ticket) {
      return c.json({ error: 'Ticket not found' }, 404);
    }

    ticket.assignedTo = employeeId;
    ticket.status = 'in-progress';
    ticket.updatedAt = new Date().toISOString();

    await kv.set(`support-ticket:${ticketId}`, ticket);

    return c.json({ ticket });
  } catch (error) {
    console.error('Error assigning ticket:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Add message to ticket
app.post("/make-server-449053da/support-tickets/:id/message", async (c) => {
  try {
    const ticketId = c.req.param('id');
    const message = await c.req.json();
    
    const ticket = await kv.get(`support-ticket:${ticketId}`);
    
    if (!ticket) {
      return c.json({ error: 'Ticket not found' }, 404);
    }

    ticket.messages = ticket.messages || [];
    ticket.messages.push(message);
    ticket.updatedAt = new Date().toISOString();

    await kv.set(`support-ticket:${ticketId}`, ticket);

    return c.json({ ticket });
  } catch (error) {
    console.error('Error adding message:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Resolve ticket
app.post("/make-server-449053da/support-tickets/:id/resolve", async (c) => {
  try {
    const ticketId = c.req.param('id');
    
    const ticket = await kv.get(`support-ticket:${ticketId}`);
    
    if (!ticket) {
      return c.json({ error: 'Ticket not found' }, 404);
    }

    ticket.status = 'resolved';
    ticket.updatedAt = new Date().toISOString();

    await kv.set(`support-ticket:${ticketId}`, ticket);

    return c.json({ ticket });
  } catch (error) {
    console.error('Error resolving ticket:', error);
    return c.json({ error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);
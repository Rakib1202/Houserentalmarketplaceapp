/**
 * MongoDB Backend API Integration
 * Base URL for all API requests
 */

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Log the API URL on initialization for debugging
console.log('🔧 API Configuration:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  API_BASE_URL: API_BASE_URL,
  mode: import.meta.env.MODE
});

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// Helper function to build headers
const buildHeaders = (includeAuth: boolean = true): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Generic API request handler
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  includeAuth: boolean = true
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = buildHeaders(includeAuth);

  console.log('🌐 API Request:', {
    url,
    method: options.method || 'GET',
    endpoint,
    hasAuth: includeAuth
  });

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        url,
        data
      });
      throw new Error(data.error || data.message || 'API request failed');
    }

    console.log('✅ API Success:', { url, status: response.status });
    return data;
  } catch (error) {
    // Enhanced error logging
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.error('❌ FAILED TO FETCH ERROR!');
      console.error('📍 Target URL:', url);
      console.error('🔧 Possible causes:');
      console.error('   1. Backend is not running on port 5000');
      console.error('   2. MongoDB is not running on port 27017');
      console.error('   3. CORS is misconfigured');
      console.error('   4. Network connectivity issue');
      console.error('');
      console.error('💡 To fix:');
      console.error('   1. Start MongoDB: brew services start mongodb-community@7.0');
      console.error('   2. Start Backend: cd server && npm run dev');
      console.error('   3. Wait for: ✅ MongoDB Connected Successfully');
      console.error('   4. Restart this frontend if needed');
    }
    console.error('API Error:', error);
    throw error;
  }
}

// ==================== AUTH API ====================

export const authAPI = {
  signup: (userData: {
    fullName: string;
    email?: string;
    phone: string;
    password: string;
    role: string;
  }) =>
    apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    }, false),

  login: (credentials: { phone: string; password: string }) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }, false),

  adminLogin: (credentials: { phone: string; password: string }) =>
    apiRequest('/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }, false),

  getMe: () => apiRequest('/auth/me', { method: 'GET' }),

  // Google OAuth login
  googleLogin: (credential: string, role?: string) =>
    apiRequest('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential, role }),
    }, false),

  // Verify Google token
  verifyGoogleToken: (token: string) =>
    apiRequest('/auth/google/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }, false),
};

// ==================== USERS API ====================

export const usersAPI = {
  getAll: (params?: { role?: string; status?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest(`/users${query ? `?${query}` : ''}`, { method: 'GET' });
  },

  getById: (id: string) =>
    apiRequest(`/users/${id}`, { method: 'GET' }),

  update: (id: string, data: any) =>
    apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updateStatus: (id: string, status: string) =>
    apiRequest(`/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  delete: (id: string) =>
    apiRequest(`/users/${id}`, { method: 'DELETE' }),

  getStats: () =>
    apiRequest('/users/stats', { method: 'GET' }),
};

// ==================== PROPERTIES API ====================

export const propertiesAPI = {
  getAll: (params?: any) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/properties${query ? `?${query}` : ''}`, { method: 'GET' });
  },

  getById: (id: string) =>
    apiRequest(`/properties/${id}`, { method: 'GET' }),

  create: (propertyData: any) =>
    apiRequest('/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/properties/${id}`, { method: 'DELETE' }),

  updateStatus: (id: string, status: string) =>
    apiRequest(`/properties/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// ==================== SUPPORT EMPLOYEES API ====================

export const supportEmployeesAPI = {
  getAll: () =>
    apiRequest('/support-employees', { method: 'GET' }),

  getNextId: () =>
    apiRequest('/support-employees/next-id', { method: 'GET' }),

  create: (employeeData: {
    name: string;
    email: string;
    employeeId: string;
    password: string;
    phone: string;
    department: string;
    maxConcurrentChats: number;
  }) =>
    apiRequest('/support-employees', {
      method: 'POST',
      body: JSON.stringify(employeeData),
    }),

  login: (credentials: { employeeId: string; password: string }) =>
    apiRequest('/support-employees/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }, false),

  updateStatus: (id: string, status: string) =>
    apiRequest(`/support-employees/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  updateOnlineStatus: (id: string, onlineStatus: string) =>
    apiRequest(`/support-employees/${id}/online-status`, {
      method: 'PATCH',
      body: JSON.stringify({ onlineStatus }),
    }),

  delete: (id: string) =>
    apiRequest(`/support-employees/${id}`, { method: 'DELETE' }),
};

// ==================== SUPPORT TICKETS API ====================

export const supportTicketsAPI = {
  getAll: (params?: { status?: string; priority?: string; assignedTo?: string; category?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest(`/support-tickets${query ? `?${query}` : ''}`, { method: 'GET' });
  },

  getById: (id: string) =>
    apiRequest(`/support-tickets/${id}`, { method: 'GET' }),

  create: (ticketData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    subject: string;
    category: string;
    priority: string;
    message: string;
  }) =>
    apiRequest('/support-tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    }),

  assign: (id: string, employeeId: string) =>
    apiRequest(`/support-tickets/${id}/assign`, {
      method: 'POST',
      body: JSON.stringify({ employeeId }),
    }),

  addMessage: (id: string, messageData: { message: string; sender: string; senderName: string }) =>
    apiRequest(`/support-tickets/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    }),

  updateStatus: (id: string, status: string) =>
    apiRequest(`/support-tickets/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  delete: (id: string) =>
    apiRequest(`/support-tickets/${id}`, { method: 'DELETE' }),
};

// ==================== JOBS API ====================

export const jobsAPI = {
  getAll: (params?: { status?: string; type?: string; location?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest(`/jobs${query ? `?${query}` : ''}`, { method: 'GET' });
  },

  getById: (id: string) =>
    apiRequest(`/jobs/${id}`, { method: 'GET' }),

  create: (jobData: any) =>
    apiRequest('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updateStatus: (id: string, status: string) =>
    apiRequest(`/jobs/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  delete: (id: string) =>
    apiRequest(`/jobs/${id}`, { method: 'DELETE' }),
};

// ==================== SUBSCRIPTIONS API ====================

export const subscriptionsAPI = {
  getAll: (params?: any) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/subscriptions${query ? `?${query}` : ''}`, { method: 'GET' });
  },

  getById: (id: string) =>
    apiRequest(`/subscriptions/${id}`, { method: 'GET' }),

  create: (data: any) =>
    apiRequest('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/subscriptions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/subscriptions/${id}`, { method: 'DELETE' }),
};

// ==================== PHOTO UPLOADS API ====================

export const photoUploadsAPI = {
  getAll: (params?: any) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/photo-uploads${query ? `?${query}` : ''}`, { method: 'GET' });
  },

  upload: (formData: FormData) => {
    const token = getAuthToken();
    return fetch(`${API_BASE_URL}/photo-uploads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }
      return data;
    });
  },

  approve: (id: string) =>
    apiRequest(`/photo-uploads/${id}/approve`, {
      method: 'PATCH',
    }),

  reject: (id: string, reason: string) =>
    apiRequest(`/photo-uploads/${id}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    }),

  delete: (id: string) =>
    apiRequest(`/photo-uploads/${id}`, { method: 'DELETE' }),
};

// ==================== EMPLOYEE EARNINGS API ====================

export const employeeEarningsAPI = {
  getAll: (params?: any) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/employee-earnings${query ? `?${query}` : ''}`, { method: 'GET' });
  },

  getById: (id: string) =>
    apiRequest(`/employee-earnings/${id}`, { method: 'GET' }),

  create: (data: any) =>
    apiRequest('/employee-earnings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/employee-earnings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/employee-earnings/${id}`, { method: 'DELETE' }),

  getStats: (employeeId: string) =>
    apiRequest(`/employee-earnings/stats/${employeeId}`, { method: 'GET' }),
};

// ==================== INQUIRIES API ====================

export const inquiriesAPI = {
  getAll: (params?: any) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/inquiries${query ? `?${query}` : ''}`, { method: 'GET' });
  },

  create: (inquiryData: { propertyId: string; message: string }) =>
    apiRequest('/inquiries', {
      method: 'POST',
      body: JSON.stringify(inquiryData),
    }),

  delete: (id: string) =>
    apiRequest(`/inquiries/${id}`, { method: 'DELETE' }),
};

// ==================== FAVORITES API ====================

export const favoritesAPI = {
  getAll: () =>
    apiRequest('/favorites', { method: 'GET' }),

  add: (propertyId: string) =>
    apiRequest('/favorites', {
      method: 'POST',
      body: JSON.stringify({ propertyId }),
    }),

  remove: (propertyId: string) =>
    apiRequest(`/favorites/${propertyId}`, { method: 'DELETE' }),
};

// ==================== HEALTH CHECK ====================

export const healthCheck = () =>
  apiRequest('/health', { method: 'GET' }, false);

export default {
  auth: authAPI,
  users: usersAPI,
  properties: propertiesAPI,
  supportEmployees: supportEmployeesAPI,
  supportTickets: supportTicketsAPI,
  jobs: jobsAPI,
  subscriptions: subscriptionsAPI,
  photoUploads: photoUploadsAPI,
  employeeEarnings: employeeEarningsAPI,
  inquiries: inquiriesAPI,
  favorites: favoritesAPI,
  healthCheck,
};
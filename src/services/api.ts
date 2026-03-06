import apiClient, { tokenManager } from '../lib/api-client';

// ==============================================
// AUTHENTICATION SERVICE
// ==============================================
export const authService = {
  // Sign up with phone/password
  async signUp(fullName: string, phone: string, password: string, role: string, email?: string) {
    try {
      const response = await apiClient.post('/api/auth/signup', {
        fullName,
        phone,
        password,
        role,
        email,
      });

      if (response.success && response.data) {
        const { accessToken, user } = response.data as any;
        if (accessToken) {
          tokenManager.set(accessToken);
        }
        return { success: true, user };
      }

      return { success: false, error: response.error || 'Signup failed' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Signup failed' };
    }
  },

  // Sign in with phone/password
  async signIn(phone: string, password: string) {
    try {
      const response = await apiClient.post('/api/auth/login', {
        phone,
        password,
      });

      if (response.success && response.data) {
        const { accessToken, user } = response.data as any;
        if (accessToken) {
          tokenManager.set(accessToken);
        }
        return { success: true, user, profile: user };
      }

      return { success: false, error: response.error || 'Login failed' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed' };
    }
  },

  // Admin login
  async adminLogin(phone: string, password: string) {
    try {
      const response = await apiClient.post('/api/auth/admin-login', {
        phone,
        password,
      });

      if (response.success && response.data) {
        const { accessToken, user } = response.data as any;
        if (accessToken) {
          tokenManager.set(accessToken);
        }
        return { success: true, user };
      }

      return { success: false, error: response.error || 'Admin login failed' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Admin login failed' };
    }
  },

  // Sign in with Google
  async signInWithGoogle(credential: string, role?: string) {
    try {
      const response = await apiClient.post('/api/auth/google', {
        credential,
        role: role || 'tenant',
      });

      if (response.success && response.data) {
        const { accessToken, user } = response.data as any;
        if (accessToken) {
          tokenManager.set(accessToken);
        }
        return { success: true, user, data: response.data };
      }

      return { success: false, error: response.error || 'Google login failed' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Google login failed' };
    }
  },

  // Sign out
  async signOut() {
    try {
      tokenManager.remove();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Signout failed' };
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const response = await apiClient.get('/api/auth/me');

      if (response.success && response.data) {
        const { user } = response.data as any;
        return { success: true, user, profile: user };
      }

      return { success: false, user: null };
    } catch (error: any) {
      return { success: false, user: null, error: error.message };
    }
  },
};

// ==============================================
// PROPERTIES SERVICE
// ==============================================
export const propertiesService = {
  // Get all properties
  async getAll(filters?: {
    status?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    propertyType?: string;
    bedrooms?: number;
  }) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.location) queryParams.append('location', filters.location);
      if (filters?.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
      if (filters?.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
      if (filters?.propertyType) queryParams.append('propertyType', filters.propertyType);
      if (filters?.bedrooms) queryParams.append('bedrooms', filters.bedrooms.toString());

      const queryString = queryParams.toString();
      const endpoint = `/api/properties${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get(endpoint);

      if (response.success && response.data) {
        const { properties } = response.data as any;
        return { success: true, data: properties };
      }

      return { success: false, error: response.error || 'Failed to fetch properties' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to fetch properties' };
    }
  },

  // Get property by ID
  async getById(id: string) {
    try {
      const response = await apiClient.get(`/api/properties/${id}`);

      if (response.success && response.data) {
        const { property } = response.data as any;
        return { success: true, data: property };
      }

      return { success: false, error: response.error || 'Property not found' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Property not found' };
    }
  },

  // Create property
  async create(propertyData: any) {
    try {
      const response = await apiClient.post('/api/properties', propertyData);

      if (response.success && response.data) {
        const { property } = response.data as any;
        return { success: true, data: property };
      }

      return { success: false, error: response.error || 'Failed to create property' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to create property' };
    }
  },

  // Update property
  async update(id: string, propertyData: any) {
    try {
      const response = await apiClient.put(`/api/properties/${id}`, propertyData);

      if (response.success && response.data) {
        const { property } = response.data as any;
        return { success: true, data: property };
      }

      return { success: false, error: response.error || 'Failed to update property' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to update property' };
    }
  },

  // Delete property
  async delete(id: string) {
    try {
      const response = await apiClient.delete(`/api/properties/${id}`);

      if (response.success) {
        return { success: true };
      }

      return { success: false, error: response.error || 'Failed to delete property' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to delete property' };
    }
  },

  // Approve property
  async approve(id: string, adminId: string) {
    try {
      const response = await apiClient.patch(`/api/properties/${id}/approve`, { adminId });

      if (response.success && response.data) {
        const { property } = response.data as any;
        return { success: true, data: property };
      }

      return { success: false, error: response.error || 'Failed to approve property' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to approve property' };
    }
  },

  // Reject property
  async reject(id: string) {
    try {
      const response = await apiClient.patch(`/api/properties/${id}/reject`, {});

      if (response.success && response.data) {
        const { property } = response.data as any;
        return { success: true, data: property };
      }

      return { success: false, error: response.error || 'Failed to reject property' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to reject property' };
    }
  },
};

// ==============================================
// USERS SERVICE
// ==============================================
export const usersService = {
  // Get all users
  async getAll(filters?: { role?: string; status?: string }) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters?.role) queryParams.append('role', filters.role);
      if (filters?.status) queryParams.append('status', filters.status);

      const queryString = queryParams.toString();
      const endpoint = `/api/users${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get(endpoint);

      if (response.success && response.data) {
        const { users } = response.data as any;
        return { success: true, data: users };
      }

      return { success: false, error: response.error || 'Failed to fetch users' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to fetch users' };
    }
  },

  // Update user
  async update(id: string, userData: any) {
    try {
      const response = await apiClient.put(`/api/users/${id}`, userData);

      if (response.success && response.data) {
        const { user } = response.data as any;
        return { success: true, data: user };
      }

      return { success: false, error: response.error || 'Failed to update user' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to update user' };
    }
  },

  // Suspend user
  async suspend(id: string) {
    try {
      const response = await apiClient.patch(`/api/users/${id}/suspend`, {});

      if (response.success && response.data) {
        const { user } = response.data as any;
        return { success: true, data: user };
      }

      return { success: false, error: response.error || 'Failed to suspend user' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to suspend user' };
    }
  },

  // Activate user
  async activate(id: string) {
    try {
      const response = await apiClient.patch(`/api/users/${id}/activate`, {});

      if (response.success && response.data) {
        const { user } = response.data as any;
        return { success: true, data: user };
      }

      return { success: false, error: response.error || 'Failed to activate user' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to activate user' };
    }
  },

  // Delete user
  async delete(id: string) {
    try {
      const response = await apiClient.delete(`/api/users/${id}`);

      if (response.success) {
        return { success: true };
      }

      return { success: false, error: response.error || 'Failed to delete user' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to delete user' };
    }
  },
};

// ==============================================
// SUBSCRIPTIONS SERVICE
// ==============================================
export const subscriptionsService = {
  // Get all subscriptions
  async getAll() {
    try {
      const response = await apiClient.get('/api/subscriptions');

      if (response.success && response.data) {
        const { subscriptions } = response.data as any;
        return { success: true, data: subscriptions };
      }

      return { success: false, error: response.error || 'Failed to fetch subscriptions' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to fetch subscriptions' };
    }
  },

  // Get user subscriptions
  async getByUserId(userId: string) {
    try {
      const response = await apiClient.get(`/api/subscriptions/user/${userId}`);

      if (response.success && response.data) {
        const { subscriptions } = response.data as any;
        return { success: true, data: subscriptions };
      }

      return { success: false, error: response.error || 'Failed to fetch user subscriptions' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to fetch user subscriptions' };
    }
  },

  // Create subscription
  async create(subscriptionData: any) {
    try {
      const response = await apiClient.post('/api/subscriptions', subscriptionData);

      if (response.success && response.data) {
        const { subscription } = response.data as any;
        return { success: true, data: subscription };
      }

      return { success: false, error: response.error || 'Failed to create subscription' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to create subscription' };
    }
  },

  // Cancel subscription
  async cancel(id: string) {
    try {
      const response = await apiClient.patch(`/api/subscriptions/${id}/cancel`, {});

      if (response.success && response.data) {
        const { subscription } = response.data as any;
        return { success: true, data: subscription };
      }

      return { success: false, error: response.error || 'Failed to cancel subscription' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to cancel subscription' };
    }
  },
};

// ==============================================
// PHOTO UPLOADS SERVICE (Employee)
// ==============================================
export const photoUploadsService = {
  // Get all photo uploads
  async getAll(filters?: { status?: string; employeeId?: string }) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.employeeId) queryParams.append('employeeId', filters.employeeId);

      const queryString = queryParams.toString();
      const endpoint = `/api/photo-uploads${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get(endpoint);

      if (response.success && response.data) {
        const { photoUploads } = response.data as any;
        return { success: true, data: photoUploads };
      }

      return { success: false, error: response.error || 'Failed to fetch photo uploads' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to fetch photo uploads' };
    }
  },

  // Upload photo
  async upload(photoData: any) {
    try {
      const response = await apiClient.post('/api/photo-uploads', photoData);

      if (response.success && response.data) {
        const { photoUpload } = response.data as any;
        return { success: true, data: photoUpload };
      }

      return { success: false, error: response.error || 'Failed to upload photo' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to upload photo' };
    }
  },

  // Approve photo
  async approve(id: string, reviewerId: string) {
    try {
      const response = await apiClient.patch(`/api/photo-uploads/${id}/approve`, { reviewerId });

      if (response.success && response.data) {
        const { photoUpload } = response.data as any;
        return { success: true, data: photoUpload };
      }

      return { success: false, error: response.error || 'Failed to approve photo' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to approve photo' };
    }
  },

  // Reject photo
  async reject(id: string, reviewerId: string) {
    try {
      const response = await apiClient.patch(`/api/photo-uploads/${id}/reject`, { reviewerId });

      if (response.success && response.data) {
        const { photoUpload } = response.data as any;
        return { success: true, data: photoUpload };
      }

      return { success: false, error: response.error || 'Failed to reject photo' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to reject photo' };
    }
  },
};

// ==============================================
// EMPLOYEE EARNINGS SERVICE
// ==============================================
export const employeeEarningsService = {
  // Get all earnings
  async getAll() {
    try {
      const response = await apiClient.get('/api/employee-earnings');

      if (response.success && response.data) {
        const { earnings } = response.data as any;
        return { success: true, data: earnings };
      }

      return { success: false, error: response.error || 'Failed to fetch earnings' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to fetch earnings' };
    }
  },

  // Get employee earnings
  async getByEmployeeId(employeeId: string) {
    try {
      const response = await apiClient.get(`/api/employee-earnings/employee/${employeeId}`);

      if (response.success && response.data) {
        const { earnings } = response.data as any;
        return { success: true, data: earnings };
      }

      return { success: false, error: response.error || 'Failed to fetch employee earnings' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to fetch employee earnings' };
    }
  },

  // Mark as paid
  async markAsPaid(id: string) {
    try {
      const response = await apiClient.patch(`/api/employee-earnings/${id}/mark-paid`, {});

      if (response.success && response.data) {
        const { earning } = response.data as any;
        return { success: true, data: earning };
      }

      return { success: false, error: response.error || 'Failed to mark as paid' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to mark as paid' };
    }
  },
};

// ==============================================
// FAVORITES SERVICE
// ==============================================
export const favoritesService = {
  // Get all favorites for current user
  async getAll() {
    try {
      const response = await apiClient.get('/api/favorites');

      if (response.success && response.data) {
        const { favorites } = response.data as any;
        return { success: true, data: favorites };
      }

      return { success: false, error: response.error || 'Failed to fetch favorites' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to fetch favorites' };
    }
  },

  // Add property to favorites
  async add(propertyId: string) {
    try {
      const response = await apiClient.post('/api/favorites', { propertyId });

      if (response.success && response.data) {
        const { favorite } = response.data as any;
        return { success: true, data: favorite };
      }

      return { success: false, error: response.error || 'Failed to add to favorites' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to add to favorites' };
    }
  },

  // Remove property from favorites
  async remove(propertyId: string) {
    try {
      const response = await apiClient.delete(`/api/favorites/${propertyId}`);

      if (response.success) {
        return { success: true };
      }

      return { success: false, error: response.error || 'Failed to remove from favorites' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to remove from favorites' };
    }
  },

  // Check if property is favorited
  async check(propertyId: string) {
    try {
      const response = await apiClient.get(`/api/favorites/check/${propertyId}`);

      if (response.success && response.data) {
        const { isFavorited } = response.data as any;
        return { success: true, data: isFavorited };
      }

      return { success: false, error: response.error || 'Failed to check favorite status' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to check favorite status' };
    }
  },
};

// Export all services
export default {
  auth: authService,
  properties: propertiesService,
  users: usersService,
  subscriptions: subscriptionsService,
  photoUploads: photoUploadsService,
  employeeEarnings: employeeEarningsService,
  favorites: favoritesService,
};
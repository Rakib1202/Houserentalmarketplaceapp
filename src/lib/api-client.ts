// MongoDB Backend API Client
// Replaces Supabase client with HTTP calls to Express backend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Token management
export const tokenManager = {
  get: () => localStorage.getItem('access_token'),
  set: (token: string) => localStorage.setItem('access_token', token),
  remove: () => localStorage.removeItem('access_token'),
};

// API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const token = tokenManager.get();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: responseData.error || responseData.message || 'Request failed',
      };
    }

    return {
      success: true,
      data: responseData,
    };
  } catch (error: any) {
    console.error('API Request Error:', error);
    return {
      success: false,
      error: error.message || 'Network error occurred',
    };
  }
}

// GET request
export async function get<T>(endpoint: string): Promise<{ success: boolean; data?: T; error?: string }> {
  return apiRequest<T>(endpoint, { method: 'GET' });
}

// POST request
export async function post<T>(
  endpoint: string,
  body?: any
): Promise<{ success: boolean; data?: T; error?: string }> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// PUT request
export async function put<T>(
  endpoint: string,
  body?: any
): Promise<{ success: boolean; data?: T; error?: string }> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

// PATCH request
export async function patch<T>(
  endpoint: string,
  body?: any
): Promise<{ success: boolean; data?: T; error?: string }> {
  return apiRequest<T>(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

// DELETE request
export async function del<T>(endpoint: string): Promise<{ success: boolean; data?: T; error?: string }> {
  return apiRequest<T>(endpoint, { method: 'DELETE' });
}

// Export API client
export const apiClient = {
  get,
  post,
  put,
  patch,
  delete: del,
  tokenManager,
};

export default apiClient;

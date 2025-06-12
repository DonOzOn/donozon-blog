/**
 * HTTP Client Configuration
 * Centralized HTTP client with interceptors and error handling
 */

import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import type { ApiResponse, ApiError } from '@/types/api';

// Base configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const API_TIMEOUT = 10000; // 10 seconds

/**
 * Create axios instance with default configuration
 */
const httpClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor
 * Add auth token, request ID, and other common headers
 */
httpClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp
    config.headers['X-Request-Time'] = new Date().toISOString();

    // Add request ID for tracking
    config.headers['X-Request-ID'] = generateRequestId();

    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Request Error:', error);
    }
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Handle responses, errors, and token refresh
 */
httpClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`);
    }

    // Return the data directly if it's an API response
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config;

    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ API Error: ${error.response?.status} ${originalRequest?.url}`);
    }

    // Handle 401 Unauthorized - Token refresh
    if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
      (originalRequest as any)._retry = true;

      try {
        const newToken = await refreshAuthToken();
        if (newToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return httpClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        handleAuthError();
        return Promise.reject(refreshError);
      }
    }

    // Handle network errors
    if (!error.response) {
      const networkError: ApiError = {
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
      };
      return Promise.reject(networkError);
    }

    // Handle other HTTP errors
    const apiError: ApiError = {
      message: error.response.data?.message || 'An unexpected error occurred',
      code: error.response.data?.code || `HTTP_${error.response.status}`,
      details: error.response.data?.details,
    };

    return Promise.reject(apiError);
  }
);

/**
 * Helper Functions
 */

// Get auth token from storage
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem('auth_token');
  } catch {
    return null;
  }
}

// Set auth token in storage
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('auth_token', token);
  } catch (error) {
    console.error('Failed to save auth token:', error);
  }
}

// Remove auth token from storage
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('auth_token');
  } catch (error) {
    console.error('Failed to remove auth token:', error);
  }
}

// Refresh auth token
async function refreshAuthToken(): Promise<string | null> {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return null;

    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken,
    });

    const { accessToken } = response.data.data;
    setAuthToken(accessToken);
    return accessToken;
  } catch {
    return null;
  }
}

// Handle authentication errors
function handleAuthError(): void {
  removeAuthToken();
  if (typeof window !== 'undefined') {
    // Redirect to login page or show login modal
    window.location.href = '/auth/login';
  }
}

// Generate unique request ID
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * HTTP Client Methods
 */
export const httpGet = async <T = any>(url: string, config = {}) => {
  const response = await httpClient.get<ApiResponse<T>>(url, config);
  return response.data;
};

export const httpPost = async <T = any>(url: string, data?: any, config = {}) => {
  const response = await httpClient.post<ApiResponse<T>>(url, data, config);
  return response.data;
};

export const httpPut = async <T = any>(url: string, data?: any, config = {}) => {
  const response = await httpClient.put<ApiResponse<T>>(url, data, config);
  return response.data;
};

export const httpPatch = async <T = any>(url: string, data?: any, config = {}) => {
  const response = await httpClient.patch<ApiResponse<T>>(url, data, config);
  return response.data;
};

export const httpDelete = async <T = any>(url: string, config = {}) => {
  const response = await httpClient.delete<ApiResponse<T>>(url, config);
  return response.data;
};

// Export the main client
export default httpClient;
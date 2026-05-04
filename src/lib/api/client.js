import axios from 'axios';
import { toast } from 'sonner';
import { getStoredCurrency } from '@/contexts/CurrencyContext';
import { API_BASE_URL } from '@/lib/api/config';

/** Only non-admin users get x-currency; admin requests must not send it. */
const isCurrentUserAdmin = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;
    const user = JSON.parse(userStr);
    return user?.is_admin === '1' || user?.is_admin === 1 || user?.is_admin === true;
  } catch {
    return false;
  }
};

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Add x-currency for all non-admin requests
    if (!isCurrentUserAdmin()) {
      const code = getStoredCurrency();
      if (code) config.headers['x-currency'] = code;
    }

    // Non-admins: never send company_id on GET (backend scopes by authenticated user)
    const method = (config.method || 'get').toLowerCase();
    if (method === 'get' && !isCurrentUserAdmin() && config.params != null && typeof config.params === 'object' && !Array.isArray(config.params)) {
      const rest = { ...config.params };
      delete rest.company_id;
      config.params = rest;
    }

    return config;
  },
  (error) => {
    toast.error('Request failed. Please try again.');
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    const data = response.data;
    const requestMethod = response.config?.method?.toLowerCase();
    
    // Check API response status
    if (data.status === false) {
      // API returned an error response - always show error messages
      toast.error(data.message || 'An error occurred');
      return Promise.reject(new Error(data.message || 'An error occurred'));
    }
    
    // Success response - only show success toast for non-GET requests
    if (data.message && requestMethod !== 'get') {
      toast.success(data.message);
    }
    
    return data;
  },
  (error) => {
    // Handle HTTP errors
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      toast.error('Session expired. Please login again.');
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    // Extract error message from API response or use default
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    toast.error(errorMessage);
    
    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;
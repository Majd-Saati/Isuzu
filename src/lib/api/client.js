import axios from 'axios';
import { toast } from 'sonner';

// API Base URL - Change this to update all API calls
const API_BASE_URL = 'https://marketing.5v.ae/api/';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || API_BASE_URL,
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
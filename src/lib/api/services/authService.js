import apiClient from '../client';

export const authService = {
  login: async (credentials) => {
    return apiClient.post('/login', credentials);
  },

  logout: async () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return Promise.resolve();
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
};

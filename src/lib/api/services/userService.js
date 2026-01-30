import apiClient from '../client';

export const userService = {
  getUsers: async (params) => {
    return apiClient.get('/users', { params });
  },

  getUserById: async (id) => {
    return apiClient.get(`/users/${id}`);
  },

  createUser: async (data) => {
    return apiClient.post('/users', data);
  },

  updateUser: async (id, data) => {
    return apiClient.put(`/users/${id}`, data);
  },

  deleteUser: async (id) => {
    return apiClient.delete(`/users/${id}`);
  },
};

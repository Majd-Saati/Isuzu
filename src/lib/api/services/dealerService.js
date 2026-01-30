import apiClient from '../client';

export const dealerService = {
  getDealers: async (params) => {
    return apiClient.get('/dealers', { params });
  },

  getDealerById: async (id) => {
    return apiClient.get(`/dealers/${id}`);
  },

  updateDealer: async (id, data) => {
    return apiClient.put(`/dealers/${id}`, data);
  },

  getDealerStats: async (id) => {
    return apiClient.get(`/dealers/${id}/stats`);
  },
};

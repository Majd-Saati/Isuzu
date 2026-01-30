import apiClient from '../client';

export const overviewService = {
  getOverview: async () => {
    return apiClient.get('/overview');
  },
};

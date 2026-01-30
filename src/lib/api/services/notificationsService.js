import apiClient from '../client';

export const notificationsService = {
  getNotifications: async (params = {}) => {
    const { page = 1, status = 'unread', per_page = 20 } = params;
    const response = await apiClient.get('/get_notifications', {
      params: { page, status, per_page }
    });
    return response.body;
  },

  markAsRead: async (notificationId) => {
    const response = await apiClient.post('/mark_as_read', {
      notification_id: notificationId
    });
    return response;
  },

  markMultipleAsRead: async (notificationIds) => {
    const response = await apiClient.post('/mark_as_read', {
      notification_ids: notificationIds
    });
    return response;
  }
};

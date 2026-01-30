import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '../../lib/api/services/notificationsService';

export const useNotifications = (status = 'unread', page = 1, perPage = 20) => {
  return useQuery({
    queryKey: ['notifications', status, page, perPage],
    queryFn: () => notificationsService.getNotifications({ page, status, per_page: perPage }),
    staleTime: 30000,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notificationId) => notificationsService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkMultipleAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notificationIds) => notificationsService.markMultipleAsRead(notificationIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '@/lib/api/services/usersService';

export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersService.getUsers(params),
    select: (data) => ({
      users: data?.body?.users || [],
      pagination: data?.body?.pagination || {
        page: 1,
        per_page: 20,
        total: 0,
        total_pages: 1,
      },
    }),
  });
};

export const useUser = (id) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => usersService.getUser(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

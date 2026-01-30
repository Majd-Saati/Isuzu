import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dealerService } from '@/lib/api/services/dealerService';

export const useDealers = (params) => {
  return useQuery({
    queryKey: ['dealers', params],
    queryFn: () => dealerService.getDealers(params),
  });
};

export const useDealer = (id) => {
  return useQuery({
    queryKey: ['dealers', id],
    queryFn: () => dealerService.getDealerById(id),
    enabled: !!id,
  });
};

export const useDealerStats = (id) => {
  return useQuery({
    queryKey: ['dealers', id, 'stats'],
    queryFn: () => dealerService.getDealerStats(id),
    enabled: !!id,
  });
};

export const useUpdateDealer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => dealerService.updateDealer(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dealers'] });
      queryClient.invalidateQueries({ queryKey: ['dealers', variables.id] });
    },
  });
};

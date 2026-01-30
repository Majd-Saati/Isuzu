import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { countriesService } from '@/lib/api/services/countriesService';

export const useCountries = (params = {}) => {
  return useQuery({
    queryKey: ['countries', params],
    queryFn: () => countriesService.getCountries(params),
    select: (data) => ({
      countries: data?.body?.countries || [],
      pagination: data?.body?.pagination || {
        page: 1,
        per_page: 20,
        total: 0,
        total_pages: 1,
      },
    }),
  });
};

export const useCountry = (id) => {
  return useQuery({
    queryKey: ['country', id],
    queryFn: () => countriesService.getCountry(id),
    enabled: !!id,
  });
};

export const useCreateCountry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: countriesService.createCountry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
    },
  });
};

export const useUpdateCountry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: countriesService.updateCountry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
    },
  });
};

export const useDeleteCountry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: countriesService.deleteCountry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
    },
  });
};

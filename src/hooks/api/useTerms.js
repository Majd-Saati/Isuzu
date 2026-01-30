import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { termsService } from '@/lib/api/services/termsService';

export const useTerms = (params = {}, options = {}) => {
  const {
    enabled = true,
    staleTime,
    refetchOnWindowFocus,
    refetchOnMount,
    refetchOnReconnect,
  } = options;

  return useQuery({
    queryKey: ['terms', params],
    queryFn: () => termsService.getTerms(params),
    select: (data) => ({
      terms: data?.body?.terms || [],
      pagination: data?.body?.pagination || {
        page: 1,
        per_page: 20,
        total: 0,
        total_pages: 1,
      },
    }),
    enabled,
    staleTime,
    refetchOnWindowFocus,
    refetchOnMount,
    refetchOnReconnect,
  });
};

export const useTerm = (id) => {
  return useQuery({
    queryKey: ['term', id],
    queryFn: () => termsService.getTerm(id),
    enabled: !!id,
  });
};

export const useCreateTerm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: termsService.createTerm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terms'] });
    },
  });
};

export const useUpdateTerm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: termsService.updateTerm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terms'] });
    },
  });
};

export const useDeleteTerm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: termsService.deleteTerm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terms'] });
    },
  });
};


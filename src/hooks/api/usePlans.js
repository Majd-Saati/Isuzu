import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { plansService } from '@/lib/api/services/plansService';

export const usePlans = (params = {}) => {
  return useQuery({
    queryKey: ['plans', params.page, params.perPage, params.companyId, params.termId, params.search],
    queryFn: () => plansService.getPlans(params),
    select: (data) => ({
      plans: data?.body?.plans || [],
      pagination: data?.body?.pagination || {
        page: 1,
        per_page: 20,
        total: 0,
        total_pages: 1,
      },
    }),
  });
};

export const usePlan = (id) => {
  return useQuery({
    queryKey: ['plan', id],
    queryFn: () => plansService.getPlan(id),
    enabled: !!id,
  });
};

export const useCreatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: plansService.createPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: plansService.updatePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });
};

export const useDeletePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: plansService.deletePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });
};


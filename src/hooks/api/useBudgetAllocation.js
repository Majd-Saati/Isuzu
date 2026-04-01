import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetAllocationService } from '@/lib/api/services/budgetAllocationService';

/**
 * @param {{ page?: number, per_page?: number, term_id?: string|number, company_id?: string|number }} params
 * @param {{ enabled?: boolean }} options
 */
export const useBudgetAllocationList = (params = {}, options = {}) => {
  const { enabled = true } = options;
  return useQuery({
    queryKey: ['budgetAllocationList', params],
    queryFn: () => budgetAllocationService.getBudgetAllocationList(params),
    select: (data) => ({
      terms: data?.body?.terms ?? [],
    }),
    enabled,
  });
};

/**
 * Set budget allocation. On success invalidates budget allocation list so the table refetches.
 */
export const useSetBudgetAllocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => budgetAllocationService.setBudgetAllocation(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgetAllocationList'] });
    },
  });
};

/**
 * Update budget allocation (`id`, `value`). On success invalidates the allocation list.
 */
export const useUpdateBudgetAllocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => budgetAllocationService.updateBudgetAllocation(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgetAllocationList'] });
    },
  });
};

/**
 * Delete budget allocation. On success invalidates list so the table refetches.
 */
export const useDeleteBudgetAllocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => budgetAllocationService.deleteBudgetAllocation(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgetAllocationList'] });
    },
  });
};

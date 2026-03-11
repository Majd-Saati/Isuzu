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

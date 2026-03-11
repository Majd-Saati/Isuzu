import { useQuery } from '@tanstack/react-query';
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

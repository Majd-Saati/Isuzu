import { useQuery } from '@tanstack/react-query';
import { chartsService } from '@/lib/api/services/chartsService';

/**
 * @param {{ company_id?: string, month?: string, term_id?: string|number }} params
 * @param {{ enabled?: boolean }} options
 */
export const useCharts = (params = {}, options = {}) => {
  const { enabled = true } = options;
  return useQuery({
    queryKey: ['charts', params],
    queryFn: () => chartsService.getCharts(params),
    select: (data) => data?.body ?? null,
    enabled: enabled && (params.month != null || params.term_id != null),
  });
};

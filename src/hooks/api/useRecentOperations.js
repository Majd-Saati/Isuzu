import { useQuery } from '@tanstack/react-query';
import { overviewService } from '@/lib/api/services/overviewService';

export const useRecentOperations = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['recent_operations', params],
    queryFn: () => overviewService.getRecentOperations(params),
    select: (data) => ({
      recentOperations: data?.body?.recent_operations || [],
      pagination: data?.body?.pagination || {
        page: 1,
        per_page: 20,
        total: 0,
        total_pages: 1,
      },
      filters: data?.body?.filters || {},
      displayCurrency: data?.body?.display_currency || '',
    }),
    ...options,
  });
};

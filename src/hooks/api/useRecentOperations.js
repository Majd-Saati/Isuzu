import { useQuery } from '@tanstack/react-query';
import { overviewService } from '@/lib/api/services/overviewService';

export const useRecentOperations = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['recent_operations', params],
    queryFn: ({ queryKey }) => {
      const [, requestParams] = queryKey;
      return overviewService.getRecentOperations(requestParams);
    },
    select: (data) => {
      if (!data?.body) {
        return {
          recentOperations: [],
          pagination: null,
          filters: {},
          displayCurrency: '',
        };
      }
      const body = data.body;
      return {
        recentOperations: body.recent_operations ?? [],
        pagination: body.pagination ?? null,
        filters: body.filters ?? {},
        displayCurrency: body.display_currency ?? '',
      };
    },
    ...options,
  });
};

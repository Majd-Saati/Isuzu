import { useQuery } from '@tanstack/react-query';
import { overviewService } from '@/lib/api/services/overviewService';

export const useOverview = () => {
  return useQuery({
    queryKey: ['overview'],
    queryFn: overviewService.getOverview,
    select: (data) => ({
      recentOperations: data?.body?.recent_operations || [],
      dealersSummary: data?.body?.dealers_summary || [],
    }),
  });
};

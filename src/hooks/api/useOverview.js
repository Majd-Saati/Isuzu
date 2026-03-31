import { useQuery } from '@tanstack/react-query';
import { overviewService } from '@/lib/api/services/overviewService';

export const useOverview = () => {
  return useQuery({
    queryKey: ['overview'],
    queryFn: overviewService.getOverview,
    select: (data) => ({
      dealersSummary: data?.body?.dealers_summary || [],
    }),
  });
};

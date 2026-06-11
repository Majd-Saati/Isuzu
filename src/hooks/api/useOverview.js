import { useQuery } from '@tanstack/react-query';
import { overviewService } from '@/lib/api/services/overviewService';

const overviewQueryKey = (params = {}) => {
  const term_id =
    params.term_id != null && params.term_id !== '' ? String(params.term_id) : '';
  const year = params.year != null && params.year !== '' ? String(params.year) : '';
  return ['overview', term_id, year];
};

export const useOverview = (params = {}) => {
  return useQuery({
    queryKey: overviewQueryKey(params),
    queryFn: () => overviewService.getOverview(params),
    select: (data) => ({
      dealersSummary: data?.body?.dealers_summary || [],
      yearTerms: data?.body?.year_terms || [],
      term: data?.body?.term ?? null,
      year: data?.body?.year ?? null,
    }),
  });
};

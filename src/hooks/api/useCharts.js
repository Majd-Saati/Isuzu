import { useQuery } from '@tanstack/react-query';
import { chartsService, reportService } from '@/lib/api/services/chartsService';

/**
 * @param {{ company_id?: string, month?: string, term_id?: string|number, year?: string|number }} params
 * @param {{ enabled?: boolean }} options
 */
export const useCharts = (params = {}, options = {}) => {
  const { enabled = true } = options;
  return useQuery({
    queryKey: ['charts', params],
    queryFn: () => chartsService.getCharts(params),
    select: (data) => data?.body ?? null,
    enabled: enabled && (params.month != null || params.term_id != null || params.year != null),
  });
};

/**
 * Hook to fetch report data by term
 * @param {{ term_id: string|number }} params
 * @param {{ enabled?: boolean }} options
 */
export const useReport = (params = {}, options = {}) => {
  const { enabled = true } = options;
  return useQuery({
    queryKey: ['report', params.term_id],
    queryFn: () => reportService.getReport(params),
    select: (data) => data?.body ?? null,
    enabled: enabled && params.term_id != null && params.term_id !== '',
  });
};

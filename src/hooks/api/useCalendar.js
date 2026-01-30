import { useQuery } from '@tanstack/react-query';
import { calendarService } from '@/lib/api/services/calendarService';

export const useCalendarView = (params = {}, options = {}) => {
  const {
    enabled = true,
    staleTime,
    refetchOnWindowFocus,
    refetchOnMount,
    refetchOnReconnect,
  } = options;

  const { term_id, company_id } = params;

  return useQuery({
    queryKey: ['calendarView', params],
    queryFn: () => calendarService.getCalendarView(params),
    select: (data) => data?.body || null,
    enabled: Boolean(enabled && term_id && company_id), // Only fetch if both IDs are provided
    staleTime,
    refetchOnWindowFocus: refetchOnWindowFocus !== undefined ? refetchOnWindowFocus : true,
    refetchOnMount: refetchOnMount !== undefined ? refetchOnMount : true,
    refetchOnReconnect: refetchOnReconnect !== undefined ? refetchOnReconnect : true,
  });
};


import { useQuery } from '@tanstack/react-query';
import { calendarService } from '@/lib/api/services/calendarService';

const calendarViewQueryKey = (params = {}) => {
  const term_id = params.term_id != null && params.term_id !== '' ? String(params.term_id) : '';
  const company_id =
    params.company_id != null && params.company_id !== '' && params.company_id !== 'all'
      ? String(params.company_id)
      : '';
  return ['calendarView', term_id, company_id];
};

export const useCalendarView = (params = {}, options = {}) => {
  const {
    enabled = true,
    staleTime,
    refetchOnWindowFocus,
    refetchOnMount,
    refetchOnReconnect,
  } = options;

  const { term_id } = params;

  return useQuery({
    queryKey: calendarViewQueryKey(params),
    queryFn: () => calendarService.getCalendarView(params),
    select: (data) => data?.body || null,
    enabled: Boolean(enabled && term_id), // Only term_id is required, company_id is optional (for "all companies")
    staleTime,
    refetchOnWindowFocus: refetchOnWindowFocus !== undefined ? refetchOnWindowFocus : true,
    refetchOnMount: refetchOnMount !== undefined ? refetchOnMount : true,
    refetchOnReconnect: refetchOnReconnect !== undefined ? refetchOnReconnect : true,
  });
};


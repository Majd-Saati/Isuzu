import { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useCalendarView } from '@/hooks/api/useCalendar';
import { useTerms } from '@/hooks/api/useTerms';
import { useCompanies } from '@/hooks/api/useCompanies';
import { computeSummaryStats } from '@/components/calendar/utils/calendarUtils';

export const useCalendarPage = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const isAdmin = Boolean(currentUser?.is_admin === '1' || currentUser?.is_admin === 1);

  const [selectedTermId, setSelectedTermId] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState('');

  const { data: termsData } = useTerms({ page: 1, perPage: 100 });
  const { data: companiesData } = useCompanies({ page: 1, perPage: 100 }, { enabled: isAdmin });
  const terms = termsData?.terms || [];
  const companies = companiesData?.companies || [];

  useEffect(() => {
    if (!isAdmin && currentUser?.company_id) {
      setSelectedCompanyId(String(currentUser.company_id));
    }
  }, [isAdmin, currentUser]);

  const calendarParams = useMemo(() => {
    const params = { term_id: selectedTermId };
    if (selectedCompanyId && selectedCompanyId !== 'all') {
      params.company_id = selectedCompanyId;
    }
    return params;
  }, [selectedTermId, selectedCompanyId]);

  const isQueryEnabled = useMemo(() => {
    if (!selectedTermId) return false;
    if (isAdmin) return selectedCompanyId === 'all' || !!selectedCompanyId;
    return true;
  }, [selectedTermId, selectedCompanyId, isAdmin]);

  const { data: calendarData, isLoading, isError, error } = useCalendarView(
    calendarParams,
    { enabled: isQueryEnabled }
  );

  const summaryStats = useMemo(() => computeSummaryStats(calendarData), [calendarData]);

  return {
    isAdmin,
    selectedTermId,
    setSelectedTermId,
    selectedCompanyId,
    setSelectedCompanyId,
    terms,
    companies,
    isQueryEnabled,
    calendarData,
    isLoading,
    isError,
    error,
    summaryStats,
  };
};

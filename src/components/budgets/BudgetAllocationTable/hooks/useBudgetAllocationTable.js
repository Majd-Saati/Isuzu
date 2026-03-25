import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useBudgetAllocationList } from '@/hooks/api/useBudgetAllocation';
import { useTerms } from '@/hooks/api/useTerms';
import { useCompanies } from '@/hooks/api/useCompanies';
import { isAdminUser } from '@/lib/permissions';

const PER_PAGE = 20;

/** Newest-first sort key: prefer start_date, then end_date. */
const termDateDescKey = (t) => {
  if (!t) return 0;
  const start = t.start_date ? new Date(t.start_date).getTime() : NaN;
  if (Number.isFinite(start)) return start;
  const end = t.end_date ? new Date(t.end_date).getTime() : NaN;
  if (Number.isFinite(end)) return end;
  return 0;
};

export const useBudgetAllocationTable = () => {
  const user = useSelector((state) => state.auth.user);
  const isAdmin = isAdminUser(user);

  const [companyId, setCompanyId] = useState('');

  const { data: termsData } = useTerms({ perPage: 100 });
  const termsFromList = termsData?.terms ?? [];

  const { data: companiesData } = useCompanies({ perPage: 100 }, { enabled: isAdmin });
  const companies = isAdmin ? (companiesData?.companies ?? []) : [];

  const params = {
    page: 1,
    per_page: PER_PAGE,
    ...(companyId && isAdmin ? { company_id: companyId } : {}),
  };

  const { data, isLoading, isError, error } = useBudgetAllocationList(params);
  const terms = useMemo(() => {
    const list = data?.terms ?? [];
    return [...list].sort((a, b) => termDateDescKey(b) - termDateDescKey(a));
  }, [data?.terms]);
  const hasTerms = terms.length > 0;
  const hasAnyAllocations = terms.some((t) => (t.allocations ?? []).length > 0);

  return {
    companyId,
    setCompanyId,
    termsFromList,
    companies,
    isAdmin,
    terms,
    isLoading,
    isError,
    error,
    hasTerms,
    hasAnyAllocations,
  };
};

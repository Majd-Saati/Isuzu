import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useBudgetAllocationList } from '@/hooks/api/useBudgetAllocation';
import { useTerms } from '@/hooks/api/useTerms';
import { useCompanies } from '@/hooks/api/useCompanies';
import { isAdminUser } from '@/lib/permissions';

const PER_PAGE = 20;

export const useBudgetAllocationTable = () => {
  const user = useSelector((state) => state.auth.user);
  const isAdmin = isAdminUser(user);

  const [termId, setTermId] = useState('');
  const [companyId, setCompanyId] = useState('');

  const { data: termsData } = useTerms({ perPage: 100 });
  const termsFromList = termsData?.terms ?? [];

  const { data: companiesData } = useCompanies({ perPage: 100 }, { enabled: isAdmin });
  const companies = isAdmin ? (companiesData?.companies ?? []) : [];

  const params = {
    page: 1,
    per_page: PER_PAGE,
    ...(termId ? { term_id: termId } : {}),
    ...(companyId && isAdmin ? { company_id: companyId } : {}),
  };

  const { data, isLoading, isError, error } = useBudgetAllocationList(params);
  const terms = data?.terms ?? [];
  const hasTerms = terms.length > 0;
  const hasAnyAllocations = terms.some((t) => (t.allocations ?? []).length > 0);

  return {
    termId,
    setTermId,
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

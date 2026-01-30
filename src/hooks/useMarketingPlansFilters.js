import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCompanies } from '@/hooks/api/useCompanies';
import { useTerms } from '@/hooks/api/useTerms';

const FILTER_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
};

/**
 * Custom hook to manage marketing plans filters and URL synchronization
 */
export const useMarketingPlansFilters = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get user from Redux store to check admin status
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  // Check if user is admin - handle both string and number formats
  const isAdmin = Boolean(user?.is_admin === '1' || user?.is_admin === 1);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  
  // Filter state
  const [companyFilterId, setCompanyFilterId] = useState(null);
  const [termFilterId, setTermFilterId] = useState(null);
  const [companyFilterName, setCompanyFilterName] = useState('');
  const [termFilterName, setTermFilterName] = useState('');

  // Fetch filter options - only fetch companies if user is admin
  // Explicitly check both conditions and convert to boolean
  const shouldFetchCompanies = Boolean(isAuthenticated && isAdmin);
  
  const { data: companiesData, isLoading: isLoadingCompanies, isFetching: isFetchingCompanies } = useCompanies(
    { page: 1, perPage: 200 },
    {
      ...FILTER_QUERY_OPTIONS,
      enabled: shouldFetchCompanies, // Only fetch if user is authenticated and admin
    }
  );
  
  
  const companies = isAdmin ? (companiesData?.companies || []) : [];

  const { data: termsData, isLoading: isLoadingTerms } = useTerms(
    { page: 1, perPage: 200 },
    FILTER_QUERY_OPTIONS
  );
  const terms = termsData?.terms || [];

  // Sync all URL params on location change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // Company filter
    const companyIdParam = params.get('company_id');
    if (companyIdParam) {
      const parsedId = Number(companyIdParam);
      if (!Number.isNaN(parsedId)) {
        setCompanyFilterId(parsedId);
      }
    } else {
      setCompanyFilterId(null);
      setCompanyFilterName('');
    }
    
    // Term filter
    const termIdParam = params.get('term_id');
    if (termIdParam) {
      const parsedId = Number(termIdParam);
      if (!Number.isNaN(parsedId)) {
        setTermFilterId(parsedId);
      }
    } else {
      setTermFilterId(null);
      setTermFilterName('');
    }
    
    // Pagination
    const pageParam = Number(params.get('page'));
    const perPageParam = Number(params.get('per_page'));
    setPage(!Number.isNaN(pageParam) && pageParam > 0 ? pageParam : 1);
    setPerPage(!Number.isNaN(perPageParam) && perPageParam > 0 ? perPageParam : 20);
  }, [location.search]);

  // Update company name when companies load or companyFilterId changes
  useEffect(() => {
    if (companyFilterId && companies.length > 0) {
      const foundCompany = companies.find((c) => Number(c.id) === Number(companyFilterId));
      setCompanyFilterName(foundCompany?.name || '');
    } else if (!companyFilterId) {
      setCompanyFilterName('');
    }
  }, [companyFilterId, companies]);

  // Update term name when terms load or termFilterId changes
  useEffect(() => {
    if (termFilterId && terms.length > 0) {
      const foundTerm = terms.find((t) => Number(t.id) === Number(termFilterId));
      setTermFilterName(foundTerm?.name || '');
    } else if (!termFilterId) {
      setTermFilterName('');
    }
  }, [termFilterId, terms]);

  // Filter handlers
  const handleCompanyFilterChange = useCallback((id, name) => {
    setCompanyFilterId(id);
    setCompanyFilterName(name);
    setPage(1);
  }, []);

  const handleTermFilterChange = useCallback((id, name) => {
    setTermFilterId(id);
    setTermFilterName(name);
    setPage(1);
  }, []);

  const clearCompanyFilter = useCallback(() => {
    handleCompanyFilterChange(null, '');
  }, [handleCompanyFilterChange]);

  const clearTermFilter = useCallback(() => {
    handleTermFilterChange(null, '');
  }, [handleTermFilterChange]);

  // Memoized filter data for dropdowns
  const companyFilter = useMemo(() => ({
    id: companyFilterId,
    name: companyFilterName,
    options: companies,
    isLoading: isLoadingCompanies,
    onChange: handleCompanyFilterChange,
    onClear: clearCompanyFilter,
  }), [companyFilterId, companyFilterName, companies, isLoadingCompanies, handleCompanyFilterChange, clearCompanyFilter]);

  const termFilter = useMemo(() => ({
    id: termFilterId,
    name: termFilterName,
    options: terms,
    isLoading: isLoadingTerms,
    onChange: handleTermFilterChange,
    onClear: clearTermFilter,
  }), [termFilterId, termFilterName, terms, isLoadingTerms, handleTermFilterChange, clearTermFilter]);

  return {
    // Pagination
    page,
    setPage,
    perPage,
    setPerPage,
    // Filters
    companyFilter,
    termFilter,
    companyFilterId,
    termFilterId,
    companyFilterName,
    // Raw data for other components
    companies,
    terms,
    // Admin status
    isAdmin,
  };
};


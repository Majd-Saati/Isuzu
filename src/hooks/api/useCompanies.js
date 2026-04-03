import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companiesService } from '@/lib/api/services/companiesService';

/** Same pattern as useTerms: one cache entry for equivalent list params. */
const normalizeCompaniesListParams = (params = {}) => {
  const page = params.page != null && params.page !== '' ? Number(params.page) : 1;
  const perPage = params.perPage != null && params.perPage !== '' ? Number(params.perPage) : 20;
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safePerPage = Number.isFinite(perPage) && perPage > 0 ? perPage : 20;
  const rawSearch = params.search;
  const search =
    typeof rawSearch === 'string' && rawSearch.trim() !== '' ? rawSearch.trim() : undefined;
  return { page: safePage, perPage: safePerPage, search };
};

const companiesListQueryKey = (page, perPage, search) => ['companies', 'list', page, perPage, search ?? ''];

// Color palette for dealers in sidebar
const DEALER_COLORS = [
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#6366F1', // Indigo
];

// Get cached dealers from localStorage
const getCachedDealers = () => {
  try {
    const cached = localStorage.getItem('cachedDealers');
    return cached ? JSON.parse(cached) : [];
  } catch {
    return [];
  }
};

// Save dealers to localStorage
const cacheDealers = (dealers) => {
  try {
    localStorage.setItem('cachedDealers', JSON.stringify(dealers));
  } catch {
    // Ignore storage errors
  }
};

// Transform companies to dealers format for sidebar
const transformToDealers = (companies) => {
  return companies.map((company, index) => ({
    id: company.id,
    label: company.name,
    color: DEALER_COLORS[index % DEALER_COLORS.length],
    logo: company.logo,
  }));
};

// Hook for sidebar dealers - uses aggressive caching
export const useDealers = (options = {}) => {
  const { enabled = true } = options;
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['dealers'],
    queryFn: async () => {
      const p = normalizeCompaniesListParams({ page: 1, perPage: 100 });
      const response = await companiesService.getCompanies(p);
      const companies = response?.body?.companies || [];
      const dealers = transformToDealers(companies);
      cacheDealers(dealers);
      queryClient.setQueryData(companiesListQueryKey(p.page, p.perPage, p.search), response);
      return dealers;
    },
    staleTime: Infinity, // Never consider data stale
    gcTime: Infinity, // Never garbage collect
    refetchOnMount: false, // Don't refetch on component mount
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: false, // Don't refetch on reconnect
    initialData: () => {
      const cached = getCachedDealers();
      return cached.length > 0 ? cached : undefined;
    },
    initialDataUpdatedAt: () => {
      // If we have cached data, treat it as "just fetched"
      const cached = getCachedDealers();
      return cached.length > 0 ? Date.now() : 0;
    },
    enabled: Boolean(enabled),
  });
};

// Prefetch dealers - call this on app load; also warms companies list cache (same API response).
export const prefetchDealers = (queryClient) => {
  return queryClient.prefetchQuery({
    queryKey: ['dealers'],
    queryFn: async () => {
      const p = normalizeCompaniesListParams({ page: 1, perPage: 100 });
      const response = await companiesService.getCompanies(p);
      const companies = response?.body?.companies || [];
      const dealers = transformToDealers(companies);
      cacheDealers(dealers);
      queryClient.setQueryData(companiesListQueryKey(p.page, p.perPage, p.search), response);
      return dealers;
    },
    staleTime: Infinity,
  });
};

export const useCompanies = (params = {}, options = {}) => {
  const { page, perPage, search } = normalizeCompaniesListParams(params);
  const {
    enabled = true,
    staleTime,
    refetchOnWindowFocus,
    refetchOnMount,
    refetchOnReconnect,
  } = options;

  const isStandardFullList = page === 1 && perPage === 100 && search === undefined;

  return useQuery({
    queryKey: companiesListQueryKey(page, perPage, search),
    queryFn: () => companiesService.getCompanies({ page, perPage, search }),
    select: (data) => ({
      companies: data?.body?.companies || [],
      pagination: data?.body?.pagination || {
        page: 1,
        per_page: 20,
        total: 0,
        total_pages: 1,
      },
    }),
    enabled: Boolean(enabled),
    ...(isStandardFullList
      ? { refetchOnMount: false, refetchOnWindowFocus: false, refetchOnReconnect: false }
      : {}),
    ...(staleTime !== undefined ? { staleTime } : {}),
    ...(refetchOnWindowFocus !== undefined ? { refetchOnWindowFocus } : {}),
    ...(refetchOnMount !== undefined ? { refetchOnMount } : {}),
    ...(refetchOnReconnect !== undefined ? { refetchOnReconnect } : {}),
  });
};

export const useCompany = (id) => {
  return useQuery({
    queryKey: ['company', id],
    queryFn: () => companiesService.getCompany(id),
    enabled: !!id,
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: companiesService.createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      // Refetch dealers for sidebar
      queryClient.invalidateQueries({ queryKey: ['dealers'] });
    },
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: companiesService.updateCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      // Refetch dealers for sidebar
      queryClient.invalidateQueries({ queryKey: ['dealers'] });
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: companiesService.deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      // Refetch dealers for sidebar
      queryClient.invalidateQueries({ queryKey: ['dealers'] });
    },
  });
};


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companiesService } from '@/lib/api/services/companiesService';

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
export const useDealers = () => {
  return useQuery({
    queryKey: ['dealers'],
    queryFn: async () => {
      const response = await companiesService.getCompanies({ page: 1, perPage: 100 });
      const companies = response?.body?.companies || [];
      const dealers = transformToDealers(companies);
      // Cache for next time
      cacheDealers(dealers);
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
  });
};

// Prefetch dealers - call this on app load
export const prefetchDealers = (queryClient) => {
  return queryClient.prefetchQuery({
    queryKey: ['dealers'],
    queryFn: async () => {
      const response = await companiesService.getCompanies({ page: 1, perPage: 100 });
      const companies = response?.body?.companies || [];
      const dealers = transformToDealers(companies);
      cacheDealers(dealers);
      return dealers;
    },
    staleTime: Infinity,
  });
};

export const useCompanies = (params = {}, options = {}) => {
  const {
    enabled = true,
    staleTime,
    refetchOnWindowFocus,
    refetchOnMount,
    refetchOnReconnect,
  } = options;

  return useQuery({
    queryKey: ['companies', params],
    queryFn: () => companiesService.getCompanies(params),
    select: (data) => ({
      companies: data?.body?.companies || [],
      pagination: data?.body?.pagination || {
        page: 1,
        per_page: 20,
        total: 0,
        total_pages: 1,
      },
    }),
    enabled: Boolean(enabled), // Ensure it's a boolean
    staleTime,
    refetchOnWindowFocus: refetchOnWindowFocus !== undefined ? refetchOnWindowFocus : true,
    refetchOnMount: refetchOnMount !== undefined ? refetchOnMount : true,
    refetchOnReconnect: refetchOnReconnect !== undefined ? refetchOnReconnect : true,
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


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { termsService } from '@/lib/api/services/termsService';

/** Normalized list params so identical API calls share one cache (e.g. { perPage: 100 } vs { page: 1, perPage: 100 }). */
const normalizeTermsListParams = (params = {}) => {
  const page = params.page != null && params.page !== '' ? Number(params.page) : 1;
  const perPage = params.perPage != null && params.perPage !== '' ? Number(params.perPage) : 20;
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safePerPage = Number.isFinite(perPage) && perPage > 0 ? perPage : 20;
  const rawSearch = params.search;
  const search =
    typeof rawSearch === 'string' && rawSearch.trim() !== '' ? rawSearch.trim() : undefined;
  return { page: safePage, perPage: safePerPage, search };
};

const termsListQueryKey = (page, perPage, search) => ['terms', 'list', page, perPage, search ?? ''];

/** Prefetch first page (100 rows, no search). Call once when authenticated — merges with useTerms (calendar, dashboard, etc.). */
export const prefetchTermsListPage1Per100 = (queryClient) => {
  const p = normalizeTermsListParams({ page: 1, perPage: 100 });
  return queryClient.prefetchQuery({
    queryKey: termsListQueryKey(p.page, p.perPage, p.search),
    queryFn: () => termsService.getTerms(p),
    staleTime: 5 * 60 * 1000,
  });
};

export const useTerms = (params = {}, options = {}) => {
  const { page, perPage, search } = normalizeTermsListParams(params);
  const {
    enabled = true,
    staleTime,
    refetchOnWindowFocus,
    refetchOnMount,
    refetchOnReconnect,
  } = options;

  const isStandardFullList = page === 1 && perPage === 100 && search === undefined;

  return useQuery({
    queryKey: termsListQueryKey(page, perPage, search),
    queryFn: () => termsService.getTerms({ page, perPage, search }),
    select: (data) => ({
      terms: data?.body?.terms || [],
      pagination: data?.body?.pagination || {
        page: 1,
        per_page: 20,
        total: 0,
        total_pages: 1,
      },
    }),
    enabled,
    ...(isStandardFullList
      ? { refetchOnMount: false, refetchOnWindowFocus: false, refetchOnReconnect: false }
      : {}),
    ...(staleTime !== undefined ? { staleTime } : {}),
    ...(refetchOnWindowFocus !== undefined ? { refetchOnWindowFocus } : {}),
    ...(refetchOnMount !== undefined ? { refetchOnMount } : {}),
    ...(refetchOnReconnect !== undefined ? { refetchOnReconnect } : {}),
  });
};

export const useTerm = (id) => {
  return useQuery({
    queryKey: ['term', id],
    queryFn: () => termsService.getTerm(id),
    enabled: !!id,
  });
};

export const useCreateTerm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: termsService.createTerm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terms'] });
    },
  });
};

export const useUpdateTerm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: termsService.updateTerm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terms'] });
    },
  });
};

export const useDeleteTerm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: termsService.deleteTerm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terms'] });
    },
  });
};

export const useTermExchange = (params = {}, options = {}) => {
  const { enabled = true } = options;

  return useQuery({
    queryKey: ['termExchange', params],
    queryFn: () => termsService.getTermExchange(params),
    select: (data) => {
      const body = data?.body || {};
      const exchanges = body.exchanges || [];
      const pagination = body.pagination || {
        page: 1,
        per_page: 20,
        total: exchanges.length,
        total_pages: 1,
      };
      return {
        term: body.term || null,
        exchanges,
        pagination,
      };
    },
    enabled,
  });
};

export const useAddTermExchange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: termsService.addTermExchange,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['termExchange'] });
    },
  });
};

export const useDeleteTermExchange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: termsService.deleteTermExchange,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['termExchange'] });
    },
  });
};

export const useUpdateTermExchange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: termsService.updateTermExchange,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['termExchange'] });
    },
  });
};


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { countriesService } from '@/lib/api/services/countriesService';

const normalizeCountriesListParams = (params = {}) => {
  const page = params.page != null && params.page !== '' ? Number(params.page) : 1;
  const perPage = params.perPage != null && params.perPage !== '' ? Number(params.perPage) : 20;
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safePerPage = Number.isFinite(perPage) && perPage > 0 ? perPage : 20;
  const rawSearch = params.search;
  const search =
    typeof rawSearch === 'string' && rawSearch.trim() !== '' ? rawSearch.trim() : undefined;
  return { page: safePage, perPage: safePerPage, search };
};

const countriesListQueryKey = (page, perPage, search) => ['countries', 'list', page, perPage, search ?? ''];

/** Warm countries_list (page 1 / 500) for dealers — shared by CurrencyBootstrap and CurrencyModal. */
export const prefetchCountriesListPage1Per500 = (queryClient) => {
  const p = normalizeCountriesListParams({ page: 1, perPage: 500 });
  return queryClient.prefetchQuery({
    queryKey: countriesListQueryKey(p.page, p.perPage, p.search),
    queryFn: () => countriesService.getCountries(p),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCountries = (params = {}, { enabled = true, ...queryOptions } = {}) => {
  const { page, perPage, search } = normalizeCountriesListParams(params);
  const isStandardLargeList = page === 1 && perPage === 500 && search === undefined;

  return useQuery({
    queryKey: countriesListQueryKey(page, perPage, search),
    queryFn: () => countriesService.getCountries({ page, perPage, search }),
    select: (data) => ({
      countries: data?.body?.countries || [],
      pagination: data?.body?.pagination || {
        page: 1,
        per_page: 20,
        total: 0,
        total_pages: 1,
      },
    }),
    enabled,
    ...(isStandardLargeList
      ? { refetchOnMount: false, refetchOnWindowFocus: false, refetchOnReconnect: false }
      : {}),
    ...queryOptions,
  });
};

export const useCountry = (id) => {
  return useQuery({
    queryKey: ['country', id],
    queryFn: () => countriesService.getCountry(id),
    enabled: !!id,
  });
};

export const useCreateCountry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: countriesService.createCountry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
    },
  });
};

export const useUpdateCountry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: countriesService.updateCountry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
    },
  });
};

export const useDeleteCountry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: countriesService.deleteCountry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
    },
  });
};

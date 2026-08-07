import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { announcementsService } from '@/lib/api/services/announcementsService';

/** Normalized list params so identical API calls share one cache entry. */
const normalizeAnnouncementsListParams = (params = {}) => {
  const page = params.page != null && params.page !== '' ? Number(params.page) : 1;
  const perPage = params.perPage != null && params.perPage !== '' ? Number(params.perPage) : 20;
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safePerPage = Number.isFinite(perPage) && perPage > 0 ? perPage : 20;

  const rawSearch = params.search;
  const search =
    typeof rawSearch === 'string' && rawSearch.trim() !== '' ? rawSearch.trim() : undefined;

  const announcementId =
    params.announcementId != null && params.announcementId !== '' ? params.announcementId : undefined;
  const companyId =
    params.companyId != null && params.companyId !== '' ? params.companyId : undefined;
  const forAll = params.forAll != null && params.forAll !== '' ? params.forAll : undefined;
  const unreadOnly = params.unreadOnly ? 1 : undefined;

  return {
    page: safePage,
    perPage: safePerPage,
    announcementId,
    companyId,
    forAll,
    search,
    unreadOnly,
  };
};

const announcementsListQueryKey = ({ page, perPage, announcementId, companyId, forAll, search, unreadOnly }) => [
  'announcements',
  'list',
  page,
  perPage,
  announcementId ?? '',
  companyId ?? '',
  forAll ?? '',
  search ?? '',
  unreadOnly ?? '',
];

export const useAnnouncements = (params = {}, options = {}) => {
  const normalized = normalizeAnnouncementsListParams(params);
  const { enabled = true, staleTime, refetchOnWindowFocus, refetchOnMount, refetchOnReconnect } = options;

  return useQuery({
    queryKey: announcementsListQueryKey(normalized),
    queryFn: () => announcementsService.getAnnouncements(normalized),
    select: (data) => ({
      announcements: data?.body?.announcements || [],
      pagination: data?.body?.pagination || { page: 1, per_page: 20, total: 0, total_pages: 1 },
      unreadCount: data?.body?.unread_count ?? null,
    }),
    enabled: Boolean(enabled),
    ...(staleTime !== undefined ? { staleTime } : {}),
    ...(refetchOnWindowFocus !== undefined ? { refetchOnWindowFocus } : {}),
    ...(refetchOnMount !== undefined ? { refetchOnMount } : {}),
    ...(refetchOnReconnect !== undefined ? { refetchOnReconnect } : {}),
  });
};

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: announcementsService.createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
};

export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: announcementsService.updateAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
};

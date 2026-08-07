import apiClient from '../client';

export const announcementsService = {
  getAnnouncements: async (params = {}) => {
    const {
      page = 1,
      perPage = 20,
      announcementId,
      companyId,
      forAll,
      search,
      unreadOnly,
    } = params;

    const queryParams = { page, per_page: perPage };

    if (announcementId != null && announcementId !== '') {
      queryParams.announcement_id = announcementId;
    }
    if (companyId != null && companyId !== '') {
      queryParams.company_id = companyId;
    }
    if (forAll != null && forAll !== '') {
      queryParams.for_all = forAll;
    }
    if (search && search.trim()) {
      queryParams.search = search.trim();
    }
    if (unreadOnly) {
      queryParams.unread_only = 1;
    }

    return apiClient.get('/announcements_list', { params: queryParams });
  },

  createAnnouncement: async (data) => {
    const payload = {
      title: data.title,
      description: data.description,
      for_all: data.for_all,
    };
    if (data.company_id != null) {
      payload.company_id = data.company_id;
    }
    return apiClient.post('/announcement_add', payload);
  },

  updateAnnouncement: async (data) => {
    const payload = {
      announcement_id: data.announcement_id,
      title: data.title,
      description: data.description,
      for_all: data.for_all,
    };
    if (data.company_id != null) {
      payload.company_id = data.company_id;
    }
    return apiClient.post('/announcement_update', payload);
  },
};

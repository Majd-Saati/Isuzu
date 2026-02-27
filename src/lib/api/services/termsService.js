import apiClient from '../client';

export const termsService = {
  getTerms: async (params = {}) => {
    const { page = 1, perPage = 20, search } = params;
    const queryParams = {
      page,
      per_page: perPage,
    };
    
    // Only include search if it has a value
    if (search && search.trim()) {
      queryParams.search = search.trim();
    }
    
    return apiClient.get('/terms_list', {
      params: queryParams,
    });
  },

  getTerm: async (id) => {
    return apiClient.get(`/term/${id}`);
  },

  createTerm: async (data) => {
    return apiClient.post('/term_create', data);
  },

  updateTerm: async (data) => {
    return apiClient.post('/term_update', data);
  },

  deleteTerm: async (id) => {
    return apiClient.post('/delete_term', { term_id: id });
  },

  getTermExchange: async (params = {}) => {
    const { page = 1, perPage = 20 } = params;
    return apiClient.get('/get_term_exchange', {
      params: { page, per_page: perPage },
    });
  },

  addTermExchange: async (data) => {
    return apiClient.post('/term_exchange_add', {
      term_id: data.term_id,
      country_id: data.country_id,
      rate: data.rate,
      ...(data.note != null && data.note !== '' && { note: data.note }),
    });
  },
};


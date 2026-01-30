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
};


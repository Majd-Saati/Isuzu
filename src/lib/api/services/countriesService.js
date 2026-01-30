import apiClient from '../client';

export const countriesService = {
  getCountries: async (params = {}) => {
    const { page = 1, perPage = 20, search } = params;
    const queryParams = {
      page,
      per_page: perPage,
    };
    
    // Only include search if it has a value
    if (search && search.trim()) {
      queryParams.search = search.trim();
    }
    
    return apiClient.get('/countries_list', {
      params: queryParams,
    });
  },

  getCountry: async (id) => {
    return apiClient.get(`/country/${id}`);
  },

  createCountry: async (data) => {
    return apiClient.post('/create_country', data);
  },

  updateCountry: async ({ id, ...data }) => {
    // Backend expects `country_id` in the body for updates
    return apiClient.post('/update_country', {
      country_id: id,
      ...data,
    });
  },

  deleteCountry: async (id) => {
    return apiClient.post('/delete_country', { country_id: id });
  },
};

import apiClient from '../client';

export const companiesService = {
  getCompanies: async (params = {}) => {
    const { page = 1, perPage = 20, search } = params;
    const queryParams = {
      page,
      per_page: perPage,
    };
    
    // Only include search if it has a value
    if (search && search.trim()) {
      queryParams.search = search.trim();
    }
    
    return apiClient.get('/companies_list', {
      params: queryParams,
    });
  },

  getCompany: async (id) => {
    return apiClient.get(`/company/${id}`);
  },

  createCompany: async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('country_id', data.country_id);
    
    if (data.logo) {
      formData.append('logo', data.logo);
    }
    
    return apiClient.post('/create_company', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  updateCompany: async ({ id, ...data }) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('country_id', data.country_id);
    
    if (data.logo) {
      formData.append('logo', data.logo);
    }
    
    return apiClient.post(`/update_company/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteCompany: async (id) => {
    return apiClient.post('/delete_company', { company_id: id });
  },
};

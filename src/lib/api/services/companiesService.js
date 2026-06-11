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

  updateCompany: async (payload) => {
    const companyId = payload.company_id ?? payload.id;
    const formData = new FormData();
    formData.append('company_id', companyId);

    if (payload.name != null && String(payload.name).trim() !== '') {
      formData.append('name', payload.name);
    }

    if (payload.country_id != null && String(payload.country_id).trim() !== '') {
      formData.append('country_id', payload.country_id);
    }

    if (payload.logo) {
      formData.append('logo', payload.logo);
    }

    return apiClient.post('/update_company', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteCompany: async (id) => {
    return apiClient.post('/delete_company', { company_id: id });
  },
};

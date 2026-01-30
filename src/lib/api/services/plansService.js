import apiClient from '../client';

export const plansService = {
  getPlans: async (params = {}) => {
    const { page = 1, perPage = 20, companyId, termId, search } = params;
    const queryParams = {
      page,
      per_page: perPage,
    };
    
    // Add company_id filter if provided
    if (companyId) {
      queryParams.company_id = companyId;
    }
    
    // Add term_id filter if provided
    if (termId) {
      queryParams.term_id = termId;
    }
    
    // Add search parameter if provided
    if (search) {
      queryParams.search = search;
    }
    
    return apiClient.get('/plans_list', {
      params: queryParams,
    });
  },

  getPlan: async (id) => {
    return apiClient.get(`/plan/${id}`);
  },

  createPlan: async (data) => {
    return apiClient.post('/plan_create', data);
  },

  updatePlan: async (data) => {
    // API expects plan_id in body
    return apiClient.post('/plan_update', data);
  },

  deletePlan: async (planId) => {
    return apiClient.post('/delete_plan', { plan_id: planId });
  },
};


import apiClient from '../client';

export const activitiesService = {
  getActivities: async (params = {}) => {
    const { planIds = [], page = 1, perPage = 20 } = params;
    
    // Convert array of plan IDs to comma-separated string
    const planIdsString = Array.isArray(planIds) ? planIds.join(',') : planIds;
    
    return apiClient.get('/activities_list', {
      params: {
        plan_ids: planIdsString,
        page,
        per_page: perPage,
      },
    });
  },

  getActivity: async (id) => {
    return apiClient.get(`/activity/${id}`);
  },

  createActivity: async (data) => {
    return apiClient.post('/activity_create', data);
  },

  updateActivity: async (data) => {
    return apiClient.post('/activity_update', data);
  },

  deleteActivity: async (activityId) => {
    return apiClient.post('/delete_activity', { activity_id: activityId });
  },

  updateActivityStatus: async ({ activity_id, status }) => {
    return apiClient.post('/activity_update_status', {
      activity_id,
      status,
    });
  },

  getActivityMeta: async (params = {}) => {
    const { activityId, planId, companyId, type, page = 1, perPage = 20 } = params;
    const queryParams = {
      activity_id: activityId,
      plan_id: planId,
      company_id: companyId,
      page,
      per_page: perPage,
    };
    
    // Only include type if it has a value
    if (type) {
      queryParams.type = type;
    }
    
    return apiClient.get('/activity_meta_list', {
      params: queryParams,
    });
  },

  getActivityBudgetList: async (params = {}) => {
    const { activityId, planId, companyId, type, status, page = 1, perPage = 20 } = params;
    return apiClient.get('/activity_budget_list', {
      params: {
        activity_id: activityId,
        plan_id: planId,
        company_id: companyId,
        type,
        status,
        page,
        per_page: perPage,
      },
    });
  },

  createActivityBudget: async (data) => {
    const formData = new FormData();
    formData.append('activity_id', data.activity_id);
    formData.append('plan_id', data.plan_id);
    formData.append('company_id', data.company_id);
    formData.append('type', data.type);
    formData.append('value', data.value);
    formData.append('description', data.description);
    if (data.media) {
      formData.append('media', data.media);
    }
    if (data.months_breakdown && Object.keys(data.months_breakdown).length > 0) {
      formData.append('months_breakdown', JSON.stringify(data.months_breakdown));
    }
    return apiClient.post('/activity_budget_add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  updateBudgetStatus: async ({ budgetId, status }) => {
    return apiClient.post('/activity_budget_status_update', {
      budget_id: budgetId,
      status: status,
    });
  },

  deleteBudget: async (budgetId) => {
    return apiClient.post('/delete_activity_budget_allocation', { budget_id: budgetId });
  },

  createActivityMeta: async (data) => {
    const formData = new FormData();
    formData.append('activity_id', data.activity_id);
    formData.append('plan_id', data.plan_id);
    formData.append('company_id', data.company_id);
    formData.append('type', data.type || 'comment');
    formData.append('description', data.description);
    if (data.media) {
      formData.append('media', data.media);
    }
    return apiClient.post('/activity_meta_add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteMeta: async (metaId) => {
    return apiClient.post('/delete_activity_meta', { meta_id: metaId });
  },
};


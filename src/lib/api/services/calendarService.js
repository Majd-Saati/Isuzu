import apiClient from '../client';

export const calendarService = {
  getCalendarView: async (params = {}) => {
    const { term_id, company_id } = params;
    
    if (!term_id) {
      throw new Error('term_id is required');
    }
    
    const requestParams = { term_id };
    // Only include company_id if it's provided (not for "all companies")
    if (company_id) {
      requestParams.company_id = company_id;
    }
    
    return apiClient.get('/calendar_view', {
      params: requestParams,
    });
  },
};


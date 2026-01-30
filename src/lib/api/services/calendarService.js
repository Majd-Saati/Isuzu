import apiClient from '../client';

export const calendarService = {
  getCalendarView: async (params = {}) => {
    const { term_id, company_id } = params;
    
    if (!term_id || !company_id) {
      throw new Error('term_id and company_id are required');
    }
    
    return apiClient.get('/calendar_view', {
      params: {
        term_id,
        company_id,
      },
    });
  },
};


import apiClient from '../client';

/**
 * Fetch charts data. Use either month (YYYY-MM) or term_id, not both.
 * @param {{ company_id?: string, month?: string, term_id?: string|number }} params
 */
export const chartsService = {
  getCharts: async (params = {}) => {
    const { company_id = 'all', month, term_id } = params;
    const queryParams = { company_id };
    if (month) queryParams.month = month;
    if (term_id != null && term_id !== '') queryParams.term_id = term_id;
    return apiClient.get('/charts', { params: queryParams });
  },
};

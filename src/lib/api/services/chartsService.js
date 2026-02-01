import apiClient from '../client';

/**
 * Fetch charts data. Use either month (YYYY-MM), term_id, or year.
 * @param {{ company_id?: string, month?: string, term_id?: string|number, year?: string|number }} params
 */
export const chartsService = {
  getCharts: async (params = {}) => {
    const { company_id = 'all', month, term_id, year } = params;
    const queryParams = { company_id };
    if (month) queryParams.month = month;
    if (term_id != null && term_id !== '') queryParams.term_id = term_id;
    if (year != null && year !== '') queryParams.year = year;
    return apiClient.get('/charts', { params: queryParams });
  },
};

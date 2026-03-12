import apiClient from '../client';

/**
 * Fetch charts data. Use either month (YYYY-MM), term_id, year, or two_years comparison.
 * @param {{ company_id?: string, month?: string, term_id?: string|number, year?: string|number, two_years?: number, year1?: number, year2?: number }} params
 */
export const chartsService = {
  getCharts: async (params = {}) => {
    const { company_id = 'all', month, term_id, year, two_years, year1, year2 } = params;
    const queryParams = { company_id };
    if (month) queryParams.month = month;
    if (term_id != null && term_id !== '') queryParams.term_id = term_id;
    if (year != null && year !== '') queryParams.year = year;
    if (two_years != null && two_years !== '') queryParams.two_years = two_years;
    if (year1 != null && year1 !== '') queryParams.year1 = year1;
    if (year2 != null && year2 !== '') queryParams.year2 = year2;
    return apiClient.get('/charts', { params: queryParams });
  },
};

/**
 * Fetch report data by term
 * @param {{ term_id: string|number }} params
 */
export const reportService = {
  getReport: async (params = {}) => {
    const { term_id } = params;
    if (!term_id) {
      throw new Error('term_id is required');
    }
    return apiClient.get('/report', { params: { term_id } });
  },
};

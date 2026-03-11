import apiClient from '../client';

/**
 * Fetch budget allocation list. Optional filters: term_id, company_id.
 * @param {{ page?: number, per_page?: number, term_id?: string|number, company_id?: string|number }} params
 */
export const budgetAllocationService = {
  getBudgetAllocationList: async (params = {}) => {
    const { page = 1, per_page = 20, term_id, company_id } = params;
    const queryParams = { page, per_page };
    if (term_id != null && term_id !== '') queryParams.term_id = term_id;
    if (company_id != null && company_id !== '') queryParams.company_id = company_id;
    return apiClient.get('/budget_allocation_list', { params: queryParams });
  },
};

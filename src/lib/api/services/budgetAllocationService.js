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

  /**
   * Set budget allocation for a term and company.
   * @param {{ term_id: number, company_id: number, value: number }} body
   */
  setBudgetAllocation: async (body) => {
    return apiClient.post('/budget_allocation_set', body);
  },

  /**
   * Update an existing budget allocation value.
   * @param {{ id: number, value: number }} body
   */
  updateBudgetAllocation: async (body) => {
    return apiClient.post('/budget_allocation_update', body);
  },

  /**
   * Delete a budget allocation.
   * @param {{ id: number }} body
   */
  deleteBudgetAllocation: async (body) => {
    return apiClient.post('/budget_allocation_delete', body);
  },
};

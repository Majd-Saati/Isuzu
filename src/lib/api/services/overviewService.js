import apiClient from '../client';

const RECENT_OPS_PARAM_KEYS = [
  'company_id',
  'kind',
  'term_id',
  'plan_id',
  'activity_id',
  'budget_type',
  'budget_status',
  'meta_type',
  'date_from',
  'date_to',
  'page',
  'per_page',
];

export const overviewService = {
  getOverview: async () => {
    return apiClient.get('/overview');
  },

  /** GET /recent_operations — dashboard “Overview Recently” table */
  getRecentOperations: async (params = {}) => {
    const query = {};
    for (const key of RECENT_OPS_PARAM_KEYS) {
      const v = params[key];
      if (v === undefined || v === null) continue;
      if (typeof v === 'number' && Number.isFinite(v)) {
        query[key] = v;
        continue;
      }
      if (String(v).trim() !== '') query[key] = v;
    }
    return apiClient.get('/recent_operations', { params: query });
  },
};

import apiClient from '../client';

export const mediaDownloadService = {
  /**
   * Prepare a bulk media (zip) download for a company + term, optionally
   * scoped down to a single plan and/or activity.
   *
   * The API responds with a one-time, short-lived `download_url` inside `body`.
   *
   * @param {Object} params
   * @param {'actual cost'|'estimated cost'} params.type - Budget type to bundle.
   * @param {string|number} params.companyId
   * @param {string|number} params.termId
   * @param {string|number} [params.planId]
   * @param {string|number} [params.activityId]
   */
  bulkMediaDownload: async ({ type, companyId, termId, planId, activityId } = {}) => {
    const params = {
      type,
      company_id: companyId,
      term_id: termId,
    };

    if (planId != null && planId !== '') params.plan_id = planId;
    if (activityId != null && activityId !== '') params.activity_id = activityId;

    return apiClient.post('/bulk_media_download', {}, { params });
  },
};

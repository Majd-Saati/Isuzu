import { ROUTES } from '@/router/routes';

/**
 * Detect / parse marketing-plans deep-link query params.
 * Supports root URLs like:
 *   /?plan_id=27&activity_id=313&budget_id=1834
 *   /?plan_id=40&activity_id=365&meta_id=107
 * and marketing-plans URLs with the same params.
 */
export const parseMarketingPlansDeepLink = (search) => {
  const params =
    typeof search === 'string'
      ? new URLSearchParams(search.startsWith('?') ? search : `?${search}`)
      : search instanceof URLSearchParams
        ? search
        : new URLSearchParams();

  const activityId = params.get('activity_id') || params.get('activity') || null;
  const planId = params.get('plan_id') || params.get('plan') || null;
  const budgetId = params.get('budget_id') || null;
  const metaId = params.get('meta_id') || null;
  const openDrawerRaw = params.get('openDrawer');
  const openDrawer =
    openDrawerRaw == null || openDrawerRaw === ''
      ? Boolean(activityId)
      : ['1', 'true', 'yes'].includes(String(openDrawerRaw).toLowerCase());

  return {
    activityId: activityId ? String(activityId) : null,
    planId: planId ? String(planId) : null,
    budgetId: budgetId ? String(budgetId) : null,
    metaId: metaId ? String(metaId) : null,
    openDrawer: Boolean(activityId && openDrawer),
  };
};

export const hasMarketingPlansDeepLink = (search) => {
  const { activityId, planId, budgetId, metaId } = parseMarketingPlansDeepLink(search);
  return Boolean(activityId || planId || budgetId || metaId);
};

/** Build `/marketing-plans?...` preserving deep-link params (normalized keys). */
export const buildMarketingPlansDeepLinkPath = (search) => {
  const parsed = parseMarketingPlansDeepLink(search);
  const params = new URLSearchParams();

  if (parsed.planId) params.set('plan_id', parsed.planId);
  if (parsed.activityId) params.set('activity_id', parsed.activityId);
  if (parsed.budgetId) params.set('budget_id', parsed.budgetId);
  if (parsed.metaId) params.set('meta_id', parsed.metaId);
  if (parsed.openDrawer) params.set('openDrawer', '1');

  const qs = params.toString();
  return qs ? `${ROUTES.MARKETING_PLANS}?${qs}` : ROUTES.MARKETING_PLANS;
};

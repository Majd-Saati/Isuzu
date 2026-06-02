import { formatDealerCardMoney } from '@/lib/dashboardMoney';

/** Calendar amounts use the same display rules as the rest of the app. */
export const formatCurrency = (amount, isAdmin, currencyCode = '') => {
  return formatDealerCardMoney(amount, isAdmin, currencyCode);
};

/**
 * Format date string to locale date (e.g. "Jan 1, 2026").
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

/**
 * Normalize the calendar API body into the flat shape the page expects.
 *
 * The API returns plans nested per-company: `{ term, months, companies: [{ company, plans }] }`.
 * The page/table/summary work off a flat `plans` array plus an optional single `company`,
 * so flatten the companies here (tagging each plan with its company name) and expose the
 * single company when exactly one is present. A legacy flat `{ plans }` body is passed through.
 */
export const normalizeCalendarData = (body) => {
  if (!body) return null;
  if (Array.isArray(body.plans)) return body;

  const companies = Array.isArray(body.companies) ? body.companies : [];
  const plans = companies.flatMap((entry) =>
    (entry.plans || []).map((plan) => ({ ...plan, company_name: entry.company?.name }))
  );

  return {
    ...body,
    plans,
    company: companies.length === 1 ? companies[0].company : body.company ?? null,
  };
};

/**
 * Compute summary stats from calendar API response (plans/activities/monthly).
 */
export const computeSummaryStats = (calendarData) => {
  if (!calendarData) {
    return { totalCost: 0, totalIncentive: 0, totalActualCost: 0, totalSupportCost: 0 };
  }

  let totalCost = 0;
  let totalIncentive = 0;
  let totalActualCost = 0;
  let totalSupportCost = 0;

  calendarData.plans?.forEach((plan) => {
    plan.activities?.forEach((activity) => {
      totalCost += parseFloat(activity.total_cost) || 0;
      totalIncentive += parseFloat(activity.incentive) || 0;
      Object.values(activity.monthly || {}).forEach((monthData) => {
        totalActualCost += parseFloat(monthData.actual_cost) || 0;
        totalSupportCost += parseFloat(monthData.support_cost) || 0;
      });
    });
  });

  return { totalCost, totalIncentive, totalActualCost, totalSupportCost };
};

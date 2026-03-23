import { formatDealerCardMoney } from '@/lib/dashboardMoney';

/** Calendar amounts use the same display rules as the rest of the app. */
export const formatCurrency = (amount, isAdmin, currencyCode = 'JPY') => {
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

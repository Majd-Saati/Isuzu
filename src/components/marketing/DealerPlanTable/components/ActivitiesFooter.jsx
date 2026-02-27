import React from 'react';

const formatCurrency = (value) => {
  const num = Number(value);
  if (num === undefined || num === null || Number.isNaN(num)) return '$0';
  return `$${num.toLocaleString()}`;
};

export const ActivitiesFooter = ({ activities, selectedActivities, showBudgetColumns, planSummary }) => {
  if (activities.length === 0) return null;

  // Use API plan summary when available; otherwise fall back to client-calculated totals
  const useApiSummary = showBudgetColumns && planSummary != null;
  const estimated = useApiSummary
    ? Number(planSummary.accepted_estimated_cost) || 0
    : (showBudgetColumns ? activities.reduce((sum, a) => sum + a.estimatedCost, 0) : 0);
  const actual = useApiSummary
    ? Number(planSummary.accepted_actual_cost) || 0
    : (showBudgetColumns ? activities.reduce((sum, a) => sum + a.actualCost, 0) : 0);
  const support = useApiSummary
    ? Number(planSummary.accepted_support_cost) || 0
    : (showBudgetColumns ? activities.reduce((sum, a) => sum + a.supportCost, 0) : 0);
  const allocation = planSummary?.term_budget_allocation;
  const allocatedValue = allocation != null ? Number(allocation.allocated_value) : null;
  const remainingValue = allocation != null ? Number(allocation.remaining_value) : null;
  const showTotals = showBudgetColumns && (useApiSummary || estimated !== 0 || actual !== 0 || support !== 0);

  return (
    <div className="border-t-2 border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 bg-gray-50/70 dark:bg-gray-800/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
        {activities.length} Activities
        {selectedActivities.length > 0 && (
          <span className="ml-2 text-[#E60012] font-medium">
            ({selectedActivities.length} selected)
          </span>
        )}
      </span>
      {showTotals && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm">
          <div className="flex items-center gap-1">
            <span className="text-gray-600 dark:text-gray-400">Estimated:</span>
            <span className={`font-semibold text-blue-600 ${estimated === 0 ? 'dark:text-white' : 'dark:text-blue-400'}`}>
              {formatCurrency(estimated)}
            </span>
          </div>
          <span className="hidden sm:inline text-gray-400 dark:text-gray-600">|</span>
          <div className="flex items-center gap-1">
            <span className="text-gray-600 dark:text-gray-400">Actual:</span>
            <span className={`font-semibold text-emerald-600 ${actual === 0 ? 'dark:text-white' : 'dark:text-emerald-400'}`}>
              {formatCurrency(actual)}
            </span>
          </div>
          <span className="hidden sm:inline text-gray-400 dark:text-gray-600">|</span>
          <div className="flex items-center gap-1">
            <span className="text-gray-600 dark:text-gray-400">Support:</span>
            <span className={`font-semibold text-purple-600 ${support === 0 ? 'dark:text-white' : 'dark:text-purple-400'}`}>
              {formatCurrency(support)}
            </span>
          </div>
          {(allocatedValue != null || remainingValue != null) && (
            <>
              <span className="hidden sm:inline text-gray-400 dark:text-gray-600">|</span>
              {allocatedValue != null && (
                <div className="flex items-center gap-1">
                  <span className="text-gray-600 dark:text-gray-400">Allocated:</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {formatCurrency(allocatedValue)}
                  </span>
                </div>
              )}
              {remainingValue != null && (
                <div className="flex items-center gap-1">
                  <span className="text-gray-600 dark:text-gray-400">Remaining:</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {formatCurrency(remainingValue)}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};




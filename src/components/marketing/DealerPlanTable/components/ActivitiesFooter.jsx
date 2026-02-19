import React from 'react';

export const ActivitiesFooter = ({ activities, selectedActivities, showBudgetColumns }) => {
  if (activities.length === 0) return null;

  const totals = showBudgetColumns ? {
    estimated: activities.reduce((sum, a) => sum + a.estimatedCost, 0),
    actual: activities.reduce((sum, a) => sum + a.actualCost, 0),
    support: activities.reduce((sum, a) => sum + a.supportCost, 0),
    invoice: activities.reduce((sum, a) => sum + a.invoiceCost, 0),
  } : null;

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
      {showBudgetColumns && totals && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm">
          <div className="flex items-center gap-1">
            <span className="text-gray-600 dark:text-gray-400">Estimated:</span>
            <span className={`font-semibold text-blue-600 ${totals.estimated === 0 ? 'dark:text-white' : 'dark:text-blue-400'}`}>
              ${totals.estimated.toLocaleString()}
            </span>
          </div>
          <span className="hidden sm:inline text-gray-400 dark:text-gray-600">|</span>
          <div className="flex items-center gap-1">
            <span className="text-gray-600 dark:text-gray-400">Actual:</span>
            <span className={`font-semibold text-emerald-600 ${totals.actual === 0 ? 'dark:text-white' : 'dark:text-emerald-400'}`}>
              ${totals.actual.toLocaleString()}
            </span>
          </div>
          <span className="hidden sm:inline text-gray-400 dark:text-gray-600">|</span>
          <div className="flex items-center gap-1">
            <span className="text-gray-600 dark:text-gray-400">Support:</span>
            <span className={`font-semibold text-purple-600 ${totals.support === 0 ? 'dark:text-white' : 'dark:text-purple-400'}`}>
              ${totals.support.toLocaleString()}
            </span>
          </div>
          <span className="hidden sm:inline text-gray-400 dark:text-gray-600">|</span>
          <div className="flex items-center gap-1">
            <span className="text-gray-600 dark:text-gray-400">Invoice:</span>
            <span className={`font-semibold text-amber-600 ${totals.invoice === 0 ? 'dark:text-white' : 'dark:text-amber-400'}`}>
              ${totals.invoice.toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};


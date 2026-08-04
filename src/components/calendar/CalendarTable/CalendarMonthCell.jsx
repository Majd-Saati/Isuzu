import React from 'react';
import { formatCurrency } from '../utils/calendarUtils';

export const CalendarMonthCell = ({ monthData, isAdmin, currencyCode }) => {
  const estimatedCost = parseFloat(monthData?.estimated_cost) || 0;
  const actualCost = parseFloat(monthData?.actual_cost) || 0;
  const supportCost = parseFloat(monthData?.support_cost) || 0;
  const hasData = estimatedCost > 0 || actualCost > 0 || supportCost > 0;

  if (!hasData) {
    return <span className="text-xs text-gray-400 dark:text-gray-600">—</span>;
  }

  return (
    <div className="text-center space-y-1.5">
      {estimatedCost > 0 && (
        <div className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 px-2 py-1 bg-cyan-50 dark:bg-cyan-900/20 rounded">
          Estimated: {formatCurrency(estimatedCost, isAdmin, currencyCode)}
        </div>
      )}
      {actualCost > 0 && (
        <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded">
          Actual: {formatCurrency(actualCost, isAdmin, currencyCode)}
        </div>
      )}
      {supportCost > 0 && (
        <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 px-2 py-1 bg-purple-50 dark:bg-purple-900/20 rounded">
          Support: {formatCurrency(supportCost, isAdmin, currencyCode)}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { formatCurrency } from '../utils';

export const TableSummary = ({ term, summary }) => {
  if (!term) return null;

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
      <div className="flex-1 min-w-[200px]">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Period</div>
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {term.start_date} to {term.end_date}
        </div>
      </div>
      
      <div className="flex items-center gap-4 border-l border-gray-300 dark:border-gray-600 pl-4">
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Activities</div>
          <div className="text-lg font-bold text-[#E60012]">
            {summary?.term_total_activities || 0}
          </div>
        </div>
        
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Actual Cost</div>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(summary?.term_total_actual_cost || 0)}
          </div>
        </div>
        
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Support Cost</div>
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(summary?.term_total_support_cost || 0)}
          </div>
        </div>
      </div>
    </div>
  );
};


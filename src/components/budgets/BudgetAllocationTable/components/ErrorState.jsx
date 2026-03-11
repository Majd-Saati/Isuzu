import React from 'react';
import { AlertCircle } from 'lucide-react';

export const BudgetAllocationErrorState = ({ error }) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="flex flex-col items-center justify-center py-12">
      <AlertCircle className="w-12 h-12 text-red-500 dark:text-red-400 mb-3" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Failed to load budget allocations</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
        {error?.message || 'Please try again or change the filters.'}
      </p>
    </div>
  </div>
);

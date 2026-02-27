import React from 'react';
import { Info } from 'lucide-react';

export const CalendarEmptyState = ({ isAdmin }) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-sm p-12 text-center">
    <Info className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
      No Calendar Data Loaded
    </h3>
    <p className="text-sm text-gray-500 dark:text-gray-400">
      {isAdmin
        ? 'Please select a term and company (or "All companies") above to view the calendar information.'
        : 'Please select a term above to view the calendar information.'}
    </p>
  </div>
);

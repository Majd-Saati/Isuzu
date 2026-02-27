import React from 'react';
import { TrendingUp } from 'lucide-react';

export const TermExchangeTableEmpty = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-sm p-12 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <TrendingUp className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        No exchange rates
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
        There are no term exchange rates to display. Data will appear here when available.
      </p>
    </div>
  );
};

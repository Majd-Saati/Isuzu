import React from 'react';
import { BarChart3 } from 'lucide-react';

export const MarketingChartsEmpty = () => (
  <div className="flex flex-col items-center justify-center py-16 px-6 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
    <BarChart3 className="w-14 h-14 text-gray-400 dark:text-gray-500 mb-4" />
    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
      No chart data
    </h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
      Select a month or term above to load marketing cost and incentive data.
    </p>
  </div>
);

import React from 'react';
import { TrendingUp } from 'lucide-react';

export const TermExchangeTableEmpty = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#E60012]/10 dark:from-[#E60012]/20 to-[#C00010]/10 dark:to-[#C00010]/20 flex items-center justify-center mb-6 animate-pulse">
          <TrendingUp className="w-10 h-10 text-[#E60012]" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          No exchange rates
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
          There are no term exchange rates to display. Data will appear here when available.
        </p>
      </div>
    </div>
  );
};

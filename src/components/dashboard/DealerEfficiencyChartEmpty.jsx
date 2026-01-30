import React from 'react';
import { PieChart, AlertCircle } from 'lucide-react';

export const DealerEfficiencyChartEmpty = ({ title }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-[24px] p-6 md:p-8 shadow-[0px_4px_16px_rgba(0,0,0,0.06)] dark:shadow-[0px_4px_16px_rgba(0,0,0,0.3)] border-2 border-gray-100 dark:border-gray-800 animate-fade-in">
      <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#E60012]/10 dark:from-[#E60012]/20 to-[#F38088]/10 dark:to-[#F38088]/20 flex items-center justify-center">
            <PieChart className="w-10 h-10 text-[#E60012]" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-4 border-white dark:border-gray-900">
            <AlertCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title || 'No Chart Data'}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
            No data available to display this chart. Data will appear here once it's been recorded.
          </p>
        </div>

        <div className="pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="w-2 h-2 bg-[#E60012] rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">Waiting for data</span>
          </div>
        </div>
      </div>
    </div>
  );
};

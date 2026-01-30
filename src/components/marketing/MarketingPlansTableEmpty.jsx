import React from 'react';
import { ClipboardList, FolderX } from 'lucide-react';

export const MarketingPlansTableEmpty = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-sm p-12 md:p-20 animate-fade-in">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#E60012]/10 dark:from-[#E60012]/20 to-[#F38088]/10 dark:to-[#F38088]/20 flex items-center justify-center">
            <ClipboardList className="w-12 h-12 text-[#E60012]" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-4 border-white dark:border-gray-900">
            <FolderX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">No Marketing Plans</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
            There are no marketing plans to display at the moment. Click "Add Plan" to create your first marketing plan and start organizing your activities.
          </p>
        </div>

        <div className="pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="w-2 h-2 bg-[#E60012] rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">Ready to add plans</span>
          </div>
        </div>
      </div>
    </div>
  );
};

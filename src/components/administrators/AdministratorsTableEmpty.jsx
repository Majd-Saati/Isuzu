import React from 'react';
import { UserX, Shield } from 'lucide-react';

export const AdministratorsTableEmpty = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-[0px_4px_16px_rgba(0,0,0,0.06)] border-2 border-gray-100 dark:border-gray-800 p-12 md:p-20 animate-fade-in">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#374151]/10 dark:from-[#374151]/20 to-[#6B7280]/10 dark:to-[#6B7280]/20 flex items-center justify-center">
            <Shield className="w-12 h-12 text-[#374151] dark:text-gray-300" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-4 border-white dark:border-gray-900">
            <UserX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">No Administrators Found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
            There are no administrators to display at the moment. Click the plus button to add your first administrator and start managing permissions.
          </p>
        </div>

        <div className="pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="w-2 h-2 bg-[#374151] dark:bg-gray-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">Ready to add administrators</span>
          </div>
        </div>
      </div>
    </div>
  );
};

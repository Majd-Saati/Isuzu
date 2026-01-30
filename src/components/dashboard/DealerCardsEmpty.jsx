import React from 'react';
import { Store, UserX } from 'lucide-react';

export const DealerCardsEmpty = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-12 md:p-16">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Store className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <UserX className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">No Dealers Found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
            There are no ISUZU dealers to display at the moment. Dealers will appear here once they are added to the system.
          </p>
        </div>
      </div>
    </div>
  );
};

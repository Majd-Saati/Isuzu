import React from 'react';
import { Wallet, FileX } from 'lucide-react';

export const BudgetAllocationEmptyState = () => (
  <div className="bg-white dark:bg-gray-900 rounded-[24px] p-6 md:p-8 shadow-[0px_4px_16px_rgba(0,0,0,0.06)] dark:shadow-[0px_4px_16px_rgba(0,0,0,0.3)] border-2 border-gray-100 dark:border-gray-800 animate-fade-in">
    <div className="flex flex-col items-center justify-center text-center py-12 md:py-16">
      <div className="relative mb-4">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#E60012]/10 dark:from-[#E60012]/20 to-[#F38088]/10 dark:to-[#F38088]/20 flex items-center justify-center">
          <Wallet className="w-12 h-12 text-[#E60012] dark:text-red-400" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-4 border-white dark:border-gray-900">
          <FileX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No budget allocations</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
        There are no budget allocations to display. Try changing the term or company filter, or allocations will appear here once they are created.
      </p>
    </div>
  </div>
);

import React from 'react';

export const DealerCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 sm:p-7 space-y-6 animate-pulse overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Stats Section - Two columns side by side */}
      <div className="flex w-full items-start gap-4 sm:gap-5">
        {/* Left Column - Plans and Activities */}
        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-5 w-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-5 w-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-5 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-5 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>

        {/* Right Column - Cost Section with cream background */}
        <div className="bg-gradient-to-br from-[#FEF3E2] dark:from-amber-900/20 via-[#FDF6EC] dark:via-amber-900/15 to-[#FEF3E2] dark:to-amber-900/20 flex-1 space-y-3 px-4 py-4 rounded-xl">
          <div className="flex justify-between items-center">
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="h-px bg-[#F3E5D1] dark:bg-amber-800/30"></div>
          <div className="flex justify-between items-center pt-1">
            <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

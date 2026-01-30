import React from 'react';

export const DealerEfficiencyChartSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-[24px] p-6 md:p-8 shadow-[0px_4px_16px_rgba(0,0,0,0.06)] border-2 border-gray-100 dark:border-gray-800 animate-fade-in">
      {/* Header Skeleton */}
      <div className="mb-6">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>

      {/* Chart Circle Skeleton */}
      <div className="flex items-center justify-center py-8">
        <div className="relative w-48 h-48 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      </div>

      {/* Legend Skeleton */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

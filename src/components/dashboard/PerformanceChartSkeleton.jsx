import React from 'react';

export const PerformanceChartSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-[24px] p-6 md:p-8 shadow-[0px_4px_16px_rgba(0,0,0,0.06)] border-2 border-gray-100 dark:border-gray-800 animate-fade-in">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="h-6 w-56 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="flex gap-2">
          <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="h-9 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Chart Area Skeleton */}
      <div className="relative h-80 flex items-end justify-between gap-4 pt-8">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 dark:text-gray-500 pr-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>

        {/* Bars */}
        <div className="flex-1 flex items-end justify-around gap-2 ml-16">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex-1 flex gap-1 items-end">
              <div 
                className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-t-lg animate-pulse" 
                style={{ height: `${Math.random() * 60 + 20}%` }}
              ></div>
              <div 
                className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-t-lg animate-pulse" 
                style={{ height: `${Math.random() * 60 + 20}%` }}
              ></div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend Skeleton */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

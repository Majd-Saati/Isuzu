import React from 'react';

export const BudgetsTableSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 overflow-hidden rounded-[20px] shadow-[0px_4px_16px_rgba(0,0,0,0.06)] border-2 border-gray-100 dark:border-gray-800 animate-fade-in">
      {/* Table Header */}
      <div className="grid grid-cols-5 border-b-2 border-gray-200 dark:border-gray-700 bg-gradient-to-b from-gray-50 dark:from-gray-800 to-white dark:to-gray-900">
        <div className="px-8 py-5">
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="px-8 py-5">
          <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="px-8 py-5">
          <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="px-8 py-5">
          <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="px-8 py-5">
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Table Body Skeleton */}
      <div>
        {[...Array(5)].map((_, index) => (
          <div 
            key={index}
            className={`grid grid-cols-5 ${index < 4 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}
          >
            {/* Dealer Column */}
            <div className="px-8 py-10 flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>

            {/* Q1 Column */}
            <div className="px-8 py-10 flex items-center">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>

            {/* Q2 Column */}
            <div className="px-8 py-10 flex items-center">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>

            {/* Q3 Column */}
            <div className="px-8 py-10 flex items-center">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>

            {/* Total Column */}
            <div className="px-8 py-10 bg-gradient-to-r from-[#FFF9E6] dark:from-gray-800 to-[#FFFDF5] dark:to-gray-700 flex items-center border-l-2 border-[#FFE49E] dark:border-gray-700">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

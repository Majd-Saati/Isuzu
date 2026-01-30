import React from 'react';

export const AdministratorsTableSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 overflow-hidden rounded-3xl shadow-[0px_4px_16px_rgba(0,0,0,0.06)] border-2 border-gray-100 dark:border-gray-800 animate-fade-in">
      {/* Table Header - Desktop Only */}
      <div className="hidden lg:grid grid-cols-5 bg-gradient-to-b from-gray-50 dark:from-gray-800 to-white dark:to-gray-900 border-b-2 border-gray-200 dark:border-gray-700">
        <div className="px-8 py-5">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="px-8 py-5 border-l border-gray-200 dark:border-gray-700">
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="px-8 py-5 border-l border-gray-200 dark:border-gray-700">
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="px-8 py-5 border-l border-gray-200 dark:border-gray-700">
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="px-8 py-5 border-l border-gray-200 dark:border-gray-700">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Table Body Skeleton */}
      <div>
        {[...Array(5)].map((_, index) => (
          <div key={index}>
            {/* Desktop View */}
            <div className={`hidden lg:grid grid-cols-5 ${index < 4 ? 'border-t border-gray-200 dark:border-gray-700' : ''}`}>
              {/* Administrator Column */}
              <div className="px-8 py-8 flex items-center gap-4 border-l border-gray-200 dark:border-gray-700">
                <div className="w-11 h-11 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>

              {/* Role Column */}
              <div className="px-8 py-8 flex items-center border-l border-gray-200 dark:border-gray-700">
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>

              {/* Assigned Column */}
              <div className="px-8 py-8 flex items-center border-l border-gray-200 dark:border-gray-700">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>

              {/* Status Column */}
              <div className="px-8 py-8 flex items-center border-l border-gray-200 dark:border-gray-700">
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              </div>

              {/* Permissions Column */}
              <div className="px-8 py-8 flex items-center gap-2 border-l border-gray-200 dark:border-gray-700">
                <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              </div>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className={`lg:hidden p-6 ${index < 4 ? 'border-t border-gray-200 dark:border-gray-700' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <div>
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                    <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="px-8 py-6 border-t-2 border-gray-200 dark:border-gray-700 bg-gradient-to-b from-white dark:from-gray-900 to-gray-50 dark:to-gray-800">
        <div className="flex items-center justify-between">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

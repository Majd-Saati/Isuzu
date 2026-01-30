import React from 'react';

export const OverviewTableSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      {/* Desktop Skeleton */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Dealer</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Action</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Cost</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Duration</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="border-b border-gray-50 dark:border-gray-700">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </td>
                <td className="py-4 px-6">
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                </td>
                <td className="py-4 px-6">
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Skeleton */}
      <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

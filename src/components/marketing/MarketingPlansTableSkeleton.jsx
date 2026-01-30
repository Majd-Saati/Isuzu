import React from 'react';

export const MarketingPlansTableSkeleton = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {[...Array(2)].map((_, planIndex) => (
        <div key={planIndex} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border-2 border-gray-200 dark:border-gray-800">
          {/* Plan Header Skeleton */}
          <div className="w-full flex items-center gap-3 px-6 py-5 border-b-2 border-gray-200 dark:border-gray-700">
            <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-5 w-20 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse"></div>
              </div>
              <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2"></div>
            </div>
            <div className="h-9 w-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
          </div>

          {/* Table Header Skeleton */}
          <div className="bg-gray-50/70 dark:bg-gray-800/70 border-b-2 border-gray-200 dark:border-gray-700">
            <table className="w-full table-fixed">
              <thead>
                <tr>
                  <th className="w-12 py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700">
                    <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </th>
                  <th className="text-left py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700 w-[250px]">
                    <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </th>
                  <th className="text-left py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700 w-24">
                    <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </th>
                  <th className="text-left py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700 w-40">
                    <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </th>
                  <th className="text-left py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700 w-36">
                    <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </th>
                  <th className="text-left py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700 w-36">
                    <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </th>
                  <th className="text-left py-4 px-6 w-32">
                    <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </th>
                </tr>
              </thead>
            </table>
          </div>

          {/* Table Rows Skeleton */}
          <table className="w-full table-fixed">
            <tbody>
              {[...Array(3)].map((_, rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="w-12 py-5 px-6 border-r border-gray-100 dark:border-gray-700">
                    <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </td>
                  <td className="py-5 px-6 border-r border-gray-100 dark:border-gray-700 w-[250px]">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </td>
                  <td className="py-5 px-6 border-r border-gray-100 dark:border-gray-700 w-24">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  </td>
                  <td className="py-5 px-6 border-r border-gray-100 dark:border-gray-700 w-40">
                    <div className="space-y-1">
                      <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </td>
                  <td className="py-5 px-6 border-r border-gray-100 dark:border-gray-700 w-36">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                      <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </td>
                  <td className="py-5 px-6 border-r border-gray-100 dark:border-gray-700 w-36">
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </td>
                  <td className="py-5 px-6 w-32">
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

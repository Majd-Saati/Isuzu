import React from 'react';

export const ReportingTableSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-[24px] p-6 md:p-8 shadow-[0px_4px_16px_rgba(0,0,0,0.06)] border-2 border-gray-100 dark:border-gray-800 animate-fade-in">
      {/* Header Skeleton */}
      <div className="mb-6">
        <div className="h-7 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>

      {/* Table Skeleton */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200 dark:border-gray-700">
              <th className="text-left py-4 px-4 w-32">
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </th>
              <th className="text-left py-4 px-4">
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </th>
              <th className="text-left py-4 px-4 w-48">
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </th>
              <th className="text-left py-4 px-4 w-40">
                <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </th>
              <th className="text-center py-4 px-4 w-24">
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto"></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(8)].map((_, index) => (
              <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-4 px-4">
                  {index % 3 === 0 && (
                    <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  )}
                </td>
                <td className="py-4 px-4">
                  <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </td>
                <td className="py-4 px-4">
                  <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                </td>
                <td className="py-4 px-4">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex justify-center">
                    <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

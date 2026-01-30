import React from 'react';

export const UsersTableSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden animate-pulse">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/70 dark:bg-gray-800/70 border-b-2 border-gray-200 dark:border-gray-700">
            <tr>
              <th className="text-left px-6 py-4 border-r-2 border-gray-200 dark:border-gray-700">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
              </th>
              <th className="text-left px-6 py-4 border-r-2 border-gray-200 dark:border-gray-700">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
              </th>
              <th className="text-left px-6 py-4 border-r-2 border-gray-200 dark:border-gray-700">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
              </th>
              <th className="text-left px-6 py-4 border-r-2 border-gray-200 dark:border-gray-700">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-14"></div>
              </th>
              <th className="text-left px-6 py-4 border-r-2 border-gray-200 dark:border-gray-700">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
              </th>
              <th className="text-left px-6 py-4 border-r-2 border-gray-200 dark:border-gray-700">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
              </th>
              <th className="text-center px-6 py-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16 mx-auto"></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-gray-200 dark:divide-gray-700">
            {[...Array(5)].map((_, index) => (
              <tr key={index}>
                <td className="px-6 py-4 border-r-2 border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-28"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 border-r-2 border-gray-200 dark:border-gray-700">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-36"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                  </div>
                </td>
                <td className="px-6 py-4 border-r-2 border-gray-200 dark:border-gray-700">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
                </td>
                <td className="px-6 py-4 border-r-2 border-gray-200 dark:border-gray-700">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg w-14"></div>
                </td>
                <td className="px-6 py-4 border-r-2 border-gray-200 dark:border-gray-700">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg w-16"></div>
                </td>
                <td className="px-6 py-4 border-r-2 border-gray-200 dark:border-gray-700">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between px-6 py-4 border-t-2 border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
        </div>
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-9 h-9 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

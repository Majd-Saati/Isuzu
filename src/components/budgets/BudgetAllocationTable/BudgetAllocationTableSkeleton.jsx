import React from 'react';

export const BudgetAllocationTableSkeleton = () => (
  <div className="bg-white dark:bg-gray-900 rounded-[24px] p-6 md:p-8 shadow-[0px_4px_16px_rgba(0,0,0,0.06)] border-2 border-gray-100 dark:border-gray-800 animate-fade-in">
    <div className="mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
        <div className="h-7 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="flex gap-3">
          <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          <div className="h-10 w-44 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
    <div className="space-y-8">
      {[1, 2].map((i) => (
        <div key={i}>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="overflow-x-auto rounded-2xl border-2 border-gray-200 dark:border-gray-700">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80">
                  {[1, 2, 3, 4, 5, 6].map((j) => (
                    <th key={j} className="py-4 px-4 md:px-6">
                      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((k) => (
                  <tr key={k} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-4 px-4 md:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      </div>
                    </td>
                    <td className="py-4 px-4 md:px-6 hidden sm:table-cell">
                      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </td>
                    <td className="py-4 px-4 md:px-6">
                      <div className="h-4 w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </td>
                    <td className="py-4 px-4 md:px-6">
                      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ml-auto" />
                    </td>
                    <td className="py-4 px-4 md:px-6 hidden md:table-cell">
                      <div className="h-4 w-14 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ml-auto" />
                    </td>
                    <td className="py-4 px-4 md:px-6 hidden lg:table-cell">
                      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  </div>
);

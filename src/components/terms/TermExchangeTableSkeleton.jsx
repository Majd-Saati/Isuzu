import React from 'react';

export const TermExchangeTableSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden animate-pulse">
      <div className="px-6 py-4 bg-gray-50/70 dark:bg-gray-800/70 border-b-2 border-gray-200 dark:border-gray-700">
        <div className="h-5 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/70 dark:bg-gray-800/70 border-b-2 border-gray-200 dark:border-gray-700">
            <tr>
              {[1, 2, 3, 4, 5].map((i) => (
                <th key={i} className="px-6 py-4 border-r-2 border-gray-200 dark:border-gray-700 last:border-r-0">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-gray-200 dark:divide-gray-700">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
              <tr key={row}>
                {[1, 2, 3, 4, 5].map((cell) => (
                  <td key={cell} className="px-6 py-4 border-r-2 border-gray-200 dark:border-gray-700 last:border-r-0">
                    <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full max-w-[120px]" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-6 py-4 border-t-2 border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <div className="h-9 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
};

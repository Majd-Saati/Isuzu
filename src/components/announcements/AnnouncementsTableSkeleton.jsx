import React from 'react';

export const AnnouncementsTableSkeleton = () => (
  <div className="overflow-hidden animate-fade-in">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
          <tr>
            {['Announcement', 'Audience', 'Recipients', 'Read / Unread', 'Date', 'Actions'].map((h) => (
              <th key={h} className="text-left px-6 py-3.5">
                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {[...Array(6)].map((_, index) => (
            <tr key={index}>
              <td className="px-6 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-3.5 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-3 w-56 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
              </td>
              <td className="px-6 py-4">
                <div className="h-3.5 w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </td>
              <td className="px-6 py-4">
                <div className="h-3.5 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </td>
              <td className="px-6 py-4">
                <div className="h-3.5 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </td>
              <td className="px-6 py-4">
                <div className="w-8 h-8 mx-auto bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Pagination skeleton */}
    <div className="flex items-center justify-between px-6 py-4 border-t-2 border-gray-200 dark:border-gray-700">
      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    </div>
  </div>
);

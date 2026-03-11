import React from 'react';

export const BudgetAllocationTableHeader = () => (
  <thead>
    <tr className="border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80">
      <th className="text-left py-4 px-4 md:px-6 text-[#4A5568] dark:text-gray-300 text-xs font-semibold uppercase tracking-wide">
        Company
      </th>
      <th className="text-left py-4 px-4 md:px-6 text-[#4A5568] dark:text-gray-300 text-xs font-semibold uppercase tracking-wide hidden sm:table-cell">
        Country
      </th>
      <th className="text-left py-4 px-4 md:px-6 text-[#4A5568] dark:text-gray-300 text-xs font-semibold uppercase tracking-wide">
        Currency
      </th>
      <th className="text-right py-4 px-4 md:px-6 text-[#4A5568] dark:text-gray-300 text-xs font-semibold uppercase tracking-wide">
        Allocated
      </th>
      <th className="text-right py-4 px-4 md:px-6 text-[#4A5568] dark:text-gray-300 text-xs font-semibold uppercase tracking-wide hidden md:table-cell">
        Support used
      </th>
      <th className="text-left py-4 px-4 md:px-6 text-[#4A5568] dark:text-gray-300 text-xs font-semibold uppercase tracking-wide hidden lg:table-cell">
        Created
      </th>
      <th className="text-center py-4 px-4 md:px-6 text-[#4A5568] dark:text-gray-300 text-xs font-semibold uppercase tracking-wide w-14">
        Actions
      </th>
    </tr>
  </thead>
);

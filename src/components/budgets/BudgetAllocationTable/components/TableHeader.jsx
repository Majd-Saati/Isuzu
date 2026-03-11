import React from 'react';

export const BudgetAllocationTableHeader = () => (
  <thead>
    <tr className="bg-gray-50 dark:bg-gray-800/80">
      <th className="text-left py-3.5 px-4 md:px-6 text-[#4A5568] dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
        Company
      </th>
      <th className="text-left py-3.5 px-4 md:px-6 text-[#4A5568] dark:text-gray-400 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">
        Country
      </th>
      <th className="text-left py-3.5 px-4 md:px-6 text-[#4A5568] dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
        Currency
      </th>
      <th className="text-right py-3.5 px-4 md:px-6 text-[#4A5568] dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
        Allocated
      </th>
      <th className="text-right py-3.5 px-4 md:px-6 text-[#4A5568] dark:text-gray-400 text-xs font-semibold uppercase tracking-wider hidden md:table-cell">
        Support used
      </th>
      <th className="text-left py-3.5 px-4 md:px-6 text-[#4A5568] dark:text-gray-400 text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">
        Created
      </th>
      <th className="text-center py-3.5 px-4 md:px-6 text-[#4A5568] dark:text-gray-400 text-xs font-semibold uppercase tracking-wider w-14">
        Actions
      </th>
    </tr>
  </thead>
);

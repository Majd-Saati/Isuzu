import React from 'react';

export const TableHeader = () => {
  return (
    <thead>
      <tr className="border-b-2 border-gray-200 dark:border-gray-700">
        <th className="text-left py-4 px-4 text-[#4A5568] dark:text-gray-300 text-sm font-medium w-32">
          Month
        </th>
        <th className="text-left py-4 px-4 text-[#4A5568] dark:text-gray-300 text-sm font-medium">
          Company
        </th>
        <th className="text-left py-4 px-4 text-[#4A5568] dark:text-gray-300 text-sm font-medium">
          Plan
        </th>
        <th className="text-left py-4 px-4 text-[#4A5568] dark:text-gray-300 text-sm font-medium">
          Activity
        </th>
        <th className="text-right py-4 px-4 text-[#4A5568] dark:text-gray-300 text-sm font-medium w-40">
          Actual Cost
        </th>
        <th className="text-right py-4 px-4 text-[#4A5568] dark:text-gray-300 text-sm font-medium w-40">
          Support Cost
        </th>
        <th className="text-center py-4 px-4 text-[#4A5568] dark:text-gray-300 text-sm font-medium w-24">
          Evidences
        </th>
      </tr>
    </thead>
  );
};


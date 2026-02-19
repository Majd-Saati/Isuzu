import React from 'react';
import { Plus } from 'lucide-react';

export const AddActivityRow = ({ onClick, showBudgetColumns, showMediaUploadColumns }) => {
  return (
    <tr 
      onClick={onClick}
      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
    >
      <td className="py-4 px-6 w-12"></td>
      <td className="py-4 px-6 w-[250px]">
        <div className="flex items-center gap-2">
          <Plus className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Add item
          </span>
        </div>
      </td>
      <td className="py-4 px-6 w-24"></td>
      <td className="py-4 px-6 w-40"></td>
      <td className="py-4 px-6 w-36"></td>
      <td className="py-4 px-6 w-44"></td>
      {showBudgetColumns && (
        <>
          <td className="py-4 px-6 w-32"></td>
          <td className="py-4 px-6 w-32"></td>
          <td className="py-4 px-6 w-32"></td>
          <td className="py-4 px-6 w-32"></td>
        </>
      )}
      {showMediaUploadColumns && (
        <>
          <td className="py-4 px-6 w-28"></td>
          <td className="py-4 px-6 w-28"></td>
        </>
      )}
    </tr>
  );
};


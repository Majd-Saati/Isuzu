import React from 'react';
import { FileText } from 'lucide-react';
import { formatCurrency } from '../utils';

export const TableRow = ({ row, monthLabel, isFirstInMonth, onOpenEvidences }) => {
  return (
    <tr className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200">
      {/* Month column - only show for first row of each month */}
      <td className="py-4 px-4">
        {isFirstInMonth && (
          <div className="text-[#1F2937] dark:text-gray-200 text-base font-semibold">
            {monthLabel}
          </div>
        )}
      </td>

      {/* Company */}
      <td className="py-4 px-4">
        <div className="text-[#6B7280] dark:text-gray-300 text-sm font-medium">
          {row.company_name}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {row.currency}
        </div>
      </td>

      {/* Plan */}
      <td className="py-4 px-4">
        <div className="text-[#6B7280] dark:text-gray-300 text-sm">
          {row.plan_name}
        </div>
      </td>

      {/* Activity */}
      <td className="py-4 px-4">
        <div className="text-[#6B7280] dark:text-gray-300 text-sm">
          {row.activity_name}
        </div>
      </td>

      {/* Actual Cost */}
      <td className="py-4 px-4 text-right">
        <div className="text-[#1F2937] dark:text-gray-200 text-sm font-semibold">
          {formatCurrency(row.actual_cost)}
        </div>
      </td>

      {/* Support Cost */}
      <td className="py-4 px-4 text-right">
        <div className="text-[#1F2937] dark:text-gray-200 text-sm font-semibold">
          {formatCurrency(row.support_cost)}
        </div>
      </td>

      {/* Evidences */}
      <td className="py-4 px-4">
        <div className="flex justify-center">
          {row.evidences && row.evidences.length > 0 ? (
            <button 
              onClick={() => onOpenEvidences(row.evidences, row.activity_name, row.activity_id)}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-[#3B82F6] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
            >
              <FileText className="w-4 h-4" />
              <span className="text-xs font-medium">{row.evidences.length}</span>
            </button>
          ) : (
            <span className="text-xs text-gray-400 dark:text-gray-500">—</span>
          )}
        </div>
      </td>
    </tr>
  );
};



import React from 'react';
import { Calendar } from 'lucide-react';
import { BudgetAllocationTableHeader } from './TableHeader';
import { AllocationRow } from './AllocationRow';
import { formatDate } from '../utils';

export const TermSection = ({ term, onDeleteAllocation }) => {
  const allocations = term.allocations ?? [];
  const hasAllocations = allocations.length > 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden last:mb-0">
      <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/60 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#E60012]/10 dark:bg-[#E60012]/20 border border-[#E60012]/20 dark:border-[#E60012]/40 shadow-sm">
            <Calendar className="w-4 h-4 text-[#E60012] dark:text-red-400 flex-shrink-0" />
            <span className="text-sm font-bold text-[#E60012] dark:text-red-400">{term.term_name}</span>
          </div>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {formatDate(term.start_date)} – {formatDate(term.end_date)}
          </span>
        </div>
      </div>

      {!hasAllocations ? (
        <div className="py-12 px-6 text-center border-t border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">No allocations for this term.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[600px]">
            <BudgetAllocationTableHeader />
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {allocations.map((allocation) => (
                <AllocationRow
                  key={allocation.id}
                  allocation={allocation}
                  onDelete={onDeleteAllocation}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

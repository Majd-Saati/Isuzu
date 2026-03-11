import React from 'react';
import { Calendar } from 'lucide-react';
import { BudgetAllocationTableHeader } from './TableHeader';
import { AllocationRow } from './AllocationRow';
import { formatDate } from '../utils';

export const TermSection = ({ term, onDeleteAllocation }) => {
  const allocations = term.allocations ?? [];
  const hasAllocations = allocations.length > 0;

  return (
    <div className="mb-8 last:mb-0">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#E60012]/10 dark:bg-[#E60012]/20 border border-[#E60012]/30 dark:border-[#E60012]/40">
          <Calendar className="w-4 h-4 text-[#E60012] dark:text-red-400 flex-shrink-0" />
          <span className="text-sm font-bold text-[#E60012] dark:text-red-400">{term.term_name}</span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formatDate(term.start_date)} – {formatDate(term.end_date)}
        </span>
      </div>

      {!hasAllocations ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 py-8 px-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">No allocations for this term.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <table className="w-full border-collapse min-w-[600px]">
            <BudgetAllocationTableHeader />
            <tbody>
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

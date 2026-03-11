import React from 'react';
import { Building2 } from 'lucide-react';

export const BudgetAllocationFilters = ({
  companyId,
  companies,
  onCompanyChange,
  isAdmin,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3 md:gap-4">
      {isAdmin && (
        <div className="flex items-center gap-2 min-w-0">
          <Building2 className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
          <select
            value={companyId}
            onChange={(e) => onCompanyChange(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E60012]/50 focus:border-[#E60012] min-w-[160px] max-w-full cursor-pointer"
          >
            <option value="">All companies</option>
            {(companies || []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name || `Company ${c.id}`}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

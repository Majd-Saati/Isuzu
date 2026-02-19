import React from 'react';
import { AlertCircle } from 'lucide-react';

export const CalendarFilters = ({ 
  selectedTermId, 
  setSelectedTermId, 
  selectedCompanyId, 
  setSelectedCompanyId,
  terms = [],
  companies = [],
  isAdmin = true
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-sm p-5">
      <div className="flex flex-wrap items-end gap-4">
        {/* Term Selection */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Select Term <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedTermId || ''}
            onChange={(e) => setSelectedTermId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E60012] dark:focus:ring-red-500 focus:border-[#E60012] dark:focus:border-red-500 transition-all"
          >
            <option value="">Choose a term...</option>
            {terms.map((term) => (
              <option key={term.id} value={term.id}>
                {term.name}
              </option>
            ))}
          </select>
        </div>

        {/* Company Selection - Only show for admin users */}
        {isAdmin && (
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Select Company <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedCompanyId || ''}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E60012] dark:focus:ring-red-500 focus:border-[#E60012] dark:focus:border-red-500 transition-all"
            >
              <option value="">Choose a company...</option>
              <option value="all">All companies</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

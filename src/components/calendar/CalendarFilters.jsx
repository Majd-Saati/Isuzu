import React from 'react';
import { AlertCircle } from 'lucide-react';

export const CalendarFilters = ({ 
  selectedTermId, 
  setSelectedTermId, 
  selectedCompanyId, 
  setSelectedCompanyId,
  terms = [],
  companies = [],
  isAdmin = true,
  onSubmit 
}) => {
  // For admin users, both term and company (or "all") are required
  // For non-admin users, only term is required (company is auto-set)
  const isFormValid = isAdmin ? (selectedTermId && (selectedCompanyId || selectedCompanyId === 'all')) : selectedTermId;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-sm p-5">
      {!isFormValid && (
        <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <p className="text-sm text-amber-800 dark:text-amber-300">
            {isAdmin ? (
              <>Please select both a <strong>Term</strong> and a <strong>Company</strong> (or "All companies") to view calendar data.</>
            ) : (
              <>Please select a <strong>Term</strong> to view calendar data.</>
            )}
          </p>
        </div>
      )}
      
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

        {/* Submit Button */}
        <button
          onClick={onSubmit}
          disabled={!isFormValid}
          className="px-6 py-3 bg-[#E60012] text-white rounded-xl text-sm font-semibold hover:bg-[#C00010] transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-md"
        >
          Load Calendar Data
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { Search, Plus, Filter, X } from 'lucide-react';

/**
 * Action bar component for Companies page
 */
export const CompaniesActionBar = ({ onAddCompany, search = '', onSearchChange }) => {
  const handleSearchInputChange = (e) => {
    onSearchChange?.(e.target.value);
  };

  const handleClearSearch = () => {
    onSearchChange?.('');
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-sm p-5 mb-8">
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={onAddCompany}
          className="flex items-center gap-2 px-6 py-3 bg-[#E60012] text-white rounded-xl text-sm font-semibold hover:bg-[#C00010] transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Company
        </button>

        <div className="relative flex-1 min-w-[240px] max-w-[320px]">
          <input
            type="text"
            value={search}
            onChange={handleSearchInputChange}
            placeholder="Search companies..."
            className="w-full pl-11 pr-10 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E60012] focus:border-transparent transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
          {search && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:scale-105 active:scale-95">
          <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          Filter
        </button>
      </div>
    </div>
  );
};


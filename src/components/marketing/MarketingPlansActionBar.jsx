import React from 'react';
import { Plus, X } from 'lucide-react';
import { FilterDropdown } from './FilterDropdown';

/**
 * Action bar component for Marketing Plans page
 * Contains: Add Plan button, Search input, Company/Term filters
 */
export const MarketingPlansActionBar = ({
  onAddPlan,
  companyFilter,
  termFilter,
  search = '',
  onSearchChange,
  isAdmin = true, // Default to true to maintain backward compatibility
}) => {
  const handleClearSearch = () => {
    if (onSearchChange) {
      // Create a synthetic event to clear the search
      const syntheticEvent = {
        target: { value: '' }
      };
      onSearchChange(syntheticEvent);
    }
  };
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-sm p-5 mb-8">
      <div className="flex flex-wrap items-center gap-4">
        {/* Add Plan Button */}
        <button
          onClick={onAddPlan}
          className="flex items-center gap-2 px-6 py-3 bg-[#E60012] text-white rounded-xl text-sm font-semibold hover:bg-[#C00010] transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Plan
        </button>

        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px] max-w-[320px]">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={onSearchChange}
            className="w-full pl-11 pr-10 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E60012] focus:border-transparent transition-all"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {search && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 ml-auto flex-wrap">
          {/* Only show company filter if user is admin */}
          {isAdmin && (
            <FilterDropdown
              label="Company"
              selectedName={companyFilter.name}
              options={companyFilter.options}
              onSelect={companyFilter.onChange}
              onClear={companyFilter.onClear}
              clearLabel="All companies"
            />
          )}

          <FilterDropdown
            label="Term"
            selectedName={termFilter.name}
            options={termFilter.options}
            onSelect={termFilter.onChange}
            onClear={termFilter.onClear}
            clearLabel="All terms"
          />
        </div>
      </div>
    </div>
  );
};


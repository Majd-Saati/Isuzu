import React from 'react';
import { BellOff } from 'lucide-react';

/**
 * Empty state for the announcements table (no results / none sent yet).
 */
export const RemindersTableEmpty = ({ hasActiveFilters, onClearFilters }) => (
  <div className="p-12 text-center">
    <div className="w-14 h-14 mx-auto rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
      <BellOff className="w-7 h-7 text-gray-400 dark:text-gray-500" />
    </div>
    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
      {hasActiveFilters
        ? 'No announcements match your filters'
        : 'No announcements yet'}
    </h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
      {hasActiveFilters
        ? 'Try adjusting or clearing the filters to see more results.'
        : 'Choose one or more dealers above and send your first announcement.'}
    </p>
    {hasActiveFilters && (
      <button
        onClick={onClearFilters}
        className="mt-5 px-5 py-2.5 rounded-lg bg-[#E60012] text-white text-sm font-semibold hover:bg-[#C00010] transition-colors shadow-sm"
      >
        Clear Filters
      </button>
    )}
  </div>
);

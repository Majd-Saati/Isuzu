import React from 'react';
import { BellOff } from 'lucide-react';

/**
 * Empty state for the reminders table (no results / no reminders yet).
 */
export const RemindersTableEmpty = ({ hasActiveFilters, onClearFilters }) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-sm p-12 text-center">
    <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
      <BellOff className="w-8 h-8 text-gray-400 dark:text-gray-500" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
      {hasActiveFilters ? 'No reminders match your filters' : 'No reminders yet'}
    </h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
      {hasActiveFilters
        ? 'Try adjusting or clearing the filters to see more results.'
        : 'Select dealers above and send your first reminder.'}
    </p>
    {hasActiveFilters && (
      <button
        onClick={onClearFilters}
        className="mt-5 px-5 py-2.5 rounded-xl bg-[#E60012] text-white text-sm font-semibold hover:bg-[#C00010] transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
      >
        Clear Filters
      </button>
    )}
  </div>
);

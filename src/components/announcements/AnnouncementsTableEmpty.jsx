import React from 'react';
import { MegaphoneOff, AlertTriangle } from 'lucide-react';

/**
 * Empty state for the announcements table: no results for the current
 * filters, no announcements at all yet, or a failed load.
 */
export const AnnouncementsTableEmpty = ({ hasActiveFilters, onClearFilters, isError }) => (
  <div className="p-12 text-center">
    <div
      className={`w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-4 ${
        isError ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-100 dark:bg-gray-800'
      }`}
    >
      {isError ? (
        <AlertTriangle className="w-7 h-7 text-red-500 dark:text-red-400" />
      ) : (
        <MegaphoneOff className="w-7 h-7 text-gray-400 dark:text-gray-500" />
      )}
    </div>
    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
      {isError
        ? 'Failed to load announcements'
        : hasActiveFilters
        ? 'No announcements match your filters'
        : 'No announcements yet'}
    </h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
      {isError
        ? 'Something went wrong while fetching announcements. Please try again.'
        : hasActiveFilters
        ? 'Try adjusting or clearing the filters to see more results.'
        : 'Announcements sent to your dealers will show up here.'}
    </p>
    {hasActiveFilters && !isError && (
      <button
        onClick={onClearFilters}
        className="mt-5 px-5 py-2.5 rounded-lg bg-[#E60012] text-white text-sm font-semibold hover:bg-[#C00010] transition-colors shadow-sm"
      >
        Clear Filters
      </button>
    )}
  </div>
);

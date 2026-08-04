import React from 'react';
import { Search } from 'lucide-react';
import {
  REMINDER_TYPE_OPTIONS,
  REMINDER_STATUS_OPTIONS,
} from '@/data/mockRemindersData';

const selectClass =
  'px-4 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#E60012]/40 focus:border-[#E60012] transition-colors cursor-pointer';

/**
 * Filters bar for the announcements table: search + dealer / type / status.
 */
export const RemindersActionBar = ({
  dealers,
  search,
  onSearchChange,
  dealerId,
  onDealerChange,
  type,
  onTypeChange,
  status,
  onStatusChange,
  hasActiveFilters,
  onClearFilters,
}) => (
  <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 dark:border-gray-800 px-5 py-4">
    {/* Search */}
    <div className="relative flex-1 min-w-[220px] max-w-[320px]">
      <input
        type="text"
        placeholder="Search announcements..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E60012]/40 focus:border-[#E60012] transition-colors"
      />
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
    </div>

    <div className="flex items-center gap-3 ml-auto flex-wrap">
      {/* Dealer filter */}
      <select
        value={dealerId}
        onChange={(e) => onDealerChange(e.target.value)}
        aria-label="Filter by dealer"
        className={selectClass}
      >
        <option value="">All Dealers</option>
        {dealers.map((dealer) => (
          <option key={dealer.id} value={dealer.id}>
            {dealer.label}
          </option>
        ))}
      </select>

      {/* Type filter */}
      <select
        value={type}
        onChange={(e) => onTypeChange(e.target.value)}
        aria-label="Filter by type"
        className={selectClass}
      >
        <option value="">All Types</option>
        {REMINDER_TYPE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Status filter */}
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        aria-label="Filter by status"
        className={selectClass}
      >
        <option value="">All Status</option>
        {REMINDER_STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Clear Filters
        </button>
      )}
    </div>
  </div>
);

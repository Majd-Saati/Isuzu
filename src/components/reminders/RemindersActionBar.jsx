import React from 'react';
import { Search } from 'lucide-react';
import {
  REMINDER_TYPE_OPTIONS,
  REMINDER_STATUS_OPTIONS,
} from '@/data/mockRemindersData';

const selectClass =
  'px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all cursor-pointer';

/**
 * Filters bar for the reminders table: search + dealer / type / status filters.
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
  <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-sm p-5 mb-8">
    <div className="flex flex-wrap items-center gap-4">
      {/* Search */}
      <div className="relative flex-1 min-w-[240px] max-w-[320px]">
        <input
          type="text"
          placeholder="Search reminders..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E60012] focus:border-transparent transition-all"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
      </div>

      <div className="flex items-center gap-3 ml-auto flex-wrap">
        {/* Dealer filter */}
        <select
          value={dealerId}
          onChange={(e) => onDealerChange(e.target.value)}
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
            className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  </div>
);

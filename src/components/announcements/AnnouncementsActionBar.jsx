import React from 'react';
import { Search } from 'lucide-react';

const selectClass =
  'px-4 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#E60012]/40 focus:border-[#E60012] transition-colors cursor-pointer';

const AUDIENCE_OPTIONS = [
  { value: '1', label: 'All dealers' },
  { value: '0', label: 'Specific company' },
];

/**
 * Filters bar for the announcements table: search + company / audience / unread-only.
 */
export const AnnouncementsActionBar = ({
  companies,
  search,
  onSearchChange,
  companyId,
  onCompanyChange,
  forAll,
  onForAllChange,
  unreadOnly,
  onUnreadOnlyChange,
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
      {/* Company filter */}
      <select
        value={companyId}
        onChange={(e) => onCompanyChange(e.target.value)}
        aria-label="Filter by company"
        className={selectClass}
      >
        <option value="">All Companies</option>
        {companies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </select>

      {/* Audience filter */}
      <select
        value={forAll}
        onChange={(e) => onForAllChange(e.target.value)}
        aria-label="Filter by audience"
        className={selectClass}
      >
        <option value="">All Audiences</option>
        {AUDIENCE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Unread only */}
      <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
        <input
          type="checkbox"
          checked={unreadOnly}
          onChange={(e) => onUnreadOnlyChange(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-[#E60012] focus:ring-[#E60012]/40"
        />
        Unread only
      </label>

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

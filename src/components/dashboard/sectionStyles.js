/**
 * Shared section and filter bar styles for Dashboard and Charts pages.
 */

/** Container for section filter bars (company, period, year, etc.) */
export const SECTION_FILTERS_CLASS =
  'flex flex-wrap items-center gap-4 p-4 md:p-5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700';

/** Wrapper for a single filter group (icon + label + control) */
export const SECTION_FILTER_ICON_BOX_CLASS =
  'p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600';

/** Icon color (brand) */
export const SECTION_FILTER_ICON_CLASS = 'w-4 h-4 text-[#E60012] dark:text-red-400';

/** Label above a control */
export const SECTION_FILTER_LABEL_CLASS =
  'text-xs font-medium text-gray-500 dark:text-gray-400 mb-1';

/** Standard select in filter bars */
export const SECTION_FILTER_SELECT_CLASS =
  'px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E60012]/50 focus:border-[#E60012] min-w-[140px] cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors';

/** Divider between filter groups (e.g. border-left) */
export const SECTION_FILTER_DIVIDER_CLASS =
  'border-l border-gray-300 dark:border-gray-600 pl-4';

/**
 * Single source of truth for the color assigned to each budget type on the
 * calendar page, so the summary cards and the calendar month slots always match.
 *
 * The three cost types reuse the colors the Marketing Plans budget cards use
 * (see ActivityDrawer/components/BudgetCard.jsx): estimated = blue,
 * actual = emerald, support = purple. Allocated Budget has no Marketing Plans
 * equivalent and takes amber so it never reads as a support cost.
 */
export const BUDGET_TYPE_COLORS = {
  estimated: {
    gradient: 'from-blue-50 to-white',
    darkGradient: 'dark:from-gray-800 dark:to-gray-900',
    border: 'border-blue-100',
    darkBorder: 'dark:border-gray-700',
    textColor: 'text-blue-600',
    darkTextColor: 'dark:text-blue-400',
    bgColor: 'bg-blue-100',
    darkBgColor: 'dark:bg-gray-700',
    dotColor: 'bg-blue-600',
    darkDotColor: 'dark:bg-blue-400',
    // Tint used behind the value inside a calendar month slot
    slotBgColor: 'bg-blue-50',
    darkSlotBgColor: 'dark:bg-blue-900/20',
  },
  actual: {
    gradient: 'from-emerald-50 to-white',
    darkGradient: 'dark:from-gray-800 dark:to-gray-900',
    border: 'border-emerald-100',
    darkBorder: 'dark:border-gray-700',
    textColor: 'text-emerald-600',
    darkTextColor: 'dark:text-emerald-400',
    bgColor: 'bg-emerald-100',
    darkBgColor: 'dark:bg-gray-700',
    dotColor: 'bg-emerald-600',
    darkDotColor: 'dark:bg-emerald-400',
    slotBgColor: 'bg-emerald-50',
    darkSlotBgColor: 'dark:bg-emerald-900/20',
  },
  support: {
    gradient: 'from-purple-50 to-white',
    darkGradient: 'dark:from-gray-800 dark:to-gray-900',
    border: 'border-purple-100',
    darkBorder: 'dark:border-gray-700',
    textColor: 'text-purple-600',
    darkTextColor: 'dark:text-purple-400',
    bgColor: 'bg-purple-100',
    darkBgColor: 'dark:bg-gray-700',
    dotColor: 'bg-purple-600',
    darkDotColor: 'dark:bg-purple-400',
    slotBgColor: 'bg-purple-50',
    darkSlotBgColor: 'dark:bg-purple-900/20',
  },
  allocated: {
    gradient: 'from-amber-50 to-white',
    darkGradient: 'dark:from-gray-800 dark:to-gray-900',
    border: 'border-amber-100',
    darkBorder: 'dark:border-gray-700',
    textColor: 'text-amber-600',
    darkTextColor: 'dark:text-amber-400',
    bgColor: 'bg-amber-100',
    darkBgColor: 'dark:bg-gray-700',
    dotColor: 'bg-amber-600',
    darkDotColor: 'dark:bg-amber-400',
    slotBgColor: 'bg-amber-50',
    darkSlotBgColor: 'dark:bg-amber-900/20',
  },
};

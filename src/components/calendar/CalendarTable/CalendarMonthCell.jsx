import React from 'react';
import { formatCurrency } from '../utils/calendarUtils';
import { BUDGET_TYPE_COLORS } from '../budgetTypeColors';

/** Slots share the summary cards' color per budget type (see budgetTypeColors). */
const SLOTS = [
  { key: 'estimated_cost', label: 'Estimated', colors: BUDGET_TYPE_COLORS.estimated },
  { key: 'actual_cost', label: 'Actual', colors: BUDGET_TYPE_COLORS.actual },
  { key: 'support_cost', label: 'Support', colors: BUDGET_TYPE_COLORS.support },
];

export const CalendarMonthCell = ({ monthData, isAdmin, currencyCode }) => {
  const values = SLOTS.map((slot) => ({
    ...slot,
    value: parseFloat(monthData?.[slot.key]) || 0,
  }));
  const hasData = values.some((slot) => slot.value > 0);

  if (!hasData) {
    return <span className="text-xs text-gray-400 dark:text-gray-600">—</span>;
  }

  return (
    <div className="text-center space-y-1.5">
      {values
        .filter((slot) => slot.value > 0)
        .map((slot) => (
          <div
            key={slot.key}
            className={`text-xs font-semibold px-2 py-1 rounded ${slot.colors.textColor} ${slot.colors.darkTextColor} ${slot.colors.slotBgColor} ${slot.colors.darkSlotBgColor}`}
          >
            {slot.label}: {formatCurrency(slot.value, isAdmin, currencyCode)}
          </div>
        ))}
    </div>
  );
};

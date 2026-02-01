import React from 'react';
import { Calendar, ChevronDown, AlertCircle } from 'lucide-react';

const MONTH_INPUT_CLASS =
  'w-full px-2.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#E60012]/50 focus:ring-1 focus:ring-[#E60012]/30 transition-all';

const ERROR_CLASS = 'text-xs text-red-600 dark:text-red-400 mt-1';

export function MonthlyBreakdownSection({
  termMonths,
  monthsBreakdown,
  showMonthsBreakdown,
  onToggleBreakdown,
  onDistributeEvenly,
  onMonthValueChange,
  breakdownTotal,
  totalValue,
  breakdownValidation,
  breakdownErrors = {},
}) {
  const valueNum = parseFloat(totalValue) || 0;
  const showSection = termMonths.length > 0 && valueNum > 0;

  if (!showSection) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onToggleBreakdown}
          className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-[#E60012] transition-colors"
        >
          <Calendar className="w-3.5 h-3.5" />
          Monthly Breakdown
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${showMonthsBreakdown ? 'rotate-180' : ''}`}
          />
        </button>
        {showMonthsBreakdown && (
          <button
            type="button"
            onClick={onDistributeEvenly}
            className="text-xs text-[#E60012] hover:text-[#B91C1C] font-medium"
          >
            Distribute evenly
          </button>
        )}
      </div>

      {showMonthsBreakdown && (
        <div className="bg-white dark:bg-gray-900 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-3 space-y-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Allocate the budget across each month of the activity period. Total must not
            exceed {valueNum.toLocaleString()}.
          </p>

          <div className="grid grid-cols-2 gap-2">
            {termMonths.map((month) => {
              const error = breakdownErrors[month.key];
              return (
                <div key={month.key} className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {month.label}
                  </label>
                  <input
                    type="number"
                    value={monthsBreakdown[month.key] || ''}
                    onChange={(e) =>
                      onMonthValueChange(month.key, e.target.value)
                    }
                    placeholder="0"
                    min="0"
                    className={`${MONTH_INPUT_CLASS} ${error ? 'border-red-500 dark:border-red-400 focus:border-red-500 focus:ring-red-500/30' : ''}`}
                    aria-invalid={!!error}
                    aria-describedby={error ? `breakdown-error-${month.key}` : undefined}
                  />
                  {error && (
                    <span id={`breakdown-error-${month.key}`} className={ERROR_CLASS} role="alert">
                      {error}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div
            className={`flex items-center justify-between text-xs pt-2 border-t border-gray-100 dark:border-gray-700 ${
              !breakdownValidation.isValid
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <span>Monthly Total:</span>
            <span className="font-semibold">
              {breakdownTotal.toLocaleString()} / {valueNum.toLocaleString()}
            </span>
          </div>

          {!breakdownValidation.isValid && (
            <div className="flex items-start gap-1.5 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span>{breakdownValidation.message}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

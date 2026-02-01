import React from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

const DROPDOWN_BUTTON_CLASS =
  'w-full px-3 py-2.5 rounded-lg bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 text-sm text-left flex items-center justify-between focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 transition-all';

const DROPDOWN_MENU_CLASS =
  'absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl z-[10000] overflow-hidden';

const OPTION_BUTTON_BASE =
  'w-full px-3 py-2.5 text-left text-sm transition-colors';

export function BudgetTypeDropdown({
  typeOptions,
  selectedType,
  showTypeDropdown,
  onToggleDropdown,
  onSelectType,
  validationError,
  onBlurClose,
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        Type *
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={onToggleDropdown}
          onBlur={() => setTimeout(onBlurClose, 200)}
          className={DROPDOWN_BUTTON_CLASS}
        >
          <span
            className={
              selectedType?.color || 'text-gray-900 dark:text-gray-100'
            }
          >
            {selectedType?.label || 'Select type'}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`}
          />
        </button>
        {showTypeDropdown && (
          <div className={DROPDOWN_MENU_CLASS}>
            {typeOptions.map((option) => {
              const isDisabled = !option.canAdd;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    if (!isDisabled) onSelectType(option.value);
                  }}
                  disabled={isDisabled}
                  title={isDisabled ? option.reason : ''}
                  className={`${OPTION_BUTTON_BASE} ${
                    isDisabled
                      ? 'opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-600'
                      : `hover:bg-gray-50 dark:hover:bg-gray-800 ${option.color}`
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    {isDisabled && (
                      <AlertCircle className="w-4 h-4 text-gray-400 dark:text-gray-600 ml-2" />
                    )}
                  </div>
                  {isDisabled && option.reason && (
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-1 italic">
                      {option.reason}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
      {validationError && (
        <div className="mt-1.5 flex items-start gap-1.5 text-xs text-red-600 dark:text-red-400">
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export const CustomDropdown = ({
  label,
  placeholder,
  selectedValue,
  isOpen,
  onToggle,
  onClose,
  options,
  onSelect,
  error,
  touched,
  disabled = false,
  isLoading = false,
  optionalLabel = null,
  className = '',
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label} {optionalLabel && <span className="text-gray-400 font-normal">{optionalLabel}</span>}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={onToggle}
          onBlur={() => setTimeout(onClose, 200)}
          disabled={disabled || isLoading}
          className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 ${
            error && touched
              ? 'border-red-500 dark:border-red-500'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          } text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 focus:border-gray-400 dark:focus:border-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <span className={selectedValue ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}>
            {isLoading ? 'Loading...' : selectedValue || placeholder}
          </span>
          <ChevronDown className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && !isLoading && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl z-[10000] max-h-48 overflow-y-auto">
            {options.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                No options available
              </div>
            ) : (
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onSelect(option)}
                  className="w-full px-4 py-3 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors first:rounded-t-xl last:rounded-b-xl"
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        )}
      </div>
      {touched && <ErrorMessage message={error} />}
    </div>
  );
};




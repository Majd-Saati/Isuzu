import React, { useState } from 'react';
import { Filter, ChevronDown } from 'lucide-react';

/**
 * Reusable filter dropdown component for marketing plans filters
 */
export const FilterDropdown = ({
  label,
  selectedName,
  options = [],
  onSelect,
  onClear,
  clearLabel = 'All',
  getOptionId = (opt) => opt.id,
  getOptionName = (opt) => opt.name,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    if (option === null) {
      onClear();
    } else {
      onSelect(getOptionId(option), getOptionName(option));
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="flex items-center gap-2.5 px-5 py-3 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
      >
        <Filter className="w-4 h-4" />
        <span className="hidden sm:inline">
          {selectedName || label}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-40 max-h-64 overflow-y-auto">
          <button
            type="button"
            onClick={() => handleSelect(null)}
            className="w-full px-4 py-3 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-xl"
          >
            {clearLabel}
          </button>
          {options.map((option) => (
            <button
              key={getOptionId(option)}
              type="button"
              onClick={() => handleSelect(option)}
              className="w-full px-4 py-3 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {getOptionName(option)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};


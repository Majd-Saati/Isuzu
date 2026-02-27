import React from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

const formatTermDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const TermDropdownField = ({
  terms,
  selectedTermName,
  isOpen,
  position,
  triggerRef,
  hasError,
  showError,
  errorMessage,
  onToggle,
  onClose,
  onSelect,
}) => (
  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      Term
    </label>
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={onToggle}
        onBlur={() => setTimeout(onClose, 200)}
        className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 ${
          hasError ? 'border-red-500 dark:border-red-600' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        } text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 focus:border-transparent transition-all`}
      >
        <span className={selectedTermName ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}>
          {selectedTermName || 'Select term'}
        </span>
        <ChevronDown className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl z-[10001] max-h-48 overflow-y-auto transform -translate-y-full"
          style={{ top: position.top, left: position.left, width: position.width }}
        >
          {terms.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
              No terms available
            </div>
          ) : (
            terms.map((term) => (
              <button
                key={term.id}
                type="button"
                onClick={() => onSelect(term)}
                className="w-full px-4 py-3 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors first:rounded-t-xl last:rounded-b-xl"
              >
                <div className="font-medium">{term.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {formatTermDate(term.start_date)} - {formatTermDate(term.end_date)}
                </div>
              </button>
            ))
          )}
        </div>,
        document.body
      )}
    </div>
    {showError && <ErrorMessage message={errorMessage} />}
  </div>
);

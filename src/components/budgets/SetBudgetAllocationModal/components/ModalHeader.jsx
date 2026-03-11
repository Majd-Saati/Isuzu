import React from 'react';
import { X } from 'lucide-react';

export const SetBudgetAllocationModalHeader = ({ onClose, isSubmitting }) => (
  <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#E60012]/5 dark:from-[#E60012]/10 to-transparent rounded-t-2xl flex-shrink-0">
    <div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Set budget allocation</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Assign an allocation value for a term and company
      </p>
    </div>
    <button
      type="button"
      onClick={onClose}
      disabled={isSubmitting}
      className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-all hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg hover:rotate-90 duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Close"
    >
      <X className="w-5 h-5" />
    </button>
  </div>
);

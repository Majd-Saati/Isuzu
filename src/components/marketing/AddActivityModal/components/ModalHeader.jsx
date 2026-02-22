import React from 'react';
import { X } from 'lucide-react';

export const ModalHeader = ({ isEditMode, onClose, isSubmitting, formikIsSubmitting }) => {
  return (
    <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#14B8A6]/5 dark:from-[#14B8A6]/10 to-transparent">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {isEditMode ? 'Edit Activity' : 'Add New Activity'}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {isEditMode ? 'Update activity details' : 'Create a new activity for your marketing plan'}
        </p>
      </div>
      <button
        onClick={onClose}
        disabled={isSubmitting || formikIsSubmitting}
        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-all hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg hover:rotate-90 duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:rotate-0"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};



import React from 'react';
import { Loader2 } from 'lucide-react';

export const ModalFooter = ({ isEditMode, isSubmitting, formikIsSubmitting, onClose }) => {
  return (
    <div className="flex items-center justify-end gap-3 p-6 border-t-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-transparent to-gray-50/50 dark:to-gray-800/50">
      <button
        type="button"
        onClick={() => !isSubmitting && !formikIsSubmitting && onClose()}
        disabled={isSubmitting || formikIsSubmitting}
        className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all border-2 border-gray-200 dark:border-gray-700 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting || formikIsSubmitting}
        className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#E60012] hover:bg-[#C00010] transition-all shadow-md hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#E60012] disabled:hover:scale-100 flex items-center gap-2"
      >
        {(isSubmitting || formikIsSubmitting) ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {isEditMode ? 'Updating...' : 'Saving...'}
          </>
        ) : (
          isEditMode ? 'Update Activity' : 'Add Activity'
        )}
      </button>
    </div>
  );
};


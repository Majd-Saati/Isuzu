import React from 'react';
import { Send } from 'lucide-react';

export const ModalFooter = ({ onCancel, isSubmitting }) => (
  <div className="flex items-center justify-end gap-3 p-6 border-t-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-transparent to-gray-50/50 dark:to-gray-800/50 flex-shrink-0">
    <button
      type="button"
      onClick={onCancel}
      className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all border-2 border-gray-200 dark:border-gray-600 hover:scale-105 active:scale-95"
    >
      Cancel
    </button>
    <button
      type="submit"
      disabled={isSubmitting}
      className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#E60012] hover:bg-[#C00010] transition-all shadow-md hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
    >
      <Send className="w-4 h-4" />
      Send Reminder
    </button>
  </div>
);

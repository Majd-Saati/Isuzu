import React from 'react';
import { Send } from 'lucide-react';

export const ModalFooter = ({ onCancel, isSubmitting }) => (
  <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
    <button
      type="button"
      onClick={onCancel}
      className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-300 dark:border-gray-600"
    >
      Cancel
    </button>
    <button
      type="submit"
      disabled={isSubmitting}
      className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#E60012] hover:bg-[#C00010] transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
    >
      <Send className="w-4 h-4" />
      Send Announcement
    </button>
  </div>
);

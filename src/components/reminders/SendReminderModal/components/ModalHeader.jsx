import React from 'react';
import { X } from 'lucide-react';

export const ModalHeader = ({ onClose }) => (
  <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        New Announcement
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Choose the recipients and compose your message.
      </p>
    </div>
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg"
    >
      <X className="w-5 h-5" />
    </button>
  </div>
);

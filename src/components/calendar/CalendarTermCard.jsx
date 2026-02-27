import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { formatDate } from './utils/calendarUtils';

export const CalendarTermCard = ({ term }) => {
  if (!term) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900 rounded-2xl border-2 border-blue-200 dark:border-blue-800 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
          <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Term Information</h3>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between py-2 border-b border-blue-100 dark:border-blue-900/40">
          <span className="text-sm text-gray-600 dark:text-gray-400">Name</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{term.name}</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-blue-100 dark:border-blue-900/40">
          <span className="text-sm text-gray-600 dark:text-gray-400">Start Date</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatDate(term.start_date)}</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">End Date</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatDate(term.end_date)}</span>
        </div>
      </div>
    </div>
  );
};

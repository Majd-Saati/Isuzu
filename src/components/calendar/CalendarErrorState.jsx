import React from 'react';

export const CalendarErrorState = ({ message }) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-red-200 dark:border-red-800 shadow-sm p-6">
    <p className="text-sm text-red-600 dark:text-red-400">
      Error loading calendar data: {message || 'An error occurred'}
    </p>
  </div>
);

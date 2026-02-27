import React from 'react';
import { Loader2 } from 'lucide-react';

export const CalendarLoadingState = () => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-sm p-12 text-center">
    <Loader2 className="w-12 h-12 text-[#E60012] dark:text-red-400 mx-auto mb-4 animate-spin" />
    <p className="text-sm text-gray-600 dark:text-gray-400">Loading calendar data...</p>
  </div>
);

import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorState = ({ error }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-[24px] p-6 md:p-8 shadow-[0px_4px_16px_rgba(0,0,0,0.06)] border-2 border-gray-100 dark:border-gray-800 animate-fade-in">
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 dark:text-red-400 mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
          Failed to load report
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
          {error?.message || 'Please try again or select a different term.'}
        </p>
      </div>
    </div>
  );
};


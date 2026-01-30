import React from 'react';
import { Search } from 'lucide-react';

/**
 * Message section component for 404 page
 */
export const MessageSection = ({ pathname }) => (
  <div className="text-center mb-6 space-y-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Page Not Found</h2>
    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
      The page you're looking for seems to have taken a detour. Let's get you back on track.
    </p>
    {pathname && (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        <Search className="w-3 h-3" />
        <span className="font-mono truncate max-w-[200px]">{pathname}</span>
      </div>
    )}
  </div>
);


import React from 'react';
import { QUICK_LINKS } from './constants';

/**
 * Quick links component for 404 page
 */
export const QuickLinks = ({ navigate }) => (
  <div className="pt-6 border-t-2 border-gray-100 dark:border-gray-800 animate-fade-in" style={{ animationDelay: '0.8s' }}>
    <p className="text-center text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium">Quick Links</p>
    <div className="flex flex-wrap items-center justify-center gap-2">
      {QUICK_LINKS.map((link) => (
        <button
          key={link.path}
          onClick={() => navigate(link.path)}
          className="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 hover:text-[#E60012] bg-gray-50 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[#E60012] transition-all duration-200"
        >
          {link.name}
        </button>
      ))}
    </div>
  </div>
);


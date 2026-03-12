import React from 'react';

/**
 * Unified section title for Dashboard and Charts pages.
 * Bar + title + optional subtitle; optional right-side action (e.g. button).
 */
export const SectionHeader = ({ title, subtitle, children }) => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-3">
        <div className="h-8 w-1 shrink-0 rounded-full bg-gradient-to-b from-[#E60012] to-rose-500" />
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

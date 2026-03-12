import React from 'react';
import { ChevronRight } from 'lucide-react';

export const SectionNavItem = ({ id, label, isActive, onClick }) => {
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={`
        w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-xs font-medium
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-[#E60012]/50 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900
        ${isActive
          ? 'bg-[#E60012]/10 dark:bg-[#E60012]/20 text-[#E60012] dark:text-red-400 border border-[#E60012]/30 dark:border-red-500/30'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent'
        }
      `}
    >
      <span className={`flex-1 truncate ${isActive ? 'font-semibold' : ''}`} title={label}>
        {label}
      </span>
      <ChevronRight
        className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#E60012] dark:text-red-400' : 'text-gray-400 dark:text-gray-500'}`}
        aria-hidden
      />
    </button>
  );
};

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * Dark mode toggle button component
 */
export const DarkModeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="group flex items-center justify-center w-11 h-11 rounded-xl border-2 border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:scale-105 active:scale-95"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-500 group-hover:text-amber-400 transition-colors" />
      ) : (
        <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-[#E60012] transition-colors" />
      )}
    </button>
  );
};


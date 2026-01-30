import React from 'react';

export const TabButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
      active
        ? 'bg-[#E60012] text-white shadow-lg shadow-[#E60012]/25'
        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

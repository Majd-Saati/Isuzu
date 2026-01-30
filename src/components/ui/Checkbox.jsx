import React from 'react';

export const Checkbox = ({ checked, onChange, className = '' }) => {
  return (
    <label className={`inline-flex items-center cursor-pointer ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-[#E60012] peer-checked:border-[#E60012] transition-all flex items-center justify-center">
        {checked && (
          <svg
            className="w-3 h-3 text-white"
            viewBox="0 0 12 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 5L4.5 8.5L11 1.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </label>
  );
};

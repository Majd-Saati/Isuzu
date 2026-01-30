import React from 'react';

export const Input = ({ 
  label, 
  error, 
  touched,
  className = '',
  ...props 
}) => {
  const hasError = error && touched;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 ${
          hasError 
            ? 'border-red-500 dark:border-red-600 focus:border-red-600' 
            : 'border-gray-300 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-600'
        } text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-600 ${className}`}
        {...props}
      />
    </div>
  );
};

import React from 'react';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export const DateInput = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  min,
  max,
  disabled,
  formik,
}) => {
  const handleChange = (e) => {
    onChange(e);
    formik.setFieldTouched(name, true);
    // Validate immediately so errors clear on change
    formik.validateField(name);
    
    // If this is endsAt, also re-validate startsAt since end change can affect start-related rules
    if (name === 'endsAt') {
      formik.validateField('startsAt');
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <input
        type="date"
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        min={min || undefined}
        max={max || undefined}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 border-2 ${
          error && touched
            ? 'border-red-500 dark:border-red-500 focus:border-red-600 dark:focus:border-red-600'
            : 'border-gray-300 dark:border-gray-600 focus:border-gray-400 dark:focus:border-gray-500'
        } text-sm text-gray-900 dark:text-gray-100 focus:outline-none transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed`}
      />
      {error && touched && <ErrorMessage message={error} />}
    </div>
  );
};




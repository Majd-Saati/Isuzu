import React from 'react';
import { Input } from '@/components/ui/Input';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { SelectedDealersChips } from './SelectedDealersChips';
import { TYPE_OPTIONS, PRIORITY_OPTIONS } from '../constants';

const selectClass =
  'w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-400 dark:focus:border-gray-600 transition-all duration-200 cursor-pointer';

/**
 * Body of the Send Reminder form (Formik-driven fields).
 */
export const ReminderFormFields = ({ formik, selectedDealers }) => {
  const { values, errors, touched, handleChange, handleBlur } = formik;
  const showError = (field) => touched[field] && errors[field];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5">
      {/* Recipients */}
      <SelectedDealersChips dealers={selectedDealers} />

      {/* Title */}
      <div>
        <Input
          label="Title"
          name="title"
          placeholder="e.g. Q3 payment overdue"
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.title}
          touched={touched.title}
        />
        {showError('title') && <ErrorMessage message={errors.title} />}
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Message
        </label>
        <textarea
          name="message"
          rows={4}
          placeholder="Write the announcement details..."
          value={values.message}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 ${
            showError('message')
              ? 'border-red-500 dark:border-red-600 focus:border-red-600'
              : 'border-gray-300 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-600'
          } text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none transition-all duration-200 resize-none`}
        />
        {showError('message') && <ErrorMessage message={errors.message} />}
      </div>

      {/* Type + Priority */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type
          </label>
          <select
            name="type"
            value={values.type}
            onChange={handleChange}
            onBlur={handleBlur}
            className={selectClass}
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {showError('type') && <ErrorMessage message={errors.type} />}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Priority
          </label>
          <select
            name="priority"
            value={values.priority}
            onChange={handleChange}
            onBlur={handleBlur}
            className={selectClass}
          >
            {PRIORITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {showError('priority') && <ErrorMessage message={errors.priority} />}
        </div>
      </div>

      {/* Due date */}
      <div>
        <Input
          label="Due Date"
          type="date"
          name="dueDate"
          value={values.dueDate}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.dueDate}
          touched={touched.dueDate}
        />
        {showError('dueDate') && <ErrorMessage message={errors.dueDate} />}
      </div>
    </div>
  );
};

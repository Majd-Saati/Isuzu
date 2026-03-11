import React from 'react';
import { Input } from '@/components/ui/Input';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export const SetBudgetAllocationFormFields = ({ formik, terms, companies, disabled }) => {
  const showError = (field) => formik.touched[field] || formik.submitCount > 0;

  return (
    <div className="p-6 space-y-5">
      {/* Term */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Term <span className="text-red-500">*</span>
        </label>
        <select
          name="termId"
          value={formik.values.termId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={disabled}
          className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none transition-all ${
            formik.errors.termId && showError('termId')
              ? 'border-red-500 dark:border-red-600'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          } disabled:opacity-50 cursor-pointer`}
        >
          <option value="">Select term</option>
          {terms.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name || t.term_name || `Term ${t.id}`}
            </option>
          ))}
        </select>
        {showError('termId') && <ErrorMessage message={formik.errors.termId} />}
      </div>

      {/* Company */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Company <span className="text-red-500">*</span>
        </label>
        <select
          name="companyId"
          value={formik.values.companyId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={disabled}
          className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none transition-all ${
            formik.errors.companyId && showError('companyId')
              ? 'border-red-500 dark:border-red-600'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          } disabled:opacity-50 cursor-pointer`}
        >
          <option value="">Select company</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name || `Company ${c.id}`}
            </option>
          ))}
        </select>
        {showError('companyId') && <ErrorMessage message={formik.errors.companyId} />}
      </div>

      {/* Value */}
      <div>
        <Input
          label="Allocation value"
          name="value"
          type="number"
          min={1}
          step={1}
          placeholder="e.g. 1000000"
          value={formik.values.value}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.value}
          touched={showError('value')}
          disabled={disabled}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 pl-1">
          Enter the budget allocation amount (whole number)
        </p>
      </div>
    </div>
  );
};

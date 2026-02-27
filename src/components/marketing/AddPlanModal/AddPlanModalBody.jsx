import React from 'react';
import { Input } from '@/components/ui/Input';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { CompanyDropdownField } from './components/CompanyDropdownField';
import { TermDropdownField } from './components/TermDropdownField';

export const AddPlanModalBody = ({
  formik,
  isAdmin,
  companies,
  terms,
  selectedCompanyName,
  selectedTermName,
  showCompanyDropdown,
  showTermDropdown,
  companyDropdownPosition,
  termDropdownPosition,
  companyTriggerRef,
  termTriggerRef,
  toggleCompanyDropdown,
  closeCompanyDropdown,
  toggleTermDropdown,
  closeTermDropdown,
  handleCompanySelect,
  handleTermSelect,
}) => {
  const touched = formik.submitCount > 0;

  return (
    <div className="p-6 overflow-y-auto flex-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <Input
            label="Plan Name"
            name="planName"
            placeholder="Enter plan name"
            value={formik.values.planName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.planName}
            touched={touched}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Enter plan description, goals, and key messages"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 ${
              formik.errors.description && touched
                ? 'border-red-500 dark:border-red-600 focus:border-red-600 dark:focus:border-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:border-gray-400 dark:focus:border-gray-500'
            } text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 min-h-[96px] resize-y`}
          />
          {touched && <ErrorMessage message={formik.errors.description} />}
        </div>

        {isAdmin && (
          <CompanyDropdownField
            companies={companies}
            selectedCompanyName={selectedCompanyName}
            isOpen={showCompanyDropdown}
            position={companyDropdownPosition}
            triggerRef={companyTriggerRef}
            hasError={!!formik.errors.companyId && touched}
            showError={touched}
            errorMessage={formik.errors.companyId}
            onToggle={toggleCompanyDropdown}
            onClose={closeCompanyDropdown}
            onSelect={handleCompanySelect}
          />
        )}

        <TermDropdownField
          terms={terms}
          selectedTermName={selectedTermName}
          isOpen={showTermDropdown}
          position={termDropdownPosition}
          triggerRef={termTriggerRef}
          hasError={!!formik.errors.termId && touched}
          showError={touched}
          errorMessage={formik.errors.termId}
          onToggle={toggleTermDropdown}
          onClose={closeTermDropdown}
          onSelect={handleTermSelect}
        />

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            name="status"
            value={formik.values.status}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 ${
              formik.errors.status && touched
                ? 'border-red-500 dark:border-red-600'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            } text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 focus:border-transparent transition-all`}
          >
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
          {touched && <ErrorMessage message={formik.errors.status} />}
        </div>
      </div>
    </div>
  );
};

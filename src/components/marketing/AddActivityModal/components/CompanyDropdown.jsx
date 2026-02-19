import React from 'react';
import { ChevronDown } from 'lucide-react';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export const CompanyDropdown = ({
  companies,
  selectedCompanyName,
  showCompanyDropdown,
  setShowCompanyDropdown,
  formik,
  isSubmitting,
  formikIsSubmitting,
  onCompanySelect,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Dealer
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => !isSubmitting && !formikIsSubmitting && setShowCompanyDropdown(!showCompanyDropdown)}
          onBlur={() => setTimeout(() => setShowCompanyDropdown(false), 200)}
          disabled={isSubmitting || formikIsSubmitting}
          className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 border-2 ${
            formik.errors.companyId && (formik.touched.companyId || formik.submitCount > 0)
              ? 'border-red-500 dark:border-red-500'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          } text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-gray-400 dark:focus:border-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <span className={selectedCompanyName ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}>
            {selectedCompanyName || 'Select dealer'}
          </span>
          <ChevronDown className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform ${showCompanyDropdown ? 'rotate-180' : ''}`} />
        </button>

        {showCompanyDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl z-[10000] max-h-48 overflow-y-auto">
            {companies.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                No dealers available
              </div>
            ) : (
              companies.map((company) => (
                <button
                  key={company.id}
                  type="button"
                  onClick={() => onCompanySelect(company)}
                  className="w-full px-4 py-3 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-xl last:rounded-b-xl"
                >
                  {company.name || company.label}
                </button>
              ))
            )}
          </div>
        )}
      </div>
      {formik.errors.companyId && (formik.touched.companyId || formik.submitCount > 0) && (
        <ErrorMessage message={formik.errors.companyId} />
      )}
    </div>
  );
};


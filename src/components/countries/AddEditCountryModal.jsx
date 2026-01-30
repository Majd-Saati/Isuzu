import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/Input';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useCreateCountry, useUpdateCountry } from '@/hooks/api/useCountries';

const countrySchema = Yup.object({
  name: Yup.string()
    .required('Country name is required')
    .min(2, 'Country name must be at least 2 characters')
    .max(100, 'Country name must be less than 100 characters'),
  currency: Yup.string()
    .required('Currency code is required')
    .matches(/^[A-Z]{3}$/, 'Currency must be a 3-letter code (e.g., USD, EUR)')
    .length(3, 'Currency must be exactly 3 characters'),
  exchange_rate: Yup.number()
    .required('Exchange rate is required')
    .positive('Exchange rate must be a positive number')
    .min(0.01, 'Exchange rate must be at least 0.01')
    .max(10000, 'Exchange rate must be less than 10,000')
});

export const AddEditCountryModal = ({ isOpen, onClose, editData = null }) => {
  const isEditMode = !!editData;
  const createMutation = useCreateCountry();
  const updateMutation = useUpdateCountry();

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const formik = useFormik({
    initialValues: {
      name: editData?.name || '',
      currency: editData?.currency || '',
      exchange_rate: editData?.exchange_rate || ''
    },
    validationSchema: countrySchema,
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: (values, { resetForm }) => {
      const mutation = isEditMode ? updateMutation : createMutation;
      const data = isEditMode ? { id: editData.id, ...values } : values;

      mutation.mutate(data, {
        onSuccess: () => {
          resetForm();
          onClose();
        },
      });
    }
  });

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      formik.resetForm();
      onClose();
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      formik.resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md animate-scale-in transform transition-all">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#E60012]/5 dark:from-[#E60012]/10 to-transparent">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {isEditMode ? 'Edit Country' : 'Add New Country'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isEditMode ? 'Update country information' : 'Add a new country with currency details'}
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-all hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg hover:rotate-90 duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={formik.handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <Input
                label="Country Name"
                name="name"
                placeholder="e.g., UAE, Syria, Saudi Arabia"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.name}
                touched={formik.submitCount > 0}
                disabled={isLoading}
              />
              {formik.submitCount > 0 && (
                <ErrorMessage message={formik.errors.name} />
              )}
            </div>

            <div>
              <Input
                label="Currency Code"
                name="currency"
                placeholder="e.g., USD, AED, SAR"
                value={formik.values.currency}
                onChange={(e) => {
                  const upperValue = e.target.value.toUpperCase();
                  formik.setFieldValue('currency', upperValue);
                }}
                onBlur={formik.handleBlur}
                error={formik.errors.currency}
                touched={formik.submitCount > 0}
                maxLength={3}
                disabled={isLoading}
              />
              {formik.submitCount > 0 && (
                <ErrorMessage message={formik.errors.currency} />
              )}
            </div>

            <div>
              <Input
                label="Exchange Rate"
                name="exchange_rate"
                type="number"
                step="0.01"
                placeholder="e.g., 1.00, 3.67"
                value={formik.values.exchange_rate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.exchange_rate}
                touched={formik.submitCount > 0}
                disabled={isLoading}
              />
              {formik.submitCount > 0 && (
                <ErrorMessage message={formik.errors.exchange_rate} />
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 pl-1">
                Exchange rate relative to base currency (1.00 = base rate)
              </p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-transparent to-gray-50/50 dark:to-gray-800/50">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all border-2 border-gray-200 dark:border-gray-600 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formik.isValid || !formik.dirty}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#E60012] hover:bg-[#C00010] transition-all shadow-md hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-[#E60012] disabled:hover:scale-100 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditMode ? 'Update Country' : 'Add Country'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

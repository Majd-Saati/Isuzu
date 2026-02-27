import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/Input';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useUpdateTermExchange } from '@/hooks/api/useTerms';

const editTermExchangeSchema = Yup.object({
  rate: Yup.number()
    .required('Rate is required')
    .positive('Rate must be greater than 0')
    .typeError('Please enter a valid number'),
  note: Yup.string().max(500, 'Note must be less than 500 characters').nullable(),
});

export const EditTermExchangeModal = ({ isOpen, onClose, editData }) => {
  const updateMutation = useUpdateTermExchange();
  const isLoading = updateMutation.isPending;

  const formik = useFormik({
    initialValues: {
      rate: editData?.rate_to_jpy ?? '',
      note: editData?.note ?? '',
    },
    validationSchema: editTermExchangeSchema,
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: (values, { resetForm }) => {
      if (!editData?.id) return;
      updateMutation.mutate(
        {
          exchange_id: editData.id,
          rate: Number(values.rate),
          note: values.note?.trim() || undefined,
        },
        {
          onSuccess: () => {
            resetForm();
            onClose();
          },
        }
      );
    },
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
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#E60012]/5 dark:from-[#E60012]/10 to-transparent">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Edit exchange rate</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {editData && (
                <>
                  {editData.country_name} – {editData.currency}
                </>
              )}
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-all hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg hover:rotate-90 duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="p-6 space-y-4">
            <Input
              label="Rate to JPY"
              name="rate"
              type="number"
              step="any"
              min="0"
              placeholder="e.g. 151"
              value={formik.values.rate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.rate}
              touched={formik.submitCount > 0}
              disabled={isLoading}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Note <span className="text-gray-400 dark:text-gray-500 font-normal">(optional)</span>
              </label>
              <textarea
                name="note"
                placeholder="Optional note"
                value={formik.values.note}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isLoading}
                rows={3}
                className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 ${
                  formik.errors.note && formik.submitCount > 0
                    ? 'border-red-500 dark:border-red-600'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                } text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 transition-all disabled:opacity-50 resize-none`}
              />
              {formik.submitCount > 0 && formik.errors.note && (
                <ErrorMessage message={formik.errors.note} />
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-transparent to-gray-50/50 dark:to-gray-800/50">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all border-2 border-gray-200 dark:border-gray-700 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#E60012] hover:bg-[#C00010] transition-all shadow-md hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-[#E60012] disabled:hover:scale-100 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

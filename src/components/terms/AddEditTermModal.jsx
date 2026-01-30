import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/Input';
import { useCreateTerm, useUpdateTerm } from '@/hooks/api/useTerms';

const termSchema = Yup.object({
  name: Yup.string()
    .required('Term name is required')
    .min(2, 'Term name must be at least 2 characters')
    .max(100, 'Term name must be less than 100 characters'),
  start_date: Yup.date()
    .required('Start date is required')
    .typeError('Please enter a valid date'),
  end_date: Yup.date()
    .required('End date is required')
    .typeError('Please enter a valid date')
    .min(Yup.ref('start_date'), 'End date must be after start date'),
});

export const AddEditTermModal = ({ isOpen, onClose, editData = null }) => {
  const isEditMode = !!editData;
  const createMutation = useCreateTerm();
  const updateMutation = useUpdateTerm();
  
  const isLoading = createMutation.isPending || updateMutation.isPending;

  // Format date for date input (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    // If already in YYYY-MM-DD format, return as is
    if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    // Otherwise, try to parse and format
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  const formik = useFormik({
    initialValues: {
      name: editData?.name || '',
      start_date: formatDateForInput(editData?.start_date) || '',
      end_date: formatDateForInput(editData?.end_date) || '',
    },
    validationSchema: termSchema,
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: (values, { resetForm }) => {
      const mutation = isEditMode ? updateMutation : createMutation;
      
      // Format dates to YYYY-MM-DD format for API
      const formatDateForAPI = (dateValue) => {
        if (!dateValue) return '';
        // Date inputs return YYYY-MM-DD strings, so return as is
        if (typeof dateValue === 'string') {
          return dateValue;
        }
        // If it's a Date object, format it
        if (dateValue instanceof Date) {
          return dateValue.toISOString().split('T')[0];
        }
        return dateValue;
      };
      
      const data = isEditMode 
        ? {
            term_id: editData.id,
            name: values.name,
            start_date: formatDateForAPI(values.start_date),
            end_date: formatDateForAPI(values.end_date),
          }
        : {
            name: values.name,
            start_date: formatDateForAPI(values.start_date),
            end_date: formatDateForAPI(values.end_date),
          };
      
      mutation.mutate(data, {
        onSuccess: () => {
          resetForm();
          onClose();
        },
      });
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
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#E60012]/5 dark:from-[#E60012]/10 to-transparent">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {isEditMode ? 'Edit Term' : 'Add New Term'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isEditMode ? 'Update term information' : 'Create a new marketing term period'}
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

        {/* Modal Body */}
        <form onSubmit={formik.handleSubmit}>
          <div className="p-6 space-y-4">
            <Input
              label="Term Name"
              name="name"
              placeholder="e.g., First Term 2026"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.name}
              touched={formik.submitCount > 0}
              disabled={isLoading}
            />

            <Input
              label="Start Date"
              name="start_date"
              type="date"
              value={formik.values.start_date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.start_date}
              touched={formik.submitCount > 0}
              disabled={isLoading}
            />

            <Input
              label="End Date"
              name="end_date"
              type="date"
              value={formik.values.end_date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.end_date}
              touched={formik.submitCount > 0}
              disabled={isLoading}
            />
          </div>

          {/* Modal Footer */}
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
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditMode ? 'Update Term' : 'Add Term'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

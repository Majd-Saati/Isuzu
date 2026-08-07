import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/Input';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useCreateAnnouncement, useUpdateAnnouncement } from '@/hooks/api/useAnnouncements';

const announcementSchema = Yup.object({
  title: Yup.string()
    .required('Title is required')
    .min(2, 'Title must be at least 2 characters')
    .max(150, 'Title must be less than 150 characters'),
  description: Yup.string()
    .required('Description is required')
    .max(1000, 'Description must be less than 1000 characters'),
  for_all: Yup.string().oneOf(['0', '1']).required(),
  company_id: Yup.string().when('for_all', {
    is: '0',
    then: (schema) => schema.required('Company is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const selectClass = (hasError) =>
  `w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 ${
    hasError
      ? 'border-red-500 dark:border-red-600 focus:border-red-600'
      : 'border-gray-300 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-600'
  } text-sm text-gray-900 dark:text-gray-100 focus:outline-none transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed`;

export const AddEditAnnouncementModal = ({ isOpen, onClose, editData = null, companies = [] }) => {
  const isEditMode = !!editData;
  const createMutation = useCreateAnnouncement();
  const updateMutation = useUpdateAnnouncement();

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const formik = useFormik({
    initialValues: {
      title: editData?.title || '',
      description: editData?.description || '',
      for_all: editData ? String(editData.for_all) : '1',
      company_id: editData?.company_id != null ? String(editData.company_id) : '',
    },
    validationSchema: announcementSchema,
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: (values, { resetForm }) => {
      const mutation = isEditMode ? updateMutation : createMutation;

      const payload = {
        title: values.title.trim(),
        description: values.description.trim(),
        for_all: Number(values.for_all),
        ...(values.for_all === '0' ? { company_id: Number(values.company_id) } : {}),
      };
      if (isEditMode) {
        payload.announcement_id = editData.id;
      }

      mutation.mutate(payload, {
        onSuccess: () => {
          resetForm();
          onClose();
        },
      });
    },
  });

  const handleAudienceChange = (e) => {
    const value = e.target.value;
    formik.setFieldValue('for_all', value);
    if (value === '1') {
      formik.setFieldValue('company_id', '');
    }
  };

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
              {isEditMode ? 'Edit Announcement' : 'New Announcement'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isEditMode ? 'Update announcement details' : 'Send an announcement to your dealers'}
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
            <div>
              <Input
                label="Title"
                name="title"
                placeholder="e.g., New campaign instructions"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.title}
                touched={formik.submitCount > 0}
                disabled={isLoading}
              />
              {formik.submitCount > 0 && <ErrorMessage message={formik.errors.title} />}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                placeholder="Please review the updated campaign requirements."
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isLoading}
                className={`${selectClass(formik.errors.description && formik.submitCount > 0)} resize-none placeholder-gray-400 dark:placeholder-gray-500`}
              />
              {formik.submitCount > 0 && <ErrorMessage message={formik.errors.description} />}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Audience
              </label>
              <select
                name="for_all"
                value={formik.values.for_all}
                onChange={handleAudienceChange}
                onBlur={formik.handleBlur}
                disabled={isLoading}
                className={selectClass(false)}
              >
                <option value="1">All dealers</option>
                <option value="0">Specific company</option>
              </select>
            </div>

            {formik.values.for_all === '0' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company
                </label>
                <select
                  name="company_id"
                  value={formik.values.company_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isLoading}
                  className={selectClass(formik.errors.company_id && formik.submitCount > 0)}
                >
                  <option value="">Select company</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
                {formik.submitCount > 0 && <ErrorMessage message={formik.errors.company_id} />}
              </div>
            )}
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
                  {isEditMode ? 'Updating...' : 'Sending...'}
                </>
              ) : isEditMode ? (
                'Update Announcement'
              ) : (
                'Send Announcement'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

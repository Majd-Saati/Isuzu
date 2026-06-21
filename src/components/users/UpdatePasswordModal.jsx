import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { X, KeyRound, Loader2 } from 'lucide-react';
import { PasswordField } from './AddEditUserModal/components/PasswordField';
import { useUpdateUser } from '@/hooks/api/useUsers';
import { PASSWORD_MIN_LENGTH, PASSWORD_MIN_MESSAGE } from '@/validations/loginValidation';

export const updatePasswordSchema = Yup.object({
  password: Yup.string()
    .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_MESSAGE)
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Please confirm the password'),
});

const isUserAdmin = (user) => user?.is_admin === '1' || user?.is_admin === 1;

export const UpdatePasswordModal = ({ isOpen, onClose, user = null }) => {
  const updateMutation = useUpdateUser();
  const isLoading = updateMutation.isPending;

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const formik = useFormik({
    initialValues: { password: '', confirmPassword: '' },
    validationSchema: updatePasswordSchema,
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: (values, { resetForm }) => {
      if (!user?.id) return;

      const payload = { id: user.id, password: values.password };

      // Non-admin users require their company_id in the payload
      if (!isUserAdmin(user) && user.company_id) {
        payload.company_id = String(user.company_id);
      }

      updateMutation.mutate(payload, {
        onSuccess: () => {
          resetForm();
          onClose();
        },
      });
    },
  });

  const handleClose = () => {
    if (isLoading) return;
    formik.resetForm();
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md flex flex-col animate-scale-in transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#E60012]/5 dark:from-[#E60012]/10 to-transparent flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E60012]/10 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-[#E60012]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Update Password</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {user?.name ? `Set a new password for ${user.name}` : 'Set a new password'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-all hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg hover:rotate-90 duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={formik.handleSubmit} className="flex flex-col">
          <div className="p-6 space-y-5">
            <PasswordField
              label="New Password"
              name="password"
              placeholder="Enter new password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.password}
              touched={formik.touched.password}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword((prev) => !prev)}
              disabled={isLoading}
            />

            <PasswordField
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Re-enter new password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.confirmPassword}
              touched={formik.touched.confirmPassword}
              showPassword={showConfirmPassword}
              onTogglePassword={() => setShowConfirmPassword((prev) => !prev)}
              disabled={isLoading}
            />

            {updateMutation.isError && (
              <p className="text-sm text-red-600 dark:text-red-400">
                Failed to update password. Please try again.
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-transparent to-gray-50/50 dark:to-gray-800/50 flex-shrink-0">
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
              disabled={isLoading}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#E60012] hover:bg-[#C00010] transition-all shadow-md hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-[#E60012] disabled:hover:scale-100 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

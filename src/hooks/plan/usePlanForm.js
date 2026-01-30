import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { isAdminUser } from '@/lib/permissions';
import { createPlanFormSchema } from '@/utils/planForm/planFormSchema';
import { getInitialFormValues, transformFormValuesToPayload } from '@/utils/planForm/planFormUtils';

/**
 * Custom hook for managing plan form state and validation
 * @param {Object} params - Hook parameters
 * @param {string} params.mode - 'create' or 'edit'
 * @param {Object|null} params.initialPlan - Existing plan data (for edit mode)
 * @param {Function} params.onSubmit - Callback when form is submitted
 * @returns {Object} Formik instance and helpers
 */
export const usePlanForm = ({ mode, initialPlan, onSubmit }) => {
  const currentUser = useSelector((state) => state.auth.user);
  const isAdmin = isAdminUser(currentUser);

  const formik = useFormik({
    initialValues: getInitialFormValues({
      initialPlan,
      isAdmin,
      userCompanyId: currentUser?.company_id,
    }),
    validationSchema: createPlanFormSchema(mode, isAdmin),
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: (values) => {
      const payload = transformFormValuesToPayload({
        values,
        mode,
        initialPlan,
        isAdmin,
        userCompanyId: currentUser?.company_id,
      });
      onSubmit(payload);
    },
  });

  return {
    formik,
    isAdmin,
    currentUser,
  };
};


import * as Yup from 'yup';

/**
 * Creates a validation schema for plan form based on mode and user role
 * @param {string} mode - 'create' or 'edit'
 * @param {boolean} isAdmin - Whether the current user is an admin
 * @returns {Yup.ObjectSchema} Yup validation schema
 */
export const createPlanFormSchema = (mode, isAdmin) => {
  return Yup.object({
    planName: Yup.string()
      .required('Plan name is required')
      .min(3, 'Plan name must be at least 3 characters')
      .max(100, 'Plan name must be less than 100 characters'),
    termId: Yup.string()
      .required('Term is required'),
    companyId: mode === 'edit'
      ? Yup.string().notRequired()
      : isAdmin
      ? Yup.string().required('Dealer is required')
      : Yup.string().notRequired(), // Not required for normal users (auto-set from user)
    status: Yup.string()
      .required('Status is required'),
    description: Yup.string()
      .max(200, 'Description must be less than 200 characters'),
  });
};


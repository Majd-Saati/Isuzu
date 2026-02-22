import * as Yup from 'yup';

export const createUserSchema = (isEditMode) => Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: isEditMode
    ? Yup.string().notRequired()
    : Yup.string().required('Email is required').email('Please enter a valid email address'),
  mobile: Yup.string()
    .required('Mobile number is required'),
  gender: isEditMode
    ? Yup.string().notRequired()
    : Yup.string().required('Gender is required'),
  company_id: isEditMode
    ? Yup.string().notRequired()
    : Yup.string().when('is_admin', {
        is: '1',
        then: (schema) => schema.notRequired(),
        otherwise: (schema) => schema.required('Company is required'),
      }),
  country_id: isEditMode
    ? Yup.string().notRequired()
    : Yup.string().when('is_admin', {
        is: '1',
        then: (schema) => schema.notRequired(),
        otherwise: (schema) => schema.required('Country is required'),
      }),
  password: isEditMode
    ? Yup.string().notRequired()
    : Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  is_admin: isEditMode
    ? Yup.string().notRequired()
    : Yup.string().required('Role is required'),
  status: Yup.string()
    .required('Status is required'),
});



import * as Yup from 'yup';

export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MIN_MESSAGE = 'Password must be at least 6 characters';

export const requiredPasswordSchema = Yup.string()
  .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_MESSAGE)
  .required('Password is required');

export const optionalPasswordSchema = Yup.string()
  .transform((value, originalValue) => (originalValue === '' ? undefined : value))
  .notRequired()
  .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_MESSAGE);

export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: requiredPasswordSchema,
});

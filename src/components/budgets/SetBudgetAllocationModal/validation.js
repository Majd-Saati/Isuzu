import * as Yup from 'yup';

export const setBudgetAllocationSchema = Yup.object({
  termId: Yup.string().required('Term is required'),
  companyId: Yup.string().required('Company is required'),
  value: Yup.number()
    .required('Allocation value is required')
    .typeError('Value must be a number')
    .positive('Value must be greater than 0')
    .integer('Value must be a whole number'),
});

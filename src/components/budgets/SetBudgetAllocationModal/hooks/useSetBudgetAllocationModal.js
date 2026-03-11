import { useFormik } from 'formik';
import { setBudgetAllocationSchema } from '../validation';
import { INITIAL_VALUES } from '../constants';
import { buildSetAllocationPayload } from '../utils';

export const useSetBudgetAllocationModal = ({ isOpen, onClose, onSubmit }) => {
  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    validationSchema: setBudgetAllocationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values, { setSubmitting }) => {
      const payload = buildSetAllocationPayload(values);
      onSubmit(payload, {
        onSuccess: () => {
          setSubmitting(false);
          formik.resetForm();
          onClose();
        },
        onSettled: () => {
          setSubmitting(false);
        },
      });
    },
  });

  const handleClose = () => {
    if (!formik.isSubmitting) {
      formik.resetForm();
      onClose();
    }
  };

  return { formik, handleClose };
};

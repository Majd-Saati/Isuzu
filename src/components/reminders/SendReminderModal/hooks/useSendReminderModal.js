import { useFormik } from 'formik';
import { sendReminderSchema } from '../validation';
import { INITIAL_VALUES } from '../constants';

/**
 * Encapsulates the Send Reminder form logic.
 *
 * On submit it builds one reminder object per selected dealer (since there is
 * no backend yet) and hands them to the caller via onSend.
 *
 * @param {Object}   params
 * @param {Array}    params.selectedDealers - dealers to send the reminder to
 * @param {Function} params.onSend          - receives the built reminders array
 * @param {Function} params.onClose         - closes the modal
 */
export const useSendReminderModal = ({ selectedDealers = [], onSend, onClose }) => {
  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    validationSchema: sendReminderSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values, { resetForm }) => {
      const timestamp = Date.now();
      const createdAt = new Date().toISOString();

      const newReminders = selectedDealers.map((dealer, index) => ({
        id: timestamp + index,
        title: values.title.trim(),
        message: values.message.trim(),
        dealerId: dealer.id,
        dealerName: dealer.label,
        type: values.type,
        priority: values.priority,
        status: 'sent',
        createdAt,
        dueDate: values.dueDate,
      }));

      onSend?.(newReminders);
      resetForm();
      onClose?.();
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose?.();
  };

  return { formik, handleClose };
};

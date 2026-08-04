import * as Yup from 'yup';

/**
 * Validation schema for the Send Reminder form.
 */
export const sendReminderSchema = Yup.object({
  recipients: Yup.array()
    .of(Yup.mixed())
    .min(1, 'Select at least one recipient'),
  title: Yup.string()
    .trim()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  message: Yup.string()
    .trim()
    .required('Message is required')
    .min(5, 'Message must be at least 5 characters')
    .max(500, 'Message must be less than 500 characters'),
  type: Yup.string().required('Type is required'),
  priority: Yup.string().required('Priority is required'),
  dueDate: Yup.string()
    .required('Due date is required')
    .test('valid-date', 'Please enter a valid date', (value) => {
      if (!value) return false;
      const d = new Date(value);
      return d instanceof Date && !isNaN(d.getTime());
    }),
});

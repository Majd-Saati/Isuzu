import {
  REMINDER_TYPE_OPTIONS,
  REMINDER_PRIORITY_OPTIONS,
} from '@/data/mockRemindersData';

export const TYPE_OPTIONS = REMINDER_TYPE_OPTIONS;
export const PRIORITY_OPTIONS = REMINDER_PRIORITY_OPTIONS;

export const INITIAL_VALUES = {
  recipients: [],
  title: '',
  message: '',
  type: 'general',
  priority: 'medium',
  dueDate: '',
};

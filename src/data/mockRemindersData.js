/**
 * Mock/dummy data for the Reminders feature.
 *
 * NOTE: This is fake data used to build and demo the Reminders page UI.
 * When a real API is available, replace the arrays below with data coming
 * from a hook (e.g. useReminders / useDealers) similar to the other pages.
 */

/**
 * Dealers admins can send reminders to.
 * Shape mirrors the `useDealers` hook output ({ id, label }) used elsewhere.
 */
export const mockDealers = [
  { id: 1, label: 'DTA', location: 'Riyadh' },
  { id: 2, label: 'ALM', location: 'Jeddah' },
  { id: 3, label: 'SV', location: 'Dammam' },
  { id: 4, label: 'Zewed', location: 'Mecca' },
  { id: 5, label: 'JMTC', location: 'Medina' },
  { id: 6, label: 'Yemeco', location: 'Abha' },
];

/**
 * Reminder type metadata (value, label and badge classes).
 */
export const REMINDER_TYPES = {
  payment: {
    value: 'payment',
    label: 'Payment',
    badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  },
  document: {
    value: 'document',
    label: 'Document',
    badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  },
  plan: {
    value: 'plan',
    label: 'Marketing Plan',
    badgeClass: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
  },
  meeting: {
    value: 'meeting',
    label: 'Meeting',
    badgeClass: 'bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400',
  },
  general: {
    value: 'general',
    label: 'General',
    badgeClass: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  },
};

/**
 * Reminder priority metadata.
 */
export const REMINDER_PRIORITIES = {
  low: {
    value: 'low',
    label: 'Low',
    badgeClass: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  },
  medium: {
    value: 'medium',
    label: 'Medium',
    badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  },
  high: {
    value: 'high',
    label: 'High',
    badgeClass: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  },
};

/**
 * Reminder delivery status metadata.
 */
export const REMINDER_STATUSES = {
  sent: {
    value: 'sent',
    label: 'Sent',
    badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  },
  read: {
    value: 'read',
    label: 'Read',
    badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  },
  pending: {
    value: 'pending',
    label: 'Pending',
    badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  },
};

/** Options arrays for use in <select> / dropdowns and filters. */
export const REMINDER_TYPE_OPTIONS = Object.values(REMINDER_TYPES);
export const REMINDER_PRIORITY_OPTIONS = Object.values(REMINDER_PRIORITIES);
export const REMINDER_STATUS_OPTIONS = Object.values(REMINDER_STATUSES);

/**
 * Fake reminders list. Each reminder targets a single dealer.
 */
export const mockReminders = [
  {
    id: 1,
    title: 'Q3 payment overdue',
    message: 'Your Q3 co-op marketing payment is 5 days overdue. Please settle it as soon as possible.',
    dealerId: 1,
    dealerName: 'DTA',
    type: 'payment',
    priority: 'high',
    status: 'read',
    createdAt: '2026-07-28T09:15:00Z',
    dueDate: '2026-08-05',
  },
  {
    id: 2,
    title: 'Submit trade license copy',
    message: 'We are missing your renewed trade license. Kindly upload the latest copy to the portal.',
    dealerId: 2,
    dealerName: 'ALM',
    type: 'document',
    priority: 'medium',
    status: 'sent',
    createdAt: '2026-07-29T11:40:00Z',
    dueDate: '2026-08-10',
  },
  {
    id: 3,
    title: 'Q4 marketing plan approval',
    message: 'Please review and approve your Q4 marketing plan before the deadline.',
    dealerId: 3,
    dealerName: 'SV',
    type: 'plan',
    priority: 'high',
    status: 'pending',
    createdAt: '2026-07-30T08:00:00Z',
    dueDate: '2026-08-15',
  },
  {
    id: 4,
    title: 'Quarterly business review meeting',
    message: 'Reminder: our quarterly business review is scheduled next week. Please confirm attendance.',
    dealerId: 4,
    dealerName: 'Zewed',
    type: 'meeting',
    priority: 'medium',
    status: 'read',
    createdAt: '2026-07-25T14:20:00Z',
    dueDate: '2026-08-08',
  },
  {
    id: 5,
    title: 'Update showroom branding assets',
    message: 'The new brand guidelines are out. Please update your showroom branding accordingly.',
    dealerId: 5,
    dealerName: 'JMTC',
    type: 'general',
    priority: 'low',
    status: 'sent',
    createdAt: '2026-07-31T10:05:00Z',
    dueDate: '2026-08-20',
  },
  {
    id: 6,
    title: 'Outstanding invoice #4471',
    message: 'Invoice #4471 remains unpaid. Please arrange payment to avoid service interruption.',
    dealerId: 6,
    dealerName: 'Yemeco',
    type: 'payment',
    priority: 'high',
    status: 'pending',
    createdAt: '2026-08-01T07:30:00Z',
    dueDate: '2026-08-06',
  },
  {
    id: 7,
    title: 'Sign updated dealer agreement',
    message: 'The updated dealer agreement is ready for your signature in the documents section.',
    dealerId: 1,
    dealerName: 'DTA',
    type: 'document',
    priority: 'medium',
    status: 'read',
    createdAt: '2026-07-22T13:10:00Z',
    dueDate: '2026-08-12',
  },
  {
    id: 8,
    title: 'Confirm Q3 activity budgets',
    message: 'Please confirm the remaining Q3 activity budgets so we can finalize allocations.',
    dealerId: 2,
    dealerName: 'ALM',
    type: 'plan',
    priority: 'medium',
    status: 'sent',
    createdAt: '2026-07-27T16:45:00Z',
    dueDate: '2026-08-09',
  },
  {
    id: 9,
    title: 'Annual training session',
    message: 'The annual sales training session is coming up. Nominate your team members.',
    dealerId: 3,
    dealerName: 'SV',
    type: 'meeting',
    priority: 'low',
    status: 'read',
    createdAt: '2026-07-20T09:00:00Z',
    dueDate: '2026-08-25',
  },
  {
    id: 10,
    title: 'VAT certificate expiring soon',
    message: 'Your VAT certificate expires this month. Please provide the renewed document.',
    dealerId: 4,
    dealerName: 'Zewed',
    type: 'document',
    priority: 'high',
    status: 'pending',
    createdAt: '2026-08-02T12:00:00Z',
    dueDate: '2026-08-07',
  },
  {
    id: 11,
    title: 'Feedback survey pending',
    message: 'We value your input. Please complete the dealer satisfaction survey.',
    dealerId: 5,
    dealerName: 'JMTC',
    type: 'general',
    priority: 'low',
    status: 'sent',
    createdAt: '2026-07-24T15:30:00Z',
    dueDate: '2026-08-18',
  },
  {
    id: 12,
    title: 'Down payment reminder',
    message: 'A down payment is required to activate your next campaign. Please process it.',
    dealerId: 6,
    dealerName: 'Yemeco',
    type: 'payment',
    priority: 'medium',
    status: 'read',
    createdAt: '2026-07-26T08:50:00Z',
    dueDate: '2026-08-11',
  },
  {
    id: 13,
    title: 'Review new landing page draft',
    message: 'The draft of your new campaign landing page is ready for your review.',
    dealerId: 1,
    dealerName: 'DTA',
    type: 'plan',
    priority: 'low',
    status: 'pending',
    createdAt: '2026-08-01T18:15:00Z',
    dueDate: '2026-08-14',
  },
  {
    id: 14,
    title: 'Monthly reconciliation meeting',
    message: 'Reminder for the monthly financial reconciliation call this Thursday.',
    dealerId: 2,
    dealerName: 'ALM',
    type: 'meeting',
    priority: 'medium',
    status: 'sent',
    createdAt: '2026-07-30T11:25:00Z',
    dueDate: '2026-08-08',
  },
  {
    id: 15,
    title: 'Upload showroom photos',
    message: 'Please upload recent photos of your showroom for the directory refresh.',
    dealerId: 3,
    dealerName: 'SV',
    type: 'general',
    priority: 'low',
    status: 'read',
    createdAt: '2026-07-19T10:40:00Z',
    dueDate: '2026-08-22',
  },
];

import { format, eachMonthOfInterval, parseISO, isValid, startOfMonth } from 'date-fns';

/**
 * Parse term date (string or Date) into local start-of-month.
 * Treats YYYY-MM-DD as local date to avoid timezone shifting.
 * @param {string | Date} value
 * @returns {Date | null}
 */
export function parseTermDate(value) {
  if (!value) return null;
  if (value instanceof Date) return isValid(value) ? startOfMonth(value) : null;
  const str = String(value).trim();
  const dateOnlyMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (dateOnlyMatch) {
    const [, y, m, d] = dateOnlyMatch;
    const local = new Date(Number(y), Number(m) - 1, Number(d));
    return isValid(local) ? startOfMonth(local) : null;
  }
  const parsed = parseISO(str);
  return isValid(parsed) ? startOfMonth(parsed) : null;
}

/**
 * Generate months array from term period (start/end dates).
 * @param {string | Date} termStartDate
 * @param {string | Date} termEndDate
 * @returns {{ key: string, label: string }[]}
 */
export function getTermMonths(termStartDate, termEndDate) {
  if (!termStartDate || !termEndDate) return [];
  try {
    const startDate = parseTermDate(termStartDate);
    const endDate = parseTermDate(termEndDate);
    if (!startDate || !endDate || endDate < startDate) return [];
    const months = eachMonthOfInterval({ start: startDate, end: endDate });
    return months.map((date) => ({
      key: format(date, 'yyyy-MM'),
      label: format(date, 'MMM yyyy'),
    }));
  } catch (error) {
    console.error('Error generating months from term period:', error);
    return [];
  }
}

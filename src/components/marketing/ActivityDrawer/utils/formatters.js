import { formatMoneyFromContext } from '@/lib/dashboardMoney';

/** Display amount using persisted app currency and admin rules. */
export const formatCurrency = (value) => formatMoneyFromContext(value);

// Format month key (yyyy-MM) to "MMM yyyy" for display
export const formatMonthLabel = (monthKey) => {
  if (!monthKey || typeof monthKey !== 'string') return monthKey ?? '';
  const match = monthKey.match(/^(\d{4})-(\d{2})/);
  if (!match) return monthKey;
  const [, year, month] = match;
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

// Format date
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'N/A';
  }
};

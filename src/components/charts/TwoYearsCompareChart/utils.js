import { formatJpySupportAmount } from '@/lib/dashboardMoney';

export const formatSupportCost = (value, isAdmin = false, currencyCode = 'JPY') =>
  formatJpySupportAmount(value, isAdmin, currencyCode);

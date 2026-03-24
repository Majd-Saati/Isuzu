import { formatJpySupportAmount } from '@/lib/dashboardMoney';

export const formatSupportCost = (value, isAdmin = false, currencyCode = '') =>
  formatJpySupportAmount(value, isAdmin, currencyCode);

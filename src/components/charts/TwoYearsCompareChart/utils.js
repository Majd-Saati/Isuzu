import { formatJpySupportAmount } from '@/lib/dashboardMoney';

export const formatSupportCost = (value, isAdmin = false) => formatJpySupportAmount(value, isAdmin);

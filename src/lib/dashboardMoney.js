import { getStoredCurrency } from '@/contexts/CurrencyContext';

/** Yen mark for JPY display */
export const YEN_MARK = '¥';

function readAdminFromStorage() {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;
    const user = JSON.parse(userStr);
    return user?.is_admin === '1' || user?.is_admin === 1 || user?.is_admin === true;
  } catch {
    return false;
  }
}

/**
 * Effective ISO / app currency: admins always JPY; others use stored choice (default JPY).
 */
export function getEffectiveCurrencyCode(isAdmin, currencyCode) {
  if (isAdmin) return 'JPY';
  const c = String(currencyCode ?? '').trim();
  return c || 'JPY';
}

function formatNumber(value, options) {
  return new Intl.NumberFormat('en-US', options).format(Number(value) || 0);
}

function formatAmountWithCode(value, code, minFrac, maxFrac) {
  const n = Number(value) || 0;
  const numFormatted = formatNumber(n, {
    minimumFractionDigits: minFrac,
    maximumFractionDigits: maxFrac,
  });
  if (code === 'JPY') {
    return `${YEN_MARK}\u00A0${numFormatted}`;
  }
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
      minimumFractionDigits: minFrac,
      maximumFractionDigits: maxFrac,
    }).format(n);
  } catch {
    return `${code}\u00A0${numFormatted}`;
  }
}

export function formatReportingMoney(value, isAdmin, currencyCode) {
  const code = getEffectiveCurrencyCode(isAdmin, currencyCode);
  return formatAmountWithCode(value, code, 3, 3);
}

export function formatDealerCardMoney(value, isAdmin, currencyCode) {
  const code = getEffectiveCurrencyCode(isAdmin, currencyCode);
  return formatAmountWithCode(value, code, 0, 0);
}

export function formatEfficiencyMoney(value, isAdmin, currencyCode) {
  const code = getEffectiveCurrencyCode(isAdmin, currencyCode);
  const num = Number(value);
  if (Number.isNaN(num)) {
    return code === 'JPY'
      ? `${YEN_MARK}\u00A00.00`
      : formatAmountWithCode(0, code, 2, 2);
  }
  const formatted = num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (code === 'JPY') {
    return `${YEN_MARK}\u00A0${formatted}`;
  }
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    return `${code}\u00A0${formatted}`;
  }
}

export function formatChartsCurrency(value, isAdmin, currencyCode) {
  const code = getEffectiveCurrencyCode(isAdmin, currencyCode);
  return formatAmountWithCode(value, code, 0, 0);
}

export function formatChartsCompact(value, isAdmin, currencyCode) {
  const num = Number(value) || 0;
  const code = getEffectiveCurrencyCode(isAdmin, currencyCode);
  if (num >= 1000000) {
    const s = `${(num / 1000000).toFixed(1)}M`;
    return code === 'JPY' ? `${YEN_MARK}\u00A0${s}` : `${code}\u00A0${s}`;
  }
  if (num >= 1000) {
    const s = `${(num / 1000).toFixed(0)}K`;
    return code === 'JPY' ? `${YEN_MARK}\u00A0${s}` : `${code}\u00A0${s}`;
  }
  return formatChartsCurrency(num, isAdmin, currencyCode);
}

export function formatJpySupportAmount(value, isAdmin, currencyCode) {
  const code = getEffectiveCurrencyCode(isAdmin, currencyCode);
  return formatAmountWithCode(value, code, 0, 0);
}

export function formatJpyAxisCompact(value, isAdmin, currencyCode) {
  const num = Number(value) || 0;
  const code = getEffectiveCurrencyCode(isAdmin, currencyCode);
  let s;
  if (num >= 1000000) s = `${(num / 1000000).toFixed(1)}M`;
  else if (num >= 1000) s = `${(num / 1000).toFixed(0)}K`;
  else s = String(num);
  return code === 'JPY' ? `${YEN_MARK}\u00A0${s}` : `${code}\u00A0${s}`;
}

/**
 * For non-React modules (e.g. Activity drawer formatters): uses Redux-synced user in localStorage + stored currency.
 */
export function formatMoneyFromContext(value) {
  return formatDealerCardMoney(value, readAdminFromStorage(), getStoredCurrency());
}

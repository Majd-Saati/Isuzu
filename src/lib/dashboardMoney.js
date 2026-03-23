/** Yen mark shown beside amounts for admin dashboard views (JPY). */
export const YEN_MARK = '¥';

function formatNumber(value, options) {
  return new Intl.NumberFormat('en-US', options).format(Number(value) || 0);
}

export function formatReportingMoney(value, isAdmin) {
  const formatted = formatNumber(value, { minimumFractionDigits: 3, maximumFractionDigits: 3 });
  return isAdmin ? `${YEN_MARK} ${formatted}` : formatted;
}

export function formatDealerCardMoney(value, isAdmin) {
  const formatted = formatNumber(value, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  // NBSP keeps ¥ glued to the number if wrapping ever occurs
  return isAdmin ? `${YEN_MARK}\u00A0${formatted}` : formatted;
}

export function formatEfficiencyMoney(value, isAdmin) {
  const num = Number(value);
  if (Number.isNaN(num)) return isAdmin ? `${YEN_MARK} 0.00` : '0.00';
  const formatted = num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return isAdmin ? `${YEN_MARK} ${formatted}` : formatted;
}

export function formatChartsCurrency(value, isAdmin) {
  const n = Number(value) || 0;
  if (isAdmin) {
    return `${YEN_MARK} ${formatNumber(n, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatChartsCompact(value, isAdmin) {
  const num = Number(value) || 0;
  if (num >= 1000000) {
    const s = `${(num / 1000000).toFixed(1)}M`;
    return isAdmin ? `${YEN_MARK} ${s}` : `$${s}`;
  }
  if (num >= 1000) {
    const s = `${(num / 1000).toFixed(0)}K`;
    return isAdmin ? `${YEN_MARK} ${s}` : `$${s}`;
  }
  return formatChartsCurrency(num, isAdmin);
}

export function formatJpySupportAmount(value, isAdmin) {
  const formatted = formatNumber(value, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  return isAdmin ? `${YEN_MARK} ${formatted}` : formatted;
}

export function formatJpyAxisCompact(value, isAdmin) {
  const num = Number(value) || 0;
  let s;
  if (num >= 1000000) s = `${(num / 1000000).toFixed(1)}M`;
  else if (num >= 1000) s = `${(num / 1000).toFixed(0)}K`;
  else s = String(num);
  return isAdmin ? `${YEN_MARK} ${s}` : s;
}

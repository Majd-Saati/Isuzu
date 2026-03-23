import React from 'react';
import { DollarSign } from 'lucide-react';
import { getEffectiveCurrencyCode } from '@/lib/dashboardMoney';

/**
 * Currency glyph: ¥ when effective display currency is JPY (admin always JPY; users default JPY).
 */
export function MoneyGlyph({ isAdmin, currencyCode = 'JPY', className }) {
  const code = getEffectiveCurrencyCode(isAdmin, currencyCode);
  if (code === 'JPY') {
    return (
      <span
        className={`inline-flex items-center justify-center font-bold leading-none tabular-nums ${className || ''}`}
        aria-hidden
      >
        ¥
      </span>
    );
  }
  return <DollarSign className={className} />;
}

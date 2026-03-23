import React from 'react';
import { DollarSign } from 'lucide-react';

/**
 * Currency glyph for dashboard money UI: ¥ for admin (JPY), dollar icon otherwise.
 */
export function MoneyGlyph({ isAdmin, className }) {
  if (isAdmin) {
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

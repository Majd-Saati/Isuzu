import React from 'react';

/**
 * Small notification badge for unread comment counts.
 *
 * Renders a gradient red pill with an optional attention "ping" halo.
 * Returns null when there is nothing unread, so callers can drop it in
 * unconditionally.
 *
 * @param {number}  count   - number of unread items
 * @param {boolean} pulse   - show the animated attention halo
 * @param {string}  className - extra classes (e.g. absolute positioning)
 */
export const UnreadBadge = ({ count = 0, pulse = false, className = '' }) => {
  const value = Number(count) || 0;
  if (value <= 0) return null;

  const display = value > 99 ? '99+' : value;
  const label = `${value} unread comment${value > 1 ? 's' : ''}`;

  return (
    <span
      className={`relative inline-flex flex-shrink-0 items-center justify-center ${className}`}
      title={label}
      aria-label={label}
    >
      {pulse && (
        <span className="absolute inset-0 inline-flex animate-ping rounded-full bg-[#E60012] opacity-40" />
      )}
      <span className="relative inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gradient-to-br from-[#FF3B47] to-[#C00010] px-1.5 text-[11px] font-bold leading-none tabular-nums text-white shadow-[0_2px_6px_rgba(230,0,18,0.45)] ring-2 ring-white dark:ring-gray-900">
        {display}
      </span>
    </span>
  );
};

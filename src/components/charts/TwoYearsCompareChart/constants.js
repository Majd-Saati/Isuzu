const currentYear = new Date().getFullYear();

export const YEAR_OPTIONS = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

export const SUPPORT_COST_COLOR = '#3b82f6';
export const SUPPORT_COST_COLOR_DARK = '#60a5fa';

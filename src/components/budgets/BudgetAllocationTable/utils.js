const LOGO_BASE = 'https://marketing.5v.ae/';

export const formatNumber = (num) => {
  if (num == null || num === '') return '—';
  const n = Number(num);
  if (Number.isNaN(n)) return '—';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n);
};

export const formatDate = (dateString) => {
  if (!dateString) return '—';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const getCompanyLogoUrl = (logoPath) => {
  if (!logoPath) return null;
  return logoPath.startsWith('http') ? logoPath : `${LOGO_BASE}${logoPath}`;
};

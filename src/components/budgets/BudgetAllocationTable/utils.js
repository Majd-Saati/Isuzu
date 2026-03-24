const LOGO_BASE = 'https://marketing.5v.ae/';

export const formatDate = (dateString) => {
  if (!dateString) return '—';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const getCompanyLogoUrl = (logoPath) => {
  if (!logoPath) return null;
  return logoPath.startsWith('http') ? logoPath : `${LOGO_BASE}${logoPath}`;
};

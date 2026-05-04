import { MEDIA_BASE_URL } from '@/lib/api/config';

const LOGO_BASE = `${MEDIA_BASE_URL}/`;

export const formatDate = (dateString) => {
  if (!dateString) return 'â€”';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const getCompanyLogoUrl = (logoPath) => {
  if (!logoPath) return null;
  return logoPath.startsWith('http') ? logoPath : `${LOGO_BASE}${logoPath}`;
};

// Single source of truth for API/media base URLs.
// Value comes from `VITE_API_BASE_URL` in `.env` (or CI secret at build time).
// Fallback is used only if the env var is missing.
const FALLBACK_API_BASE_URL = 'https://marketing.isuzu-tech.com/api/';

const rawBase = import.meta.env.VITE_API_BASE_URL || FALLBACK_API_BASE_URL;

// Normalize: ensure trailing slash on the API base.
export const API_BASE_URL = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

// Origin only (no `/api`, no trailing slash) — used to build media/logo/file URLs.
export const MEDIA_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '').replace(/\/$/, '');

/** Build a full URL for a stored relative media/logo path. Pass-through if already absolute. */
export const buildMediaUrl = (path) => {
  if (!path) return null;
  const s = String(path);
  if (s.startsWith('http://') || s.startsWith('https://')) return s;
  return `${MEDIA_BASE_URL}/${s.replace(/^\//, '')}`;
};

import { MEDIA_BASE_URL } from '@/lib/api/config';

function stripWrappers(path) {
  let s = String(path).trim();
  s = s.replace(/^\[/, '').replace(/\]$/, '').replace(/^["']/, '').replace(/["']$/, '');
  return s.trim();
}

/**
 * Turn a stored path into a browser-openable URL (same rules as CommentCard).
 * @param {string} path
 * @returns {string|null}
 */
export function resolveMediaUrl(path) {
  if (path == null || path === '') return null;
  let cleanPath = stripWrappers(path);
  if (!cleanPath) return null;
  if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) return cleanPath;
  cleanPath = cleanPath.replace(/^\//, '');
  return `${MEDIA_BASE_URL}/${cleanPath}`;
}

/**
 * Normalize API `media` into a list of path strings (array, JSON string like ["uploads/..."], or plain path).
 * @param {unknown} raw
 * @returns {string[]}
 */
export function parseMediaPaths(raw) {
  if (raw == null || raw === '') return [];
  if (Array.isArray(raw)) {
    return raw.map((p) => stripWrappers(p)).filter(Boolean);
  }
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map((p) => stripWrappers(p)).filter(Boolean);
        }
        const one = stripWrappers(parsed);
        return one ? [one] : [];
      } catch {
        const one = stripWrappers(trimmed);
        return one ? [one] : [];
      }
    }
    const one = stripWrappers(trimmed);
    return one ? [one] : [];
  }
  return [];
}

/** Display label for a path (usually the file name). */
export function mediaFileLabel(path) {
  const base = String(path).split('/').pop() || String(path);
  return base.trim() || 'Attachment';
}

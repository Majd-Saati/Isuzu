import { toast } from 'sonner';
import { API_BASE_URL, IMAGE_EXTENSIONS } from './constants';

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(Number(value) || 0);

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getFileExtension = (url) => {
  const ext = url.split('.').pop()?.toLowerCase();
  return ext || '';
};

export const isImageFile = (url) => {
  return IMAGE_EXTENSIONS.includes(getFileExtension(url));
};

export const getMediaUrl = (path) => {
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}/${path}`;
};

// Download file directly using fetch
export const downloadFile = async (url, fileName) => {
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error('Download failed');
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
    toast.success(`Downloaded: ${fileName}`);
  } catch (error) {
    // Fallback: open in new tab for cross-origin files
    window.open(url, '_blank');
    toast.info('Opening file in new tab');
  }
};


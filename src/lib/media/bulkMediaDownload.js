import { toast } from 'sonner';

/**
 * Budget types that can be bundled into a media ZIP, in display order.
 * Shared by the Activity Drawer button and the page-level download button so
 * both surfaces stay in sync.
 */
export const MEDIA_TYPE_OPTIONS = [
  { value: 'estimated cost', label: 'Estimated cost media', color: 'text-blue-600 dark:text-blue-400' },
  { value: 'actual cost', label: 'Actual cost media', color: 'text-emerald-600 dark:text-emerald-400' },
];

/**
 * Triggers a browser download for the given one-time URL.
 */
export function triggerBrowserDownload(url, fileName) {
  const a = document.createElement('a');
  a.href = url;
  if (fileName) a.download = fileName;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Interprets a successful bulk-media-download response and either starts the
 * browser download or surfaces the appropriate toast. Returns true when a
 * download was actually triggered.
 */
export function handleBulkDownloadResponse(res) {
  const body = res?.body;
  if (!body?.download_url) {
    toast.error('Download link was not returned by the server.');
    return false;
  }
  if (Number(body.files_count) === 0) {
    toast.info('No media files found for this selection.');
    return false;
  }
  triggerBrowserDownload(body.download_url, body.zip_name);
  const missing = Number(body.missing_files_count) || 0;
  if (missing > 0) {
    toast.warning(`${missing} file(s) were missing and skipped.`);
  }
  return true;
}

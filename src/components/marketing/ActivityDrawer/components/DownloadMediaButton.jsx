import React, { useEffect, useRef, useState } from 'react';
import { Download, ChevronDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useBulkMediaDownload } from '@/hooks/api/useMediaDownload';

const TYPE_OPTIONS = [
  { value: 'estimated cost', label: 'Estimated cost media', color: 'text-blue-600 dark:text-blue-400' },
  { value: 'actual cost', label: 'Actual cost media', color: 'text-emerald-600 dark:text-emerald-400' },
];

/**
 * Triggers a browser download for the given one-time URL.
 */
function triggerBrowserDownload(url, fileName) {
  const a = document.createElement('a');
  a.href = url;
  if (fileName) a.download = fileName;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Download-media control for the Activity Drawer.
 * Bundles the activity's uploaded media (per budget type) into a zip and
 * downloads it via the API's one-time `download_url`.
 */
export const DownloadMediaButton = ({ companyId, termId, planId, activityId }) => {
  const [open, setOpen] = useState(false);
  const [pendingType, setPendingType] = useState(null);
  const containerRef = useRef(null);
  const bulkDownload = useBulkMediaDownload();

  const canDownload = companyId != null && termId != null;

  // Close the menu on outside click / Escape.
  useEffect(() => {
    if (!open) return undefined;
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const handleSelect = (type) => {
    if (bulkDownload.isPending) return;
    setOpen(false);
    setPendingType(type);
    bulkDownload.mutate(
      { type, companyId, termId, planId, activityId },
      {
        onSuccess: (res) => {
          const body = res?.body;
          if (!body?.download_url) {
            toast.error('Download link was not returned by the server.');
            return;
          }
          if (Number(body.files_count) === 0) {
            toast.info('No media files found for this selection.');
            return;
          }
          triggerBrowserDownload(body.download_url, body.zip_name);
          const missing = Number(body.missing_files_count) || 0;
          if (missing > 0) {
            toast.warning(`${missing} file(s) were missing and skipped.`);
          }
        },
        onSettled: () => setPendingType(null),
      }
    );
  };

  if (!canDownload) return null;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={bulkDownload.isPending}
        className="p-2 rounded-xl text-gray-400 dark:text-gray-500 hover:text-[#E60012] dark:hover:text-[#E60012] hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1"
        title="Download media"
        aria-label="Download media"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {bulkDownload.isPending ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Download className="w-5 h-5" />
        )}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl z-[10000] min-w-[220px] overflow-hidden"
        >
          <div className="px-4 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
            Download media as ZIP
          </div>
          {TYPE_OPTIONS.map((option) => {
            const isLoading = bulkDownload.isPending && pendingType === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="menuitem"
                onClick={() => handleSelect(option.value)}
                disabled={bulkDownload.isPending}
                className="w-full px-4 py-3 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className={`w-4 h-4 flex-shrink-0 animate-spin ${option.color}`} />
                ) : (
                  <Download className={`w-4 h-4 flex-shrink-0 ${option.color}`} />
                )}
                <span className="whitespace-nowrap">{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

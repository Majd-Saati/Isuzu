import React, { useEffect, useRef, useState } from 'react';
import { Download, ChevronDown, Loader2 } from 'lucide-react';
import { useBulkMediaDownload } from '@/hooks/api/useMediaDownload';
import { MEDIA_TYPE_OPTIONS, handleBulkDownloadResponse } from '@/lib/media/bulkMediaDownload';

/**
 * Page-level "Download Media" control for the Marketing Plans page.
 *
 * Bundles every uploaded media file (per budget type) for the currently
 * scoped company + term into a ZIP and downloads it via the API's one-time
 * `download_url`. Unlike the Activity Drawer button, this is not scoped to a
 * single plan/activity — it downloads the whole selection.
 *
 * When a company/term cannot be resolved (e.g. an admin viewing "All
 * companies" / "All terms" across a mixed list), the button is disabled with a
 * hint so the user knows to narrow the filters first.
 */
export const PlanMediaDownloadButton = ({ companyId, termId }) => {
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
      { type, companyId, termId },
      {
        onSuccess: handleBulkDownloadResponse,
        onSettled: () => setPendingType(null),
      }
    );
  };

  const isPending = bulkDownload.isPending;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => canDownload && setOpen((v) => !v)}
        disabled={!canDownload || isPending}
        className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:border-[#E60012] hover:text-[#E60012] dark:hover:text-[#E60012] hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 dark:disabled:hover:border-gray-700 disabled:hover:text-gray-700 dark:disabled:hover:text-gray-200 disabled:hover:shadow-none"
        title={
          canDownload
            ? 'Download all media for the selected company and term as a ZIP'
            : 'Select a company and term to download their media'
        }
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        <span className="whitespace-nowrap">Download Media</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && canDownload && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl z-[10000] min-w-[240px] overflow-hidden"
        >
          <div className="px-4 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
            Download all media as ZIP
          </div>
          {MEDIA_TYPE_OPTIONS.map((option) => {
            const isLoading = isPending && pendingType === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="menuitem"
                onClick={() => handleSelect(option.value)}
                disabled={isPending}
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

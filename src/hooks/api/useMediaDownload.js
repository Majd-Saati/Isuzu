import { useMutation } from '@tanstack/react-query';
import { mediaDownloadService } from '@/lib/api/services/mediaDownloadService';

/**
 * Prepares a bulk media download. The mutation resolves to the full API
 * response; read `body` (download_url, zip_name, files_count, ...) from it.
 */
export const useBulkMediaDownload = () => {
  return useMutation({
    mutationFn: mediaDownloadService.bulkMediaDownload,
  });
};

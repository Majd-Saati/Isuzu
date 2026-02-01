import React, { useState } from 'react';
import { FileText, AlertCircle, Calendar, X, Image, Download, ExternalLink, Eye, Clock, Paperclip, ZoomIn, Loader2 } from 'lucide-react';
import { SectionTitle } from './SectionTitle';
import { useReport } from '@/hooks/api/useCharts';
import { useTerms } from '@/hooks/api/useTerms';
import { ReportingTableSkeleton } from './ReportingTableSkeleton';
import { ReportingTableEmpty } from './ReportingTableEmpty';
import { toast } from 'sonner';

const API_BASE_URL = 'https://marketing.5v.ae';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(Number(value) || 0);

const formatDate = (dateString) => {
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

const getFileExtension = (url) => {
  const ext = url.split('.').pop()?.toLowerCase();
  return ext || '';
};

const isImageFile = (url) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
  return imageExtensions.includes(getFileExtension(url));
};

const getMediaUrl = (path) => {
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}/${path}`;
};

// Download file directly using fetch
const downloadFile = async (url, fileName) => {
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

// Evidence Modal Component
const EvidenceModal = ({ evidences, activityName, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  if (!evidences || evidences.length === 0) return null;

  const totalMediaCount = evidences.reduce((acc, e) => acc + (e.media?.length || 0), 0);

  const handleDownload = async (url, fileName, id) => {
    setDownloadingId(id);
    await downloadFile(url, fileName);
    setDownloadingId(null);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 dark:bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'modal-pop 0.25s ease-out' }}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 rounded-lg bg-[#E60012]/10 dark:bg-[#E60012]/20">
                  <Paperclip className="w-4 h-4 text-[#E60012]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Evidence Files</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 ml-11">
                {activityName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          
          {/* Stats */}
          <div className="flex items-center gap-3 mt-4 ml-11">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="font-medium">{evidences.length} evidence{evidences.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm">
              <Image className="w-4 h-4 text-gray-500" />
              <span className="font-medium">{totalMediaCount} file{totalMediaCount !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)] bg-gray-50 dark:bg-gray-900/50">
          <div className="space-y-5">
            {evidences.map((evidence, index) => (
              <div
                key={evidence.meta_id || index}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Evidence Header */}
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        {evidence.description || 'No description'}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatDate(evidence.creation_date)}</span>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium">
                      ID: {evidence.meta_id}
                    </span>
                  </div>
                </div>

                {/* Media Files */}
                {evidence.media && evidence.media.length > 0 && (
                  <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {evidence.media.map((mediaPath, mediaIndex) => {
                        const fullUrl = getMediaUrl(mediaPath);
                        const isImage = isImageFile(mediaPath);
                        const fileName = mediaPath.split('/').pop();
                        const fileExt = getFileExtension(mediaPath).toUpperCase();
                        const downloadId = `${evidence.meta_id}-${mediaIndex}`;
                        const isDownloading = downloadingId === downloadId;

                        return (
                          <div
                            key={mediaIndex}
                            className="group relative bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden hover:border-blue-400 dark:hover:border-blue-500 transition-all"
                          >
                            {isImage ? (
                              <div className="relative aspect-video">
                                <img
                                  src={fullUrl}
                                  alt={`Evidence ${mediaIndex + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                                <div className="hidden w-full h-full bg-gray-100 dark:bg-gray-800 items-center justify-center absolute inset-0">
                                  <FileText className="w-10 h-10 text-gray-400" />
                                </div>
                                
                                {/* Image hover overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                                  <div className="absolute bottom-0 left-0 right-0 p-3">
                                    <p className="text-white text-xs font-medium truncate mb-2">
                                      {fileName}
                                    </p>
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => setSelectedImage(fullUrl)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-medium transition-all hover:scale-105"
                                      >
                                        <ZoomIn className="w-3.5 h-3.5" />
                                        View
                                      </button>
                                      <button
                                        onClick={() => handleDownload(fullUrl, fileName, downloadId)}
                                        disabled={isDownloading}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium transition-all hover:scale-105 disabled:opacity-50"
                                      >
                                        {isDownloading ? (
                                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        ) : (
                                          <Download className="w-3.5 h-3.5" />
                                        )}
                                        Download
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="p-4 flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center flex-shrink-0">
                                  <FileText className="w-7 h-7 text-gray-500 dark:text-gray-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                    {fileName}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {fileExt} file
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <a
                                    href={fullUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    title="Open"
                                  >
                                    <ExternalLink className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                  </a>
                                  <button
                                    onClick={() => handleDownload(fullUrl, fileName, downloadId)}
                                    disabled={isDownloading}
                                    className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50"
                                    title="Download"
                                  >
                                    {isDownloading ? (
                                      <Loader2 className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" />
                                    ) : (
                                      <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* No media */}
                {(!evidence.media || evidence.media.length === 0) && (
                  <div className="px-5 py-4 text-center text-sm text-gray-400 dark:text-gray-500">
                    No attachments
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full-size Image Preview */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-[60]"
          onClick={() => setSelectedImage(null)}
        >
          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
            <p className="text-white/80 text-sm font-medium">Image Preview</p>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const fileName = selectedImage.split('/').pop();
                  handleDownload(selectedImage, fileName, 'preview');
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
          
          <img
            src={selectedImage}
            alt="Full size preview"
            className="max-w-[95vw] max-h-[90vh] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <style>{`
        @keyframes modal-pop {
          0% { opacity: 0; transform: scale(0.95) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export const ReportingTable = () => {
  const [selectedTermId, setSelectedTermId] = useState('');
  const [evidenceModal, setEvidenceModal] = useState({ open: false, evidences: [], activityName: '' });

  // Fetch terms for the dropdown
  const { data: termsData } = useTerms({ perPage: 100 });
  const terms = termsData?.terms ?? [];

  // Set default term when terms are loaded
  React.useEffect(() => {
    if (terms.length > 0 && !selectedTermId) {
      setSelectedTermId(terms[0].id);
    }
  }, [terms, selectedTermId]);

  // Fetch report data
  const { data: reportData, isLoading, isError, error } = useReport(
    { term_id: selectedTermId },
    { enabled: !!selectedTermId }
  );

  const hasData = reportData?.months && reportData.months.length > 0;

  const handleOpenEvidences = (evidences, activityName) => {
    setEvidenceModal({ open: true, evidences, activityName });
  };

  const handleCloseEvidences = () => {
    setEvidenceModal({ open: false, evidences: [], activityName: '' });
  };

  if (isLoading) {
    return <ReportingTableSkeleton />;
  }

  if (isError) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-[24px] p-6 md:p-8 shadow-[0px_4px_16px_rgba(0,0,0,0.06)] border-2 border-gray-100 dark:border-gray-800 animate-fade-in">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 dark:text-red-400 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Failed to load report
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
            {error?.message || 'Please try again or select a different term.'}
          </p>
        </div>
      </div>
    );
  }

  if (!hasData) {
    return <ReportingTableEmpty />;
  }

  const { term, summary, months } = reportData;

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-[24px] p-6 md:p-8 shadow-[0px_4px_16px_rgba(0,0,0,0.06)] border-2 border-gray-100 dark:border-gray-800 animate-fade-in">
        {/* Header with filter and summary */}
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <SectionTitle title="Reporting" />
            
            {/* Term Filter */}
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <select
                value={selectedTermId}
                onChange={(e) => setSelectedTermId(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E60012]/50 focus:border-[#E60012] min-w-[200px] cursor-pointer"
              >
                {terms.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name || `Term ${t.id}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Term info and Summary */}
          {term && (
            <div className="flex flex-wrap items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <div className="flex-1 min-w-[200px]">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Period</div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {term.start_date} to {term.end_date}
                </div>
              </div>
              
              <div className="flex items-center gap-4 border-l border-gray-300 dark:border-gray-600 pl-4">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Activities</div>
                  <div className="text-lg font-bold text-[#E60012]">
                    {summary?.term_total_activities || 0}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Actual Cost</div>
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(summary?.term_total_actual_cost || 0)}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Support Cost</div>
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(summary?.term_total_support_cost || 0)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                <th className="text-left py-4 px-4 text-[#4A5568] dark:text-gray-300 text-sm font-medium w-32">
                  Month
                </th>
                <th className="text-left py-4 px-4 text-[#4A5568] dark:text-gray-300 text-sm font-medium">
                  Company
                </th>
                <th className="text-left py-4 px-4 text-[#4A5568] dark:text-gray-300 text-sm font-medium">
                  Plan
                </th>
                <th className="text-left py-4 px-4 text-[#4A5568] dark:text-gray-300 text-sm font-medium">
                  Activity
                </th>
                <th className="text-right py-4 px-4 text-[#4A5568] dark:text-gray-300 text-sm font-medium w-40">
                  Actual Cost
                </th>
                <th className="text-right py-4 px-4 text-[#4A5568] dark:text-gray-300 text-sm font-medium w-40">
                  Support Cost
                </th>
                <th className="text-center py-4 px-4 text-[#4A5568] dark:text-gray-300 text-sm font-medium w-24">
                  Evidences
                </th>
              </tr>
            </thead>
            <tbody>
              {months.map((monthGroup) => (
                <React.Fragment key={monthGroup.period}>
                  {monthGroup.rows.map((row, itemIndex) => (
                    <tr
                      key={`${row.activity_id}-${itemIndex}`}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                    >
                      {/* Month column - only show for first row of each month */}
                      <td className="py-4 px-4">
                        {itemIndex === 0 && (
                          <div className="text-[#1F2937] dark:text-gray-200 text-base font-semibold">
                            {monthGroup.label}
                          </div>
                        )}
                      </td>

                      {/* Company */}
                      <td className="py-4 px-4">
                        <div className="text-[#6B7280] dark:text-gray-300 text-sm font-medium">
                          {row.company_name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {row.currency}
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="py-4 px-4">
                        <div className="text-[#6B7280] dark:text-gray-300 text-sm">
                          {row.plan_name}
                        </div>
                      </td>

                      {/* Activity */}
                      <td className="py-4 px-4">
                        <div className="text-[#6B7280] dark:text-gray-300 text-sm">
                          {row.activity_name}
                        </div>
                      </td>

                      {/* Actual Cost */}
                      <td className="py-4 px-4 text-right">
                        <div className="text-[#1F2937] dark:text-gray-200 text-sm font-semibold">
                          {formatCurrency(row.actual_cost)}
                        </div>
                      </td>

                      {/* Support Cost */}
                      <td className="py-4 px-4 text-right">
                        <div className="text-[#1F2937] dark:text-gray-200 text-sm font-semibold">
                          {formatCurrency(row.support_cost)}
                        </div>
                      </td>

                      {/* Evidences */}
                      <td className="py-4 px-4">
                        <div className="flex justify-center">
                          {row.evidences && row.evidences.length > 0 ? (
                            <button 
                              onClick={() => handleOpenEvidences(row.evidences, row.activity_name)}
                              className="flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-[#3B82F6] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
                            >
                              <FileText className="w-4 h-4" />
                              <span className="text-xs font-medium">{row.evidences.length}</span>
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400 dark:text-gray-500">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Evidence Modal */}
      {evidenceModal.open && (
        <EvidenceModal
          evidences={evidenceModal.evidences}
          activityName={evidenceModal.activityName}
          onClose={handleCloseEvidences}
        />
      )}
    </>
  );
};

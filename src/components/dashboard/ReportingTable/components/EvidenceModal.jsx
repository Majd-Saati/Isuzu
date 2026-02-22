import React, { useState } from 'react';
import { FileText, Image, X, Eye, Clock, Paperclip, ZoomIn, Download, ExternalLink, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate, getMediaUrl, isImageFile, getFileExtension, downloadFile } from '../utils';

export const EvidenceModal = ({ evidences, activityName, activityId, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const navigate = useNavigate();

  if (!evidences || evidences.length === 0) return null;

  const totalMediaCount = evidences.reduce((acc, e) => acc + (e.media?.length || 0), 0);

  const handleDownload = async (url, fileName, id) => {
    setDownloadingId(id);
    await downloadFile(url, fileName);
    setDownloadingId(null);
  };

  const handleViewActivity = () => {
    navigate(`/marketing-plans?activity_id=${activityId}`);
    onClose();
  };

  return (
    <>
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
              <div className="flex items-center gap-2">
                <button
                  onClick={handleViewActivity}
                  className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition-colors"
                  title="View activity in Marketing Plans"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
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
    </>
  );
};



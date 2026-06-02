import React from 'react';
import { MessageSquare, FileText, Clock, User, Upload, Trash2 } from 'lucide-react';
import { formatDate } from '../utils/formatters';
import { parseMediaPaths, resolveMediaUrl, mediaFileLabel } from '../utils/mediaUrls';

const isImageFile = (url) => {
  if (!url) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  const lowerUrl = url.toLowerCase();
  return imageExtensions.some(ext => lowerUrl.includes(ext));
};

export const CommentCard = ({ item, onDelete, icon: Icon = MessageSquare }) => {
  const mediaItems = parseMediaPaths(item.media)
    .map((path) => ({ url: resolveMediaUrl(path), label: mediaFileLabel(path) }))
    .filter((m) => m.url);
  const itemType = item?.type || item?.meta_type;

  return (
    <div className="p-4 rounded-xl border-2 bg-slate-50/50 dark:bg-gray-800/50 border-slate-200 dark:border-gray-700">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-slate-100 dark:bg-gray-700">
          <Icon className="w-4 h-4 text-slate-600 dark:text-gray-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">{item.description}</p>
            {onDelete && (
              <button
                onClick={() => onDelete(item)}
                className="flex-shrink-0 p-1.5 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/60 transition-all"
                title={itemType === 'evidence' ? 'Delete Evidence' : 'Delete Comment'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          {mediaItems.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-3">
              {mediaItems.map(({ url, label }, index) =>
                isImageFile(url) ? (
                  <div key={`${url}-${index}`} className="space-y-1">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block cursor-pointer group"
                      title="Click to open in new tab"
                    >
                      <img
                        src={url}
                        alt={label}
                        className="max-w-full h-auto rounded-lg border-2 border-gray-200 dark:border-gray-700 max-h-48 object-contain transition-all group-hover:border-[#E60012] group-hover:shadow-md"
                        onError={(e) => {
                          e.target.parentElement.style.display = 'none';
                          e.target.parentElement.nextSibling.style.display = 'inline-flex';
                        }}
                      />
                    </a>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="items-center gap-1.5 text-xs text-[#E60012] hover:underline"
                      style={{ display: 'none' }}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      {label}
                    </a>
                  </div>
                ) : (
                  <a
                    key={`${url}-${index}`}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#E60012] hover:underline"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    {label}
                  </a>
                )
              )}
            </div>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
            {item.created_by_name && (
              <div className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                <span>{item.created_by_name}</span>
              </div>
            )}
            {item.creation_date && (
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatDate(item.creation_date)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

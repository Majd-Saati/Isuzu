import React from 'react';
import { MessageSquare, FileText, Clock, User, Upload, Trash2, CheckCheck, Loader2 } from 'lucide-react';
import { formatDate } from '../utils/formatters';
import { parseMediaPaths, resolveMediaUrl, mediaFileLabel } from '../utils/mediaUrls';

const isImageFile = (url) => {
  if (!url) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  const lowerUrl = url.toLowerCase();
  return imageExtensions.some(ext => lowerUrl.includes(ext));
};

/**
 * A comment is unread until the backend marks it read via the `has_read` flag.
 * A null / empty / zero value means "not yet read".
 */
const isCommentUnread = (item) => {
  if (!item) return false;
  const readFlag = item.has_read;
  const hasValue =
    readFlag !== null &&
    readFlag !== undefined &&
    readFlag !== '' &&
    readFlag !== 0 &&
    readFlag !== '0';
  return !hasValue;
};

export const CommentCard = ({ item, onDelete, onMarkRead, isMarkingRead = false, icon: Icon = MessageSquare }) => {
  const mediaItems = parseMediaPaths(item.media)
    .map((path) => ({ url: resolveMediaUrl(path), label: mediaFileLabel(path) }))
    .filter((m) => m.url);
  const itemType = item?.type || item?.meta_type;
  const unread = isCommentUnread(item);
  const canMarkRead = unread && typeof onMarkRead === 'function' && item?.id != null;

  return (
    <div className="p-4 rounded-xl border-2 bg-slate-50/50 dark:bg-gray-800/50 border-slate-200 dark:border-gray-700 transition-colors">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-slate-100 dark:bg-gray-700">
          <Icon className="w-4 h-4 text-slate-600 dark:text-gray-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">
              {unread && (
                <span className="mr-2 inline-flex items-center rounded-full bg-[#E60012] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white align-middle">
                  New
                </span>
              )}
              {item.description}
            </p>
            <div className="flex-shrink-0 flex items-center gap-1.5">
              {canMarkRead && (
                <button
                  onClick={() => onMarkRead(item.id)}
                  disabled={isMarkingRead}
                  className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/60 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  title="Mark this comment as read"
                  aria-label="Mark as read"
                >
                  {isMarkingRead ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCheck className="w-4 h-4" />
                  )}
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(item)}
                  className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/60 transition-all"
                  title={itemType === 'evidence' ? 'Delete Evidence' : 'Delete Comment'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
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
              <div className="flex items-center gap-1 min-w-0">
                <User className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{item.created_by_name}</span>
              </div>
            )}
            {item.creation_date && (
              <div className="flex items-center gap-1 flex-shrink-0">
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

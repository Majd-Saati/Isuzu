import React from 'react';
import { X, Trash2, Edit2, CheckCheck, Loader2 } from 'lucide-react';

export const DrawerHeader = ({
  activityName,
  onDelete,
  onClose,
  onEdit,
  unreadCount = 0,
  onMarkAllRead,
  isMarkingRead = false,
}) => {
  const showMarkRead = unreadCount > 0 && typeof onMarkAllRead === 'function';

  return (
    <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#E60012]/5 dark:from-[#E60012]/10 to-transparent">
      <div className="min-w-0">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Activity Details</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">{activityName || 'Activity'}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {showMarkRead && (
          <button
            onClick={onMarkAllRead}
            disabled={isMarkingRead}
            className="p-2 rounded-xl text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 hover:bg-emerald-200 dark:hover:bg-emerald-900/60 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            title={`Mark all ${unreadCount} comment${unreadCount > 1 ? 's' : ''} on this activity as read`}
            aria-label="Mark all comments as read"
          >
            {isMarkingRead ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <CheckCheck className="w-5 h-5" />
            )}
          </button>
        )}
        <button
          onClick={onEdit}
          className="p-2 rounded-xl text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
          title="Edit Activity"
        >
          <Edit2 className="w-5 h-5" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-xl text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
          title="Delete Activity"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:rotate-90"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

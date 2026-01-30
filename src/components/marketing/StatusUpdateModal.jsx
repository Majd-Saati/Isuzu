import React from 'react';
import { X, CheckCircle2, Clock3, Ban, Loader2, ArrowRight } from 'lucide-react';

const statusStyles = {
  done: {
    bg: 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300',
    dot: 'bg-green-500',
    text: 'text-green-700 dark:text-green-300',
    icon: <CheckCircle2 className="w-5 h-5" />
  },
  pending: {
    bg: 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300',
    dot: 'bg-red-500',
    text: 'text-red-700 dark:text-red-300',
    icon: <Ban className="w-5 h-5" />
  },
  'working on it': {
    bg: 'bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500',
    text: 'text-amber-700 dark:text-amber-300',
    icon: <Clock3 className="w-5 h-5" />
  },
};

const statusLabels = {
  done: 'Done',
  pending: 'Pending',
  'working on it': 'Working on it',
};

export const StatusUpdateModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  activityName,
  currentStatus, 
  newStatus,
  isLoading = false
}) => {
  if (!isOpen) return null;

  const currentStyle = statusStyles[currentStatus?.toLowerCase()] || statusStyles['working on it'];
  const newStyle = statusStyles[newStatus?.toLowerCase()] || statusStyles['working on it'];
  const currentLabel = statusLabels[currentStatus?.toLowerCase()] || currentStatus;
  const newLabel = statusLabels[newStatus?.toLowerCase()] || newStatus;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md animate-scale-in transform transition-all">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#E60012]/5 dark:from-[#E60012]/10 to-transparent">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Update Status</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Confirm activity status change</p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-all hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg hover:rotate-90 duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Activity Name */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold mb-1">Activity</p>
            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{activityName}</p>
          </div>

          {/* Status Change Visualization */}
          <div className="flex items-center justify-center gap-4">
            {/* Current Status */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">From</span>
              <div className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold border-2 whitespace-nowrap ${currentStyle.bg}`}>
                {currentStyle.icon}
                <span>{currentLabel}</span>
              </div>
            </div>

            {/* Arrow */}
            <ArrowRight className="w-6 h-6 text-gray-400 dark:text-gray-500 flex-shrink-0" />

            {/* New Status */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">To</span>
              <div className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold border-2 whitespace-nowrap ${newStyle.bg}`}>
                {newStyle.icon}
                <span>{newLabel}</span>
              </div>
            </div>
          </div>

          {/* Confirmation Text */}
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
            Are you sure you want to update the status of this activity?
          </p>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-transparent to-gray-50/50 dark:to-gray-800/50">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all border-2 border-gray-200 dark:border-gray-600 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#E60012] hover:bg-[#C00010] transition-all shadow-md hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Status'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};


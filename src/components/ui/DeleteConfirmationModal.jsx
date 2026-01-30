import React from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

export const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Deletion',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  itemName = '',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isLoading = false
}) => {
  const handleBackdropClick = (e) => {
    // Only close if clicking on the backdrop/container, not on the modal content
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-[10000] transition-opacity duration-200"
      />
      
      {/* Modal */}
      <div 
        className="fixed inset-0 z-[10001] flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        <div 
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md animate-scale-in transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
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
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {message}
          </p>
          
          {itemName && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Item to delete:</span>
              </p>
              <p className="text-base font-semibold text-red-600 dark:text-red-400 mt-1">
                {itemName}
              </p>
            </div>
          )}

          <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <span className="font-semibold">Warning:</span> This action is permanent and cannot be undone.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t-2 border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all border-2 border-gray-200 dark:border-gray-700 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-all shadow-md hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
      </div>
    </>
  );
};

import React from 'react';
import { Bell, BellOff, X, Loader2 } from 'lucide-react';
import { useUpdateUser } from '@/hooks/api/useUsers';

// `admin_emails` = 1 means this administrator receives system emails
const receivesAdminEmails = (admin) => admin?.admin_emails === 1 || admin?.admin_emails === '1';

/**
 * Confirmation modal for turning email notifications on or off for an administrator.
 * Submits the `admin_emails` flag through the shared update_users endpoint.
 */
export const EnableAdminEmailsModal = ({ isOpen, onClose, admin = null }) => {
  const updateMutation = useUpdateUser();
  const isLoading = updateMutation.isPending;

  // Enabled administrators get the disable flow, and vice versa
  const isDisabling = receivesAdminEmails(admin);

  const handleConfirm = () => {
    if (!admin?.id || isLoading) return;

    updateMutation.mutate(
      { id: admin.id, admin_emails: isDisabling ? 0 : 1 },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    if (isLoading) return;
    updateMutation.reset();
    onClose();
  };

  if (!isOpen) return null;

  const Icon = isDisabling ? BellOff : Bell;

  return (
    <div
      className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md animate-scale-in transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-amber-50 dark:from-amber-900/20 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Icon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {isDisabling ? 'Disable Email Notifications' : 'Enable Email Notifications'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {isDisabling
                  ? 'Stop sending system emails to this administrator'
                  : 'Start sending system emails to this administrator'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-all hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg hover:rotate-90 duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {isDisabling
              ? 'This administrator is currently receiving email notifications. Disable them to stop delivering system emails to their inbox.'
              : 'This administrator is not receiving email notifications. Enable them to start delivering system emails to their inbox.'}
          </p>

          {admin?.name && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Administrator:</span>
              </p>
              <p className="text-base font-semibold text-amber-700 dark:text-amber-400 mt-1">
                {admin.name}
              </p>
              {admin.email && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{admin.email}</p>
              )}
            </div>
          )}

          {updateMutation.isError && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {isDisabling
                ? 'Failed to disable email notifications. Please try again.'
                : 'Failed to enable email notifications. Please try again.'}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-transparent to-gray-50/50 dark:to-gray-800/50">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all border-2 border-gray-200 dark:border-gray-600 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#E60012] hover:bg-[#C00010] transition-all shadow-md hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-[#E60012] disabled:hover:scale-100 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isDisabling ? 'Disabling...' : 'Enabling...'}
              </>
            ) : (
              isDisabling ? 'Disable Emails' : 'Enable Emails'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

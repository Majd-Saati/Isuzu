import React, { useState, useCallback } from 'react';
import { CheckCircle2 } from 'lucide-react';
import {
  RemindersPageHeader,
  RemindersActionBar,
  DealerSelectPanel,
  RemindersTable,
  RemindersTableEmpty,
  SendReminderModal,
  useReminders,
  useDealerSelection,
} from '@/components/reminders';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { mockDealers } from '@/data/mockRemindersData';

const Reminders = () => {
  // Reminders list + filters + pagination (mock-data backed)
  const {
    reminders,
    pagination,
    total,
    stats,
    search,
    dealerId,
    type,
    status,
    hasActiveFilters,
    handleSearchChange,
    handleDealerFilter,
    handleTypeFilter,
    handleStatusFilter,
    clearFilters,
    handlePageChange,
    handlePerPageChange,
    addReminders,
    removeReminder,
  } = useReminders();

  // Dealer checkbox selection for sending reminders
  const {
    selectedDealers,
    selectedCount,
    isSelected,
    toggleDealer,
    allSelected,
    toggleAll,
    clearSelection,
  } = useDealerSelection(mockDealers);

  // Modal + feedback state
  const [showSendModal, setShowSendModal] = useState(false);
  const [deletingReminder, setDeletingReminder] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const openSendModal = useCallback(() => {
    if (selectedCount > 0) setShowSendModal(true);
  }, [selectedCount]);

  const closeSendModal = useCallback(() => setShowSendModal(false), []);

  const handleSend = useCallback(
    (newReminders) => {
      addReminders(newReminders);
      const count = newReminders.length;
      setSuccessMessage(
        `Announcement sent to ${count} dealer${count > 1 ? 's' : ''} successfully.`
      );
      clearSelection();
      window.setTimeout(() => setSuccessMessage(''), 4000);
    },
    [addReminders, clearSelection]
  );

  const handleConfirmDelete = useCallback(() => {
    if (deletingReminder) {
      removeReminder(deletingReminder.id);
      setDeletingReminder(null);
    }
  }, [deletingReminder, removeReminder]);

  return (
    <>
      <RemindersPageHeader stats={stats} />

      {/* Step 1: Dealer selection + send trigger */}
      <DealerSelectPanel
        dealers={mockDealers}
        isSelected={isSelected}
        onToggleDealer={toggleDealer}
        allSelected={allSelected}
        onToggleAll={toggleAll}
        selectedCount={selectedCount}
        onSendClick={openSendModal}
      />

      {/* Step 2: Announcement history (filters + table) */}
      <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm mb-8 overflow-hidden">
        <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-800 px-5 py-4">
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#E60012] text-xs font-semibold text-white">
            2
          </span>
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Announcement history
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Review announcements you have already sent and their delivery
              status.
            </p>
          </div>
        </div>

        <RemindersActionBar
          dealers={mockDealers}
          search={search}
          onSearchChange={handleSearchChange}
          dealerId={dealerId}
          onDealerChange={handleDealerFilter}
          type={type}
          onTypeChange={handleTypeFilter}
          status={status}
          onStatusChange={handleStatusFilter}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />

        {total === 0 ? (
          <RemindersTableEmpty
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
          />
        ) : (
          <RemindersTable
            reminders={reminders}
            pagination={pagination}
            onDelete={setDeletingReminder}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handlePerPageChange}
          />
        )}
      </section>

      {/* Success toast */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-[10002] bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl p-4 shadow-lg animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
              {successMessage}
            </p>
            <button
              onClick={() => setSuccessMessage('')}
              className="ml-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Send Reminder Modal (Formik form) */}
      <SendReminderModal
        isOpen={showSendModal}
        onClose={closeSendModal}
        selectedDealers={selectedDealers}
        onSend={handleSend}
      />

      {/* Delete confirmation */}
      <DeleteConfirmationModal
        isOpen={!!deletingReminder}
        onClose={() => setDeletingReminder(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Announcement"
        message="Are you sure you want to delete this announcement? This action cannot be undone."
        itemName={deletingReminder?.title}
        confirmText="Delete Announcement"
      />
    </>
  );
};

export default Reminders;

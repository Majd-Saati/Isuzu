import React from 'react';
import { useSendReminderModal } from './hooks/useSendReminderModal';
import { ModalHeader } from './components/ModalHeader';
import { ReminderFormFields } from './components/ReminderFormFields';
import { ModalFooter } from './components/ModalFooter';

/**
 * Modal containing the Formik-powered "Send Reminder" form.
 *
 * @param {boolean}  isOpen
 * @param {Function} onClose
 * @param {Array}    selectedDealers - dealers the reminder will target
 * @param {Function} onSend          - receives the built reminders array
 */
export const SendReminderModal = ({ isOpen, onClose, selectedDealers = [], onSend }) => {
  const { formik, handleClose } = useSendReminderModal({ selectedDealers, onSend, onClose });

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col animate-scale-in transform transition-all">
        <ModalHeader onClose={handleClose} dealerCount={selectedDealers.length} />

        <form onSubmit={formik.handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <ReminderFormFields formik={formik} selectedDealers={selectedDealers} />
          <ModalFooter onCancel={handleClose} isSubmitting={formik.isSubmitting} />
        </form>
      </div>
    </div>
  );
};

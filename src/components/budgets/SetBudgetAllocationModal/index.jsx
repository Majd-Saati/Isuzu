import React from 'react';
import { useSetBudgetAllocationModal } from './hooks/useSetBudgetAllocationModal';
import { SetBudgetAllocationModalHeader } from './components/ModalHeader';
import { SetBudgetAllocationModalFooter } from './components/ModalFooter';
import { SetBudgetAllocationFormFields } from './components/FormFields';

export const SetBudgetAllocationModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  terms = [],
  companies = [],
}) => {
  const { formik, handleClose } = useSetBudgetAllocationModal({
    isOpen,
    onClose,
    onSubmit: (payload, callbacks) => {
      onSubmit(payload, callbacks);
    },
  });

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isSubmitting && !formik.isSubmitting) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  const submitting = isSubmitting || formik.isSubmitting;

  return (
    <div
      className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-[10000] p-4 animate-fade-in"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col animate-scale-in overflow-hidden">
        <SetBudgetAllocationModalHeader onClose={handleClose} isSubmitting={submitting} />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit();
          }}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="overflow-y-auto flex-1">
            <SetBudgetAllocationFormFields
              formik={formik}
              terms={terms}
              companies={companies}
              disabled={submitting}
            />
          </div>

          <SetBudgetAllocationModalFooter onClose={handleClose} isSubmitting={submitting} />
        </form>
      </div>
    </div>
  );
};

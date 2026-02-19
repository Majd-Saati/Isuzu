import React from 'react';
import { useAddActivityModal } from './hooks/useAddActivityModal';
import { ModalHeader } from './components/ModalHeader';
import { ActivityFormFields } from './components/ActivityFormFields';
import { ModalFooter } from './components/ModalFooter';

export const AddActivityModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isSubmitting = false, 
  companies = [],
  terms = [],
  planStartDate,
  planEndDate,
  planName,
  preselectedCompanyId = null,
  preselectedCompanyName = '',
  preselectedTermId = null,
  preselectedTermName = '',
  mode = 'create',
  initialActivity = null,
}) => {
  const {
    isEditMode,
    isSubmitting: hookIsSubmitting,
    showCompanyDropdown,
    setShowCompanyDropdown,
    showTermDropdown,
    setShowTermDropdown,
    selectedCompanyName,
    selectedTermName,
    formik,
    handleCompanySelect,
    handleTermSelect,
  } = useAddActivityModal({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting,
    companies,
    terms,
    planStartDate,
    planEndDate,
    preselectedCompanyId,
    preselectedCompanyName,
    preselectedTermId,
    preselectedTermName,
    mode,
    initialActivity,
  });

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isSubmitting && !formik.isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-[10000] p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md animate-scale-in transform transition-all">
        {/* Modal Header */}
        <ModalHeader
          isEditMode={isEditMode}
          onClose={onClose}
          isSubmitting={isSubmitting}
          formikIsSubmitting={formik.isSubmitting}
        />

        {/* Modal Body */}
        <form onSubmit={formik.handleSubmit}>
          <ActivityFormFields
            isEditMode={isEditMode}
            formik={formik}
            isSubmitting={isSubmitting}
            formikIsSubmitting={formik.isSubmitting}
            companies={companies}
            terms={terms}
            planStartDate={planStartDate}
            planEndDate={planEndDate}
            showCompanyDropdown={showCompanyDropdown}
            setShowCompanyDropdown={setShowCompanyDropdown}
            showTermDropdown={showTermDropdown}
            setShowTermDropdown={setShowTermDropdown}
            selectedCompanyName={selectedCompanyName}
            selectedTermName={selectedTermName}
            handleCompanySelect={handleCompanySelect}
            handleTermSelect={handleTermSelect}
          />

          {/* Modal Footer */}
          <ModalFooter
            isEditMode={isEditMode}
            isSubmitting={isSubmitting}
            formikIsSubmitting={formik.isSubmitting}
            onClose={onClose}
          />
        </form>
      </div>
    </div>
  );
};


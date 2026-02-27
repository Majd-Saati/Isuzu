import React, { useState, useRef, useLayoutEffect } from 'react';
import { usePlanForm } from '@/hooks/plan/usePlanForm';
import { usePlanModalState } from '@/hooks/plan/usePlanModalState';
import { useDropdowns } from '@/hooks/plan/useDropdowns';
import { getResetState } from '@/utils/planForm/planFormUtils';
import { AddPlanModalHeader } from './AddPlanModalHeader';
import { AddPlanModalBody } from './AddPlanModalBody';
import { AddPlanModalFooter } from './AddPlanModalFooter';

export const AddPlanModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  mode = 'create',
  initialPlan = null,
  preselectedCompanyId = null,
  preselectedCompanyName = '',
  companies = [],
  terms = [],
}) => {
  const { formik, isAdmin, currentUser } = usePlanForm({ mode, initialPlan, onSubmit });
  const {
    showCompanyDropdown,
    showTermDropdown,
    toggleCompanyDropdown,
    closeCompanyDropdown,
    toggleTermDropdown,
    closeTermDropdown,
  } = useDropdowns();

  const [selectedTermName, setSelectedTermName] = useState('');
  const [selectedCompanyName, setSelectedCompanyName] = useState('');
  const [companyDropdownPosition, setCompanyDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [termDropdownPosition, setTermDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const companyTriggerRef = useRef(null);
  const termTriggerRef = useRef(null);

  usePlanModalState({
    isOpen,
    mode,
    initialPlan,
    isAdmin,
    currentUser,
    companies,
    preselectedCompanyId,
    preselectedCompanyName,
    formik,
    setSelectedTermName,
    setSelectedCompanyName,
  });

  useLayoutEffect(() => {
    if (showCompanyDropdown && companyTriggerRef.current && typeof document !== 'undefined') {
      const rect = companyTriggerRef.current.getBoundingClientRect();
      setCompanyDropdownPosition({ top: rect.bottom + 8, left: rect.left, width: rect.width });
    }
  }, [showCompanyDropdown]);

  useLayoutEffect(() => {
    if (showTermDropdown && termTriggerRef.current && typeof document !== 'undefined') {
      const rect = termTriggerRef.current.getBoundingClientRect();
      setTermDropdownPosition({ top: rect.top - 8, left: rect.left, width: rect.width });
    }
  }, [showTermDropdown]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isSubmitting) handleClose();
  };

  const handleTermSelect = (term) => {
    formik.setFieldValue('termId', term.id);
    setSelectedTermName(term.name);
    closeTermDropdown();
  };

  const handleCompanySelect = (company) => {
    formik.setFieldValue('companyId', company.id);
    setSelectedCompanyName(company.name || company.label || '');
    closeCompanyDropdown();
  };

  const handleClose = () => {
    if (isSubmitting) return;
    const resetState = getResetState({
      mode,
      initialPlan,
      isAdmin,
      userCompanyId: currentUser?.company_id,
      companies,
      preselectedCompanyId,
      preselectedCompanyName,
    });
    formik.resetForm({ values: resetState.formValues });
    setSelectedTermName(resetState.selectedTermName);
    setSelectedCompanyName(resetState.selectedCompanyName);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-scale-in transform transition-all">
        <AddPlanModalHeader mode={mode} onClose={handleClose} isSubmitting={isSubmitting} />

        <form onSubmit={formik.handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <AddPlanModalBody
            formik={formik}
            isAdmin={isAdmin}
            companies={companies}
            terms={terms}
            selectedCompanyName={selectedCompanyName}
            selectedTermName={selectedTermName}
            showCompanyDropdown={showCompanyDropdown}
            showTermDropdown={showTermDropdown}
            companyDropdownPosition={companyDropdownPosition}
            termDropdownPosition={termDropdownPosition}
            companyTriggerRef={companyTriggerRef}
            termTriggerRef={termTriggerRef}
            toggleCompanyDropdown={toggleCompanyDropdown}
            closeCompanyDropdown={closeCompanyDropdown}
            toggleTermDropdown={toggleTermDropdown}
            closeTermDropdown={closeTermDropdown}
            handleCompanySelect={handleCompanySelect}
            handleTermSelect={handleTermSelect}
          />

          <AddPlanModalFooter
            mode={mode}
            isSubmitting={isSubmitting}
            isValid={formik.isValid}
            onClose={handleClose}
          />
        </form>
      </div>
    </div>
  );
};

import React from 'react';
import { useAddEditUserModal } from './hooks/useAddEditUserModal';
import { ModalHeader } from './components/ModalHeader';
import { UserFormFields } from './components/UserFormFields';
import { ModalFooter } from './components/ModalFooter';

export const AddEditUserModal = ({ isOpen, onClose, editData = null }) => {
  const {
    isEditMode,
    isLoading,
    isLoadingCompanies,
    showPassword,
    setShowPassword,
    showCompanyDropdown,
    setShowCompanyDropdown,
    showGenderDropdown,
    setShowGenderDropdown,
    showRoleDropdown,
    setShowRoleDropdown,
    showStatusDropdown,
    setShowStatusDropdown,
    selectedCompanyName,
    selectedGenderName,
    selectedRoleName,
    selectedStatusName,
    dealers,
    formik,
    handleCompanySelect,
    handleGenderSelect,
    handleRoleSelect,
    handleStatusSelect,
    handleClose,
  } = useAddEditUserModal({ isOpen, onClose, editData });

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      formik.resetForm();
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col animate-scale-in transform transition-all">
        {/* Modal Header */}
        <ModalHeader
          isEditMode={isEditMode}
          onClose={handleClose}
          isLoading={isLoading}
        />

        {/* Modal Body */}
        <form onSubmit={formik.handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <UserFormFields
            isEditMode={isEditMode}
            formik={formik}
            isLoading={isLoading}
            showGenderDropdown={showGenderDropdown}
            setShowGenderDropdown={setShowGenderDropdown}
            showCompanyDropdown={showCompanyDropdown}
            setShowCompanyDropdown={setShowCompanyDropdown}
            showRoleDropdown={showRoleDropdown}
            setShowRoleDropdown={setShowRoleDropdown}
            showStatusDropdown={showStatusDropdown}
            setShowStatusDropdown={setShowStatusDropdown}
            selectedGenderName={selectedGenderName}
            selectedCompanyName={selectedCompanyName}
            selectedRoleName={selectedRoleName}
            selectedStatusName={selectedStatusName}
            dealers={dealers}
            isLoadingCompanies={isLoadingCompanies}
            handleGenderSelect={handleGenderSelect}
            handleCompanySelect={handleCompanySelect}
            handleRoleSelect={handleRoleSelect}
            handleStatusSelect={handleStatusSelect}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />

          {/* Modal Footer */}
          <ModalFooter
            isEditMode={isEditMode}
            isLoading={isLoading}
            onCancel={handleClose}
          />
        </form>
      </div>
    </div>
  );
};





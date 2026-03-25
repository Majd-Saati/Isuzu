import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useCreateUser, useUpdateUser } from '@/hooks/api/useUsers';
import { useDealers } from '@/hooks/api/useCompanies';
import { createUserSchema } from '../validation';
import { formatGenderLabel, formatRoleLabel, formatStatusLabel } from '../constants';
import { prepareFormData, resetSelectedNames } from '../utils';

export const useAddEditUserModal = ({ isOpen, onClose, editData = null }) => {
  const isEditMode = !!editData;
  const currentUser = useSelector((state) => state.auth.user);
  const loggedInCountryId = String(currentUser?.country_id ?? '').trim();
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  // Dropdown visibility states
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Selected display names
  const [selectedCompanyName, setSelectedCompanyName] = useState(editData?.company_name || '');
  const [selectedGenderName, setSelectedGenderName] = useState(
    editData?.gender ? formatGenderLabel(editData.gender) : ''
  );
  const [selectedRoleName, setSelectedRoleName] = useState(
    editData?.is_admin !== undefined ? formatRoleLabel(editData.is_admin) : ''
  );
  const [selectedStatusName, setSelectedStatusName] = useState(
    editData?.status !== undefined ? formatStatusLabel(editData.status) : ''
  );
  const [showPassword, setShowPassword] = useState(false);

  const { data: dealers = [], isLoading: isLoadingCompanies } = useDealers();

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const formik = useFormik({
    initialValues: {
      name: editData?.name || '',
      email: editData?.email || '',
      mobile: editData?.mobile || '',
      gender: editData?.gender || '',
      company_id: editData?.company_id || '',
      country_id: isEditMode ? editData?.country_id || '' : loggedInCountryId,
      password: '',
      is_admin: editData?.is_admin ?? '',
      status: editData?.status ?? '',
    },
    validationSchema: createUserSchema(isEditMode),
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: (values, { resetForm }) => {
      const mutation = isEditMode ? updateMutation : createMutation;
      const valuesForApi = isEditMode
        ? values
        : { ...values, country_id: loggedInCountryId || String(values.country_id ?? '').trim() };
      const data = prepareFormData(valuesForApi, isEditMode, editData);

      mutation.mutate(data, {
        onSuccess: () => {
          resetForm();
          const resetNames = resetSelectedNames();
          setSelectedCompanyName(resetNames.selectedCompanyName);
          setSelectedGenderName(resetNames.selectedGenderName);
          setSelectedRoleName(resetNames.selectedRoleName);
          setSelectedStatusName(resetNames.selectedStatusName);
          onClose();
        },
      });
    },
  });

  useEffect(() => {
    if (!isEditMode && isOpen && loggedInCountryId) {
      formik.setFieldValue('country_id', loggedInCountryId);
    }
  }, [isOpen, isEditMode, loggedInCountryId]);

  // Handlers for dropdown selections
  const handleCompanySelect = (company) => {
    formik.setFieldValue('company_id', company.id);
    setSelectedCompanyName(company.label);
    setShowCompanyDropdown(false);
  };

  const handleGenderSelect = (gender) => {
    formik.setFieldValue('gender', gender);
    setSelectedGenderName(formatGenderLabel(gender));
    setShowGenderDropdown(false);
  };

  const handleRoleSelect = async (role) => {
    await formik.setFieldValue('is_admin', role);
    setSelectedRoleName(formatRoleLabel(role));
    setShowRoleDropdown(false);
    
    // Clear company when admin is selected (country stays from logged-in user for create)
    if (role === '1') {
      await formik.setFieldValue('company_id', '');
      setSelectedCompanyName('');
      formik.setFieldError('company_id', undefined);
    }
    
    // Force re-validation with updated values
    setTimeout(() => formik.validateForm(), 0);
  };

  const handleStatusSelect = (status) => {
    formik.setFieldValue('status', status);
    setSelectedStatusName(formatStatusLabel(status));
    setShowStatusDropdown(false);
  };

  // Set selected names when editData changes
  useEffect(() => {
    if (editData?.company_id && dealers.length > 0) {
      const company = dealers.find(c => String(c.id) === String(editData.company_id));
      if (company) setSelectedCompanyName(company.label);
    }
    if (editData?.gender) {
      setSelectedGenderName(formatGenderLabel(editData.gender));
    }
    if (editData?.is_admin !== undefined) {
      setSelectedRoleName(formatRoleLabel(editData.is_admin));
    }
    if (editData?.status !== undefined) {
      setSelectedStatusName(formatStatusLabel(editData.status));
    }
  }, [editData, dealers]);

  const handleClose = () => {
    if (!isLoading) {
      formik.resetForm();
      const resetNames = resetSelectedNames();
      setSelectedCompanyName(resetNames.selectedCompanyName);
      setSelectedGenderName(resetNames.selectedGenderName);
      setSelectedRoleName(resetNames.selectedRoleName);
      setSelectedStatusName(resetNames.selectedStatusName);
      onClose();
    }
  };

  return {
    // State
    isEditMode,
    isLoading,
    isLoadingCompanies,
    showPassword,
    setShowPassword,
    
    // Dropdown states
    showCompanyDropdown,
    setShowCompanyDropdown,
    showGenderDropdown,
    setShowGenderDropdown,
    showRoleDropdown,
    setShowRoleDropdown,
    showStatusDropdown,
    setShowStatusDropdown,
    
    // Selected names
    selectedCompanyName,
    selectedGenderName,
    selectedRoleName,
    selectedStatusName,
    
    // Data
    dealers,
    
    // Formik
    formik,
    
    // Handlers
    handleCompanySelect,
    handleGenderSelect,
    handleRoleSelect,
    handleStatusSelect,
    handleClose,
  };
};





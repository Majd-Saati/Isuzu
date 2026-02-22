import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { useCreateUser, useUpdateUser } from '@/hooks/api/useUsers';
import { useDealers } from '@/hooks/api/useCompanies';
import { useCountries } from '@/hooks/api/useCountries';
import { createUserSchema } from '../validation';
import { formatGenderLabel, formatRoleLabel, formatStatusLabel } from '../constants';
import { prepareFormData, resetSelectedNames } from '../utils';

export const useAddEditUserModal = ({ isOpen, onClose, editData = null }) => {
  const isEditMode = !!editData;
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  // Dropdown visibility states
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Selected display names
  const [selectedCompanyName, setSelectedCompanyName] = useState(editData?.company_name || '');
  const [selectedCountryName, setSelectedCountryName] = useState(editData?.country_name || '');
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

  // Fetch companies and countries
  const { data: dealers = [], isLoading: isLoadingCompanies } = useDealers();
  const { data: countriesData, isLoading: isLoadingCountries } = useCountries({ page: 1, perPage: 100 });
  const countries = countriesData?.countries || [];

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const formik = useFormik({
    initialValues: {
      name: editData?.name || '',
      email: editData?.email || '',
      mobile: editData?.mobile || '',
      gender: editData?.gender || '',
      company_id: editData?.company_id || '',
      country_id: editData?.country_id || '',
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
      const data = prepareFormData(values, isEditMode, editData);

      mutation.mutate(data, {
        onSuccess: () => {
          resetForm();
          const resetNames = resetSelectedNames();
          setSelectedCompanyName(resetNames.selectedCompanyName);
          setSelectedCountryName(resetNames.selectedCountryName);
          setSelectedGenderName(resetNames.selectedGenderName);
          setSelectedRoleName(resetNames.selectedRoleName);
          setSelectedStatusName(resetNames.selectedStatusName);
          onClose();
        },
      });
    },
  });

  // Handlers for dropdown selections
  const handleCompanySelect = (company) => {
    formik.setFieldValue('company_id', company.id);
    setSelectedCompanyName(company.label);
    setShowCompanyDropdown(false);
  };

  const handleCountrySelect = (country) => {
    formik.setFieldValue('country_id', country.id);
    setSelectedCountryName(country.name);
    setShowCountryDropdown(false);
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
    
    // Clear company and country when admin is selected
    if (role === '1') {
      await formik.setFieldValue('company_id', '');
      await formik.setFieldValue('country_id', '');
      setSelectedCompanyName('');
      setSelectedCountryName('');
      // Clear validation errors for these fields
      formik.setFieldError('company_id', undefined);
      formik.setFieldError('country_id', undefined);
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
    if (editData?.country_id && countries.length > 0) {
      const country = countries.find(c => String(c.id) === String(editData.country_id));
      if (country) setSelectedCountryName(country.name);
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
  }, [editData, dealers, countries]);

  const handleClose = () => {
    if (!isLoading) {
      formik.resetForm();
      const resetNames = resetSelectedNames();
      setSelectedCompanyName(resetNames.selectedCompanyName);
      setSelectedCountryName(resetNames.selectedCountryName);
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
    isLoadingCountries,
    showPassword,
    setShowPassword,
    
    // Dropdown states
    showCompanyDropdown,
    setShowCompanyDropdown,
    showCountryDropdown,
    setShowCountryDropdown,
    showGenderDropdown,
    setShowGenderDropdown,
    showRoleDropdown,
    setShowRoleDropdown,
    showStatusDropdown,
    setShowStatusDropdown,
    
    // Selected names
    selectedCompanyName,
    selectedCountryName,
    selectedGenderName,
    selectedRoleName,
    selectedStatusName,
    
    // Data
    dealers,
    countries,
    
    // Formik
    formik,
    
    // Handlers
    handleCompanySelect,
    handleCountrySelect,
    handleGenderSelect,
    handleRoleSelect,
    handleStatusSelect,
    handleClose,
  };
};



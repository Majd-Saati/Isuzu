import React, { useState, useEffect } from 'react';
import { X, Loader2, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/Input';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useCreateUser, useUpdateUser } from '@/hooks/api/useUsers';
import { useDealers } from '@/hooks/api/useCompanies';
import { useCountries } from '@/hooks/api/useCountries';

const createUserSchema = (isEditMode) => Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: isEditMode
    ? Yup.string().notRequired()
    : Yup.string().required('Email is required').email('Please enter a valid email address'),
  mobile: Yup.string()
    .required('Mobile number is required'),
  gender: isEditMode
    ? Yup.string().notRequired()
    : Yup.string().required('Gender is required'),
  company_id: isEditMode
    ? Yup.string().notRequired()
    : Yup.string().when('is_admin', {
        is: '1',
        then: (schema) => schema.notRequired(),
        otherwise: (schema) => schema.required('Company is required'),
      }),
  country_id: isEditMode
    ? Yup.string().notRequired()
    : Yup.string().when('is_admin', {
        is: '1',
        then: (schema) => schema.notRequired(),
        otherwise: (schema) => schema.required('Country is required'),
      }),
  password: isEditMode
    ? Yup.string().notRequired()
    : Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  is_admin: isEditMode
    ? Yup.string().notRequired()
    : Yup.string().required('Role is required'),
  status: Yup.string()
    .required('Status is required'),
});

export const AddEditUserModal = ({ isOpen, onClose, editData = null }) => {
  const isEditMode = !!editData;
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState(editData?.company_name || '');
  const [selectedCountryName, setSelectedCountryName] = useState(editData?.country_name || '');
  const [selectedGenderName, setSelectedGenderName] = useState(editData?.gender ? editData.gender.charAt(0).toUpperCase() + editData.gender.slice(1) : '');
  const [selectedRoleName, setSelectedRoleName] = useState(editData?.is_admin !== undefined ? (editData.is_admin === '1' || editData.is_admin === 1 ? 'Admin' : 'User') : '');
  const [selectedStatusName, setSelectedStatusName] = useState(editData?.status !== undefined ? (editData.status === '1' || editData.status === 1 ? 'Active' : 'Inactive') : '');
  const [showPassword, setShowPassword] = useState(false);

  // Fetch companies for dropdown
  const { data: dealers = [], isLoading: isLoadingCompanies } = useDealers();
  // Fetch countries for dropdown
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
      
      let data;
      if (isEditMode) {
        // API only accepts: user_id, name, mobile, status
        data = {
          id: editData.id,
          name: values.name,
          mobile: values.mobile,
          status: values.status,
        };
      } else {
        // Create user - send all fields
        data = { ...values };
      }

      mutation.mutate(data, {
        onSuccess: () => {
          resetForm();
          setSelectedCompanyName('');
          setSelectedCountryName('');
          setSelectedGenderName('');
          setSelectedRoleName('');
          setSelectedStatusName('');
          onClose();
        },
      });
    },
  });

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
    setSelectedGenderName(gender.charAt(0).toUpperCase() + gender.slice(1));
    setShowGenderDropdown(false);
  };

  const handleRoleSelect = async (role) => {
    await formik.setFieldValue('is_admin', role);
    setSelectedRoleName(role === '1' ? 'Admin' : 'User');
    setShowRoleDropdown(false);
    
    // Clear company and country when admin is selected and clear their errors
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
    setSelectedStatusName(status === '1' ? 'Active' : 'Inactive');
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
      setSelectedGenderName(editData.gender.charAt(0).toUpperCase() + editData.gender.slice(1));
    }
    if (editData?.is_admin !== undefined) {
      setSelectedRoleName(editData.is_admin === '1' || editData.is_admin === 1 ? 'Admin' : 'User');
    }
    if (editData?.status !== undefined) {
      setSelectedStatusName(editData.status === '1' || editData.status === 1 ? 'Active' : 'Inactive');
    }
  }, [editData, dealers, countries]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      formik.resetForm();
      setSelectedCompanyName('');
      setSelectedCountryName('');
      setSelectedGenderName('');
      setSelectedRoleName('');
      setSelectedStatusName('');
      onClose();
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      formik.resetForm();
      setSelectedCompanyName('');
      setSelectedCountryName('');
      setSelectedGenderName('');
      setSelectedRoleName('');
      setSelectedStatusName('');
      onClose();
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
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#E60012]/5 dark:from-[#E60012]/10 to-transparent flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {isEditMode ? 'Edit User' : 'Add New User'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isEditMode ? 'Update user information' : 'Create a new user account'}
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-all hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg hover:rotate-90 duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={formik.handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            {/* Name */}
            <div>
              <Input
                label="Full Name"
                name="name"
                placeholder="e.g., John Doe"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.name}
                touched={formik.submitCount > 0}
                disabled={isLoading}
              />
              {formik.submitCount > 0 && <ErrorMessage message={formik.errors.name} />}
            </div>

            {/* Email - Only show in create mode */}
            {!isEditMode && (
              <div>
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="e.g., john@example.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.email}
                  touched={formik.submitCount > 0}
                  disabled={isLoading}
                />
                {formik.submitCount > 0 && <ErrorMessage message={formik.errors.email} />}
              </div>
            )}

            {/* Mobile */}
            <div>
              <Input
                label="Mobile Number"
                name="mobile"
                placeholder="e.g., +2012345678903"
                value={formik.values.mobile}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.mobile}
                touched={formik.submitCount > 0}
                disabled={isLoading}
              />
              {formik.submitCount > 0 && <ErrorMessage message={formik.errors.mobile} />}
            </div>

            {/* Gender - Only show in create mode */}
            {!isEditMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowGenderDropdown(!showGenderDropdown)}
                    onBlur={() => setTimeout(() => setShowGenderDropdown(false), 200)}
                    disabled={isLoading}
                    className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 ${
                      formik.errors.gender && formik.submitCount > 0
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    } text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 focus:border-gray-400 dark:focus:border-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <span className={selectedGenderName ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}>
                      {selectedGenderName || 'Select gender'}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform ${showGenderDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showGenderDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl z-[10000] max-h-48 overflow-y-auto">
                      <button
                        type="button"
                        onClick={() => handleGenderSelect('male')}
                        className="w-full px-4 py-3 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors first:rounded-t-xl last:rounded-b-xl"
                      >
                        Male
                      </button>
                      <button
                        type="button"
                        onClick={() => handleGenderSelect('female')}
                        className="w-full px-4 py-3 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors first:rounded-t-xl last:rounded-b-xl"
                      >
                        Female
                      </button>
                    </div>
                  )}
                </div>
                {formik.submitCount > 0 && <ErrorMessage message={formik.errors.gender} />}
              </div>
            )}

            {/* Company Dropdown - Only show in create mode */}
            {!isEditMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company {formik.values.is_admin === '1' && <span className="text-gray-400 font-normal">(Optional)</span>}
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
                    onBlur={() => setTimeout(() => setShowCompanyDropdown(false), 200)}
                    disabled={isLoading || isLoadingCompanies}
                    className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 ${
                      formik.errors.company_id && formik.submitCount > 0 && formik.values.is_admin !== '1'
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    } text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 focus:border-gray-400 dark:focus:border-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <span className={selectedCompanyName ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}>
                      {isLoadingCompanies ? 'Loading...' : selectedCompanyName || 'Select company'}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform ${showCompanyDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showCompanyDropdown && !isLoadingCompanies && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl z-[10000] max-h-48 overflow-y-auto">
                      {dealers.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">No companies available</div>
                      ) : (
                        dealers.map((company) => (
                          <button
                            key={company.id}
                            type="button"
                            onClick={() => handleCompanySelect(company)}
                            className="w-full px-4 py-3 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors first:rounded-t-xl last:rounded-b-xl"
                          >
                            {company.label}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
                {formik.submitCount > 0 && formik.values.is_admin !== '1' && <ErrorMessage message={formik.errors.company_id} />}
              </div>
            )}

            {/* Country Dropdown - Only show in create mode */}
            {!isEditMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Country {formik.values.is_admin === '1' && <span className="text-gray-400 font-normal">(Optional)</span>}
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    onBlur={() => setTimeout(() => setShowCountryDropdown(false), 200)}
                    disabled={isLoading || isLoadingCountries}
                    className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 ${
                      formik.errors.country_id && formik.submitCount > 0 && formik.values.is_admin !== '1'
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    } text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 focus:border-gray-400 dark:focus:border-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <span className={selectedCountryName ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}>
                      {isLoadingCountries ? 'Loading...' : selectedCountryName || 'Select country'}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showCountryDropdown && !isLoadingCountries && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl z-[10000] max-h-48 overflow-y-auto">
                      {countries.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">No countries available</div>
                      ) : (
                        countries.map((country) => (
                          <button
                            key={country.id}
                            type="button"
                            onClick={() => handleCountrySelect(country)}
                            className="w-full px-4 py-3 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors first:rounded-t-xl last:rounded-b-xl"
                          >
                            {country.name}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
                {formik.submitCount > 0 && formik.values.is_admin !== '1' && <ErrorMessage message={formik.errors.country_id} />}
              </div>
            )}

            {/* Password - Only show in create mode */}
            {!isEditMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isLoading}
                    className={`w-full px-4 py-3 pr-12 rounded-xl bg-white dark:bg-gray-800 border-2 ${
                      formik.errors.password && formik.submitCount > 0
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    } text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 focus:border-gray-400 dark:focus:border-gray-500 transition-all disabled:opacity-50`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formik.submitCount > 0 && <ErrorMessage message={formik.errors.password} />}
              </div>
            )}

            {/* Role - Only show in create mode */}
            {!isEditMode && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                      onBlur={() => setTimeout(() => setShowRoleDropdown(false), 200)}
                      disabled={isLoading}
                      className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 ${
                        formik.errors.is_admin && formik.submitCount > 0
                          ? 'border-red-500 dark:border-red-500'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                      } text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 focus:border-gray-400 dark:focus:border-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <span className={selectedRoleName ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}>
                        {selectedRoleName || 'Select role'}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform ${showRoleDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showRoleDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl z-[10000] max-h-48 overflow-y-auto">
                        <button
                          type="button"
                          onClick={() => handleRoleSelect('0')}
                          className="w-full px-4 py-3 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors first:rounded-t-xl last:rounded-b-xl"
                        >
                          User
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRoleSelect('1')}
                          className="w-full px-4 py-3 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors first:rounded-t-xl last:rounded-b-xl"
                        >
                          Admin
                        </button>
                      </div>
                    )}
                  </div>
                  {formik.submitCount > 0 && <ErrorMessage message={formik.errors.is_admin} />}
                </div>

                {/* Status in create mode - side by side with Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                      onBlur={() => setTimeout(() => setShowStatusDropdown(false), 200)}
                      disabled={isLoading}
                      className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 ${
                        formik.errors.status && formik.submitCount > 0
                          ? 'border-red-500 dark:border-red-500'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                      } text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 focus:border-gray-400 dark:focus:border-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <span className={selectedStatusName ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}>
                        {selectedStatusName || 'Select status'}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showStatusDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl z-[10000] max-h-48 overflow-y-auto">
                        <button
                          type="button"
                          onClick={() => handleStatusSelect('1')}
                          className="w-full px-4 py-3 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors first:rounded-t-xl last:rounded-b-xl"
                        >
                          Active
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusSelect('0')}
                          className="w-full px-4 py-3 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors first:rounded-t-xl last:rounded-b-xl"
                        >
                          Inactive
                        </button>
                      </div>
                    )}
                  </div>
                  {formik.submitCount > 0 && <ErrorMessage message={formik.errors.status} />}
                </div>
              </div>
            )}

            {/* Status - Full width in edit mode */}
            {isEditMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    onBlur={() => setTimeout(() => setShowStatusDropdown(false), 200)}
                    disabled={isLoading}
                    className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 ${
                      formik.errors.status && formik.submitCount > 0
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    } text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 focus:border-gray-400 dark:focus:border-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <span className={selectedStatusName ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}>
                      {selectedStatusName || 'Select status'}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showStatusDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl z-[10000] max-h-48 overflow-y-auto">
                      <button
                        type="button"
                        onClick={() => handleStatusSelect('1')}
                        className="w-full px-4 py-3 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors first:rounded-t-xl last:rounded-b-xl"
                      >
                        Active
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusSelect('0')}
                        className="w-full px-4 py-3 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors first:rounded-t-xl last:rounded-b-xl"
                      >
                        Inactive
                      </button>
                    </div>
                  )}
                </div>
                {formik.submitCount > 0 && <ErrorMessage message={formik.errors.status} />}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-transparent to-gray-50/50 dark:to-gray-800/50 flex-shrink-0">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all border-2 border-gray-200 dark:border-gray-600 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#E60012] hover:bg-[#C00010] transition-all shadow-md hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-[#E60012] disabled:hover:scale-100 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditMode ? 'Update User' : 'Add User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

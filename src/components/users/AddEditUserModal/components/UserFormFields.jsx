import React from 'react';
import { Input } from '@/components/ui/Input';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { CustomDropdown } from './CustomDropdown';
import { PasswordField } from './PasswordField';
import { GENDER_OPTIONS, ROLE_OPTIONS, STATUS_OPTIONS } from '../constants';

export const UserFormFields = ({
  isEditMode,
  formik,
  isLoading,
  // Dropdown states
  showGenderDropdown,
  setShowGenderDropdown,
  showCompanyDropdown,
  setShowCompanyDropdown,
  showCountryDropdown,
  setShowCountryDropdown,
  showRoleDropdown,
  setShowRoleDropdown,
  showStatusDropdown,
  setShowStatusDropdown,
  // Selected names
  selectedGenderName,
  selectedCompanyName,
  selectedCountryName,
  selectedRoleName,
  selectedStatusName,
  // Data
  dealers,
  countries,
  isLoadingCompanies,
  isLoadingCountries,
  // Handlers
  handleGenderSelect,
  handleCompanySelect,
  handleCountrySelect,
  handleRoleSelect,
  handleStatusSelect,
  // Password
  showPassword,
  setShowPassword,
}) => {
  const companyOptions = dealers.map(company => ({
    value: company.id,
    label: company.label,
  }));

  const countryOptions = countries.map(country => ({
    value: country.id,
    label: country.name,
  }));

  return (
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
        <CustomDropdown
          label="Gender"
          placeholder="Select gender"
          selectedValue={selectedGenderName}
          isOpen={showGenderDropdown}
          onToggle={() => setShowGenderDropdown(!showGenderDropdown)}
          onClose={() => setShowGenderDropdown(false)}
          options={GENDER_OPTIONS}
          onSelect={(option) => handleGenderSelect(option.value)}
          error={formik.errors.gender}
          touched={formik.submitCount > 0}
          disabled={isLoading}
        />
      )}

      {/* Company Dropdown - Only show in create mode */}
      {!isEditMode && (
        <CustomDropdown
          label="Company"
          placeholder="Select company"
          selectedValue={selectedCompanyName}
          isOpen={showCompanyDropdown}
          onToggle={() => setShowCompanyDropdown(!showCompanyDropdown)}
          onClose={() => setShowCompanyDropdown(false)}
          options={companyOptions}
          onSelect={(option) => {
            const company = dealers.find(c => c.id === option.value);
            if (company) handleCompanySelect(company);
          }}
          error={formik.errors.company_id}
          touched={formik.submitCount > 0 && formik.values.is_admin !== '1'}
          disabled={isLoading}
          isLoading={isLoadingCompanies}
          optionalLabel={formik.values.is_admin === '1' ? '(Optional)' : null}
        />
      )}

      {/* Country Dropdown - Only show in create mode */}
      {!isEditMode && (
        <CustomDropdown
          label="Country"
          placeholder="Select country"
          selectedValue={selectedCountryName}
          isOpen={showCountryDropdown}
          onToggle={() => setShowCountryDropdown(!showCountryDropdown)}
          onClose={() => setShowCountryDropdown(false)}
          options={countryOptions}
          onSelect={(option) => {
            const country = countries.find(c => c.id === option.value);
            if (country) handleCountrySelect(country);
          }}
          error={formik.errors.country_id}
          touched={formik.submitCount > 0 && formik.values.is_admin !== '1'}
          disabled={isLoading}
          isLoading={isLoadingCountries}
          optionalLabel={formik.values.is_admin === '1' ? '(Optional)' : null}
        />
      )}

      {/* Password - Only show in create mode */}
      {!isEditMode && (
        <PasswordField
          label="Password"
          name="password"
          placeholder="Enter password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.password}
          touched={formik.submitCount > 0}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          disabled={isLoading}
        />
      )}

      {/* Role and Status - Only show in create mode */}
      {!isEditMode && (
        <div className="grid grid-cols-2 gap-4">
          <CustomDropdown
            label="Role"
            placeholder="Select role"
            selectedValue={selectedRoleName}
            isOpen={showRoleDropdown}
            onToggle={() => setShowRoleDropdown(!showRoleDropdown)}
            onClose={() => setShowRoleDropdown(false)}
            options={ROLE_OPTIONS}
            onSelect={(option) => handleRoleSelect(option.value)}
            error={formik.errors.is_admin}
            touched={formik.submitCount > 0}
            disabled={isLoading}
          />

          <CustomDropdown
            label="Status"
            placeholder="Select status"
            selectedValue={selectedStatusName}
            isOpen={showStatusDropdown}
            onToggle={() => setShowStatusDropdown(!showStatusDropdown)}
            onClose={() => setShowStatusDropdown(false)}
            options={STATUS_OPTIONS}
            onSelect={(option) => handleStatusSelect(option.value)}
            error={formik.errors.status}
            touched={formik.submitCount > 0}
            disabled={isLoading}
          />
        </div>
      )}

      {/* Status - Full width in edit mode */}
      {isEditMode && (
        <CustomDropdown
          label="Status"
          placeholder="Select status"
          selectedValue={selectedStatusName}
          isOpen={showStatusDropdown}
          onToggle={() => setShowStatusDropdown(!showStatusDropdown)}
          onClose={() => setShowStatusDropdown(false)}
          options={STATUS_OPTIONS}
          onSelect={(option) => handleStatusSelect(option.value)}
          error={formik.errors.status}
          touched={formik.submitCount > 0}
          disabled={isLoading}
        />
      )}
    </div>
  );
};


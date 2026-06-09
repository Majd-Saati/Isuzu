import { normalizeStatusValue } from './constants';

export const getFormInitialValues = (editData, { loggedInCountryId = '', isEditMode = false } = {}) => {
  if (!isEditMode || !editData) {
    return {
      name: '',
      email: '',
      mobile: '',
      gender: '',
      company_id: '',
      country_id: loggedInCountryId,
      password: '',
      is_admin: '',
      status: '',
    };
  }

  return {
    name: editData.name || '',
    email: editData.email || '',
    mobile: editData.mobile || '',
    gender: editData.gender || '',
    company_id: editData.company_id || '',
    country_id: editData.country_id || '',
    password: '',
    is_admin: editData.is_admin ?? '',
    status: normalizeStatusValue(editData.status),
  };
};

/**
 * Prepares form data for API submission
 * @param {Object} values - Form values from Formik
 * @param {boolean} isEditMode - Whether in edit mode
 * @param {Object} editData - Original edit data
 * @returns {Object} Prepared data for API
 */
export const prepareFormData = (values, isEditMode, editData, { forceAdminRole = false } = {}) => {
  if (isEditMode) {
    const payload = {
      id: editData.id,
      name: values.name,
      mobile: values.mobile,
      status: values.status,
    };

    const password = String(values.password ?? '').trim();
    if (password) {
      payload.password = password;
    }

    return payload;
  }
  const { company_id, is_admin, ...rest } = values;

  if (forceAdminRole) {
    return { ...rest, is_admin: 1 };
  }

  return { ...rest, company_id, is_admin };
};

/**
 * Resets all selected names to empty strings
 * @returns {Object} Object with all selected names reset
 */
export const resetSelectedNames = () => ({
  selectedCompanyName: '',
  selectedGenderName: '',
  selectedRoleName: '',
  selectedStatusName: '',
});





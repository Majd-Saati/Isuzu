/**
 * Prepares form data for API submission
 * @param {Object} values - Form values from Formik
 * @param {boolean} isEditMode - Whether in edit mode
 * @param {Object} editData - Original edit data
 * @returns {Object} Prepared data for API
 */
export const prepareFormData = (values, isEditMode, editData) => {
  if (isEditMode) {
    // API only accepts: user_id, name, mobile, status
    return {
      id: editData.id,
      name: values.name,
      mobile: values.mobile,
      status: values.status,
    };
  }
  // Create user - send all fields
  return { ...values };
};

/**
 * Resets all selected names to empty strings
 * @returns {Object} Object with all selected names reset
 */
export const resetSelectedNames = () => ({
  selectedCompanyName: '',
  selectedCountryName: '',
  selectedGenderName: '',
  selectedRoleName: '',
  selectedStatusName: '',
});




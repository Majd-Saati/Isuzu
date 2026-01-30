/**
 * Gets initial form values for plan form
 * @param {Object} params - Parameters for initial values
 * @param {Object|null} params.initialPlan - Existing plan data (for edit mode)
 * @param {boolean} params.isAdmin - Whether the current user is an admin
 * @param {string|number|null} params.userCompanyId - Current user's company ID
 * @returns {Object} Initial form values
 */
export const getInitialFormValues = ({ initialPlan, isAdmin, userCompanyId }) => {
  if (initialPlan) {
    return {
      planName: initialPlan.name || '',
      termId: initialPlan.term_id || '',
      companyId: initialPlan.company_id || '',
      description: initialPlan.description || '',
      status: initialPlan.status?.toString() ?? '1',
    };
  }

  return {
    planName: '',
    termId: '',
    companyId: (!isAdmin && userCompanyId) ? String(userCompanyId) : '',
    description: '',
    status: '1',
  };
};

/**
 * Transforms form values to API payload
 * @param {Object} params - Parameters for payload transformation
 * @param {Object} params.values - Form values from Formik
 * @param {string} params.mode - 'create' or 'edit'
 * @param {Object|null} params.initialPlan - Existing plan data (for edit mode)
 * @param {boolean} params.isAdmin - Whether the current user is an admin
 * @param {string|number|null} params.userCompanyId - Current user's company ID
 * @returns {Object} API payload
 */
export const transformFormValuesToPayload = ({
  values,
  mode,
  initialPlan,
  isAdmin,
  userCompanyId,
}) => {
  if (mode === 'edit') {
    return {
      plan_id: initialPlan?.id,
      name: values.planName,
      description: values.description,
      status: values.status,
      term_id: values.termId,
    };
  }

  // Create mode
  return {
    name: values.planName,
    description: values.description,
    // For normal users, use current user's company_id; for admins, use selected company_id
    company_id: !isAdmin && userCompanyId 
      ? String(userCompanyId) 
      : values.companyId,
    term_id: values.termId,
  };
};

/**
 * Gets default reset values for form when modal closes
 * @param {Object} params - Parameters for reset values
 * @param {string} params.mode - 'create' or 'edit'
 * @param {Object|null} params.initialPlan - Existing plan data (for edit mode)
 * @param {boolean} params.isAdmin - Whether the current user is an admin
 * @param {string|number|null} params.userCompanyId - Current user's company ID
 * @param {string|null} params.preselectedCompanyId - Pre-selected company ID
 * @returns {Object} Default reset values
 */
export const getDefaultResetValues = ({
  mode,
  initialPlan,
  isAdmin,
  userCompanyId,
  preselectedCompanyId,
}) => {
  if (mode === 'edit' && initialPlan) {
    return {
      planName: initialPlan.name || '',
      termId: initialPlan.term_id || '',
      companyId: initialPlan.company_id || '',
      description: initialPlan.description || '',
      status: initialPlan.status ?? '1',
    };
  }

  // Create mode
  const defaultCompanyId = !isAdmin && userCompanyId 
    ? String(userCompanyId) 
    : preselectedCompanyId || '';

  return {
    planName: '',
    termId: '',
    companyId: defaultCompanyId,
    description: '',
    status: '1',
  };
};

/**
 * Finds company name from companies list
 * @param {Array} companies - List of companies
 * @param {string|number} companyId - Company ID to find
 * @param {string} fallback - Fallback name if not found
 * @returns {string} Company name
 */
export const findCompanyName = (companies, companyId, fallback = 'Your Company') => {
  if (!companyId || !companies) return fallback;
  const company = companies.find(c => String(c.id) === String(companyId));
  return company?.name || fallback;
};

/**
 * Gets reset state for form and selected names when modal closes
 * @param {Object} params - Parameters for reset state
 * @param {string} params.mode - 'create' or 'edit'
 * @param {Object|null} params.initialPlan - Existing plan data (for edit mode)
 * @param {boolean} params.isAdmin - Whether the current user is an admin
 * @param {string|number|null} params.userCompanyId - Current user's company ID
 * @param {Array} params.companies - List of companies
 * @param {string|null} params.preselectedCompanyId - Pre-selected company ID
 * @param {string} params.preselectedCompanyName - Pre-selected company name
 * @returns {Object} Reset state with form values and selected names
 */
export const getResetState = ({
  mode,
  initialPlan,
  isAdmin,
  userCompanyId,
  companies,
  preselectedCompanyId,
  preselectedCompanyName,
}) => {
  if (mode === 'edit' && initialPlan) {
    return {
      formValues: getDefaultResetValues({ mode, initialPlan, isAdmin, userCompanyId, preselectedCompanyId }),
      selectedTermName: initialPlan.term_name || '',
      selectedCompanyName: initialPlan.company_name || '',
    };
  }

  // Create mode
  const defaultCompanyId = !isAdmin && userCompanyId 
    ? String(userCompanyId) 
    : preselectedCompanyId || '';
  
  const defaultCompanyName = !isAdmin && userCompanyId
    ? findCompanyName(companies, userCompanyId)
    : preselectedCompanyName || '';

  return {
    formValues: getDefaultResetValues({ mode, initialPlan, isAdmin, userCompanyId, preselectedCompanyId }),
    selectedTermName: '',
    selectedCompanyName: defaultCompanyName,
  };
};


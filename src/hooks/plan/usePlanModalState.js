import { useEffect, useRef } from 'react';
import { findCompanyName } from '@/utils/planForm/planFormUtils';

/**
 * Custom hook for managing plan modal state synchronization
 * Handles form initialization when modal opens and reset when it closes
 * @param {Object} params - Hook parameters
 * @param {boolean} params.isOpen - Whether the modal is open
 * @param {string} params.mode - 'create' or 'edit'
 * @param {Object|null} params.initialPlan - Existing plan data (for edit mode)
 * @param {boolean} params.isAdmin - Whether the current user is an admin
 * @param {Object} params.currentUser - Current user object
 * @param {Array} params.companies - List of companies
 * @param {string|null} params.preselectedCompanyId - Pre-selected company ID
 * @param {string} params.preselectedCompanyName - Pre-selected company name
 * @param {Function} params.formik - Formik instance
 * @param {Function} params.setSelectedTermName - Setter for selected term name
 * @param {Function} params.setSelectedCompanyName - Setter for selected company name
 */
export const usePlanModalState = ({
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
}) => {
  // Track previous isOpen state to detect when modal opens
  const prevIsOpenRef = useRef(false);

  // Sync selected names and form values when modal opens
  useEffect(() => {
    // Only run when modal opens (transitions from closed to open)
    if (!isOpen || prevIsOpenRef.current === isOpen) {
      prevIsOpenRef.current = isOpen;
      return;
    }
    
    prevIsOpenRef.current = isOpen;

    if (mode === 'edit' && initialPlan) {
      // Edit mode: populate form with existing plan data
      setSelectedTermName(initialPlan?.term_name || '');
      setSelectedCompanyName(initialPlan?.company_name || '');
      formik.setValues({
        planName: initialPlan.name || '',
        termId: initialPlan.term_id || '',
        companyId: initialPlan.company_id || '',
        description: initialPlan.description || '',
        status: initialPlan.status?.toString() ?? '1',
      });
    } else if (mode === 'create') {
      // Create mode: handle company selection based on user role
      if (!isAdmin && currentUser?.company_id) {
        // Normal user: auto-set company_id from current user
        const companyIdStr = String(currentUser.company_id);
        formik.setFieldValue('companyId', companyIdStr);
        const companyName = findCompanyName(companies, currentUser.company_id);
        setSelectedCompanyName(companyName);
      } else if (preselectedCompanyId) {
        // Admin user: pre-select company if provided (from URL filter)
        formik.setFieldValue('companyId', preselectedCompanyId);
        setSelectedCompanyName(preselectedCompanyName);
      }
      setSelectedTermName('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, mode, isAdmin, currentUser?.company_id]);
};


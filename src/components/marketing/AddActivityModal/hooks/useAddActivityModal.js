import { useState, useMemo, useEffect } from 'react';
import { useFormik } from 'formik';
import { createActivitySchema } from '../validation';
import { formatDateForInput, extractActivityDates, prepareFormPayload } from '../utils';

export const useAddActivityModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  companies = [],
  terms = [],
  planStartDate,
  planEndDate,
  preselectedCompanyId = null,
  preselectedCompanyName = '',
  preselectedTermId = null,
  preselectedTermName = '',
  mode = 'create',
  initialActivity = null,
}) => {
  const isEditMode = mode === 'edit';
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showTermDropdown, setShowTermDropdown] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState('');
  const [selectedTermName, setSelectedTermName] = useState('');

  // Create validation schema with plan constraints
  const validationSchema = useMemo(
    () => createActivitySchema(planStartDate, planEndDate, isEditMode),
    [planStartDate, planEndDate, isEditMode]
  );

  // Memoize initial values to ensure they update when initialActivity changes
  const initialValues = useMemo(() => {
    if (isEditMode && initialActivity) {
      const { startDate, endDate } = extractActivityDates(initialActivity);
      
      return {
        activityName: initialActivity.name || '',
        companyId: '',
        termId: '',
        startsAt: formatDateForInput(startDate),
        endsAt: formatDateForInput(endDate),
      };
    }
    
    return {
      activityName: '',
      companyId: preselectedCompanyId ? String(preselectedCompanyId) : '',
      termId: preselectedTermId ? String(preselectedTermId) : '',
      startsAt: '',
      endsAt: '',
    };
  }, [isEditMode, initialActivity, preselectedCompanyId, preselectedTermId]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      const payload = prepareFormPayload(values, isEditMode, initialActivity);
      setSubmitting(true);
      onSubmit(payload);
    },
  });

  // Pre-select company and term when modal opens with preselected values (create mode only)
  // Or pre-fill activity data in edit mode
  useEffect(() => {
    if (!isOpen) return;
    
    if (isEditMode && initialActivity) {
      // Edit mode: pre-fill with activity data
      const { startDate, endDate } = extractActivityDates(initialActivity);
      
      formik.setValues({
        activityName: initialActivity.name || '',
        companyId: '',
        termId: '',
        startsAt: formatDateForInput(startDate),
        endsAt: formatDateForInput(endDate),
      });
    } else {
      // Create mode: pre-select company and term
      if (preselectedCompanyId) {
        formik.setFieldValue('companyId', String(preselectedCompanyId));
        if (preselectedCompanyName) {
          setSelectedCompanyName(preselectedCompanyName);
        } else {
          const company = companies.find(c => String(c.id) === String(preselectedCompanyId));
          setSelectedCompanyName(company?.name || company?.label || '');
        }
      }
      if (preselectedTermId) {
        formik.setFieldValue('termId', String(preselectedTermId));
        if (preselectedTermName) {
          setSelectedTermName(preselectedTermName);
        } else {
          const term = terms.find(t => String(t.id) === String(preselectedTermId));
          setSelectedTermName(term?.name || term?.term_name || '');
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isEditMode, initialActivity?.id, initialActivity?.starts_at, initialActivity?.ends_at]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      let resetValues;
      if (isEditMode && initialActivity) {
        const { startDate, endDate } = extractActivityDates(initialActivity);
        resetValues = {
          activityName: initialActivity.name || '',
          companyId: '',
          termId: '',
          startsAt: formatDateForInput(startDate),
          endsAt: formatDateForInput(endDate),
        };
      } else {
        resetValues = {
          activityName: '',
          companyId: preselectedCompanyId ? String(preselectedCompanyId) : '',
          termId: preselectedTermId ? String(preselectedTermId) : '',
          startsAt: '',
          endsAt: '',
        };
      }
      
      formik.resetForm({ values: resetValues });
      
      // Reset company name display
      if (preselectedCompanyId && preselectedCompanyName) {
        setSelectedCompanyName(preselectedCompanyName);
      } else if (preselectedCompanyId) {
        const company = companies.find(c => String(c.id) === String(preselectedCompanyId));
        setSelectedCompanyName(company?.name || company?.label || '');
      } else {
        setSelectedCompanyName('');
      }
      
      // Reset term name display
      if (preselectedTermId && preselectedTermName) {
        setSelectedTermName(preselectedTermName);
      } else if (preselectedTermId) {
        const term = terms.find(t => String(t.id) === String(preselectedTermId));
        setSelectedTermName(term?.name || term?.term_name || '');
      } else {
        setSelectedTermName('');
      }
      
      formik.setSubmitting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleCompanySelect = (company) => {
    formik.setFieldValue('companyId', company.id);
    formik.setFieldTouched('companyId', true);
    setSelectedCompanyName(company.name || company.label || '');
    setShowCompanyDropdown(false);
  };

  const handleTermSelect = (term) => {
    formik.setFieldValue('termId', term.id);
    formik.setFieldTouched('termId', true);
    setSelectedTermName(term.name || term.term_name || '');
    setShowTermDropdown(false);
  };

  return {
    isEditMode,
    isSubmitting,
    showCompanyDropdown,
    setShowCompanyDropdown,
    showTermDropdown,
    setShowTermDropdown,
    selectedCompanyName,
    selectedTermName,
    formik,
    handleCompanySelect,
    handleTermSelect,
  };
};


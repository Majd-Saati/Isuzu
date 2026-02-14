import React, { useMemo } from 'react';
import { X, ChevronDown, Loader2, Calendar } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/Input';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

// Create validation schema with plan date constraints
// Use string-based YYYY-MM-DD tests and construct local Date(year, month-1, day)
// to avoid timezone offsets when comparing dates.
const createActivitySchema = (planStartDate, planEndDate, isEditMode = false) => {
  // helper to parse YYYY-MM-DD into a local Date (no timezone offset)
  const parseYMD = (val) => {
    if (!val || typeof val !== 'string') return null;
    const parts = val.split('-').map((p) => Number(p));
    if (parts.length !== 3) return null;
    const [y, m, d] = parts;
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  };

  return Yup.object({
    activityName: Yup.string()
      .required('Activity name is required')
      .min(3, 'Activity name must be at least 3 characters')
      .max(100, 'Activity name must be less than 100 characters'),
    companyId: isEditMode ? Yup.string() : Yup.string().required('Dealer is required'),
    termId: isEditMode ? Yup.string() : Yup.string().required('Term is required'),
    startsAt: Yup.string()
      .required('Start date is required')
      .test('valid-date', 'Please enter a valid date', function(value) {
        if (!value) return false;
        return parseYMD(value) instanceof Date && !isNaN(parseYMD(value).getTime());
      })
      .test('min-plan-start', `Start date cannot be before plan start (${planStartDate})`, function(value) {
        if (!value || !planStartDate) return true;
        const v = parseYMD(value);
        const p = parseYMD(planStartDate) || parseYMD(formatDateForInput(planStartDate));
        if (!v || !p) return true;
        return v.getTime() >= p.getTime();
      })
      .test('max-plan-end', `Start date cannot be after plan end (${planEndDate})`, function(value) {
        if (!value || !planEndDate) return true;
        const v = parseYMD(value);
        const p = parseYMD(planEndDate) || parseYMD(formatDateForInput(planEndDate));
        if (!v || !p) return true;
        return v.getTime() <= p.getTime();
      }),
    endsAt: Yup.string()
      .required('End date is required')
      .test('valid-date', 'Please enter a valid date', function(value) {
        if (!value) return false;
        return parseYMD(value) instanceof Date && !isNaN(parseYMD(value).getTime());
      })
      .test('min-after-start', 'End date must be after start date', function(value) {
        const { startsAt } = this.parent || {};
        if (!value || !startsAt) return true;
        const v = parseYMD(value);
        const s = parseYMD(startsAt);
        if (!v || !s) return true;
        return v.getTime() >= s.getTime();
      })
      .test('max-plan-end', `End date cannot be after plan end (${planEndDate})`, function(value) {
        if (!value || !planEndDate) return true;
        const v = parseYMD(value);
        const p = parseYMD(planEndDate) || parseYMD(formatDateForInput(planEndDate));
        if (!v || !p) return true;
        return v.getTime() <= p.getTime();
      }),
  });
};

// Format date for display
const formatDateDisplay = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch {
    return 'N/A';
  }
};

export const AddActivityModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isSubmitting = false, 
  companies = [],
  terms = [],
  planStartDate,
  planEndDate,
  planName,
  preselectedCompanyId = null,
  preselectedCompanyName = '',
  preselectedTermId = null,
  preselectedTermName = '',
  mode = 'create', // 'create' or 'edit'
  initialActivity = null, // For edit mode: { id, name, starts_at, ends_at }
}) => {
  const [showCompanyDropdown, setShowCompanyDropdown] = React.useState(false);
  const [showTermDropdown, setShowTermDropdown] = React.useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = React.useState('');
  const [selectedTermName, setSelectedTermName] = React.useState('');

  const isEditMode = mode === 'edit';

  // Create validation schema with plan constraints
  const validationSchema = useMemo(
    () => createActivitySchema(planStartDate, planEndDate, isEditMode),
    [planStartDate, planEndDate, isEditMode]
  );

  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return '';
    }
  };

  // Memoize initial values to ensure they update when initialActivity changes
  const initialValues = useMemo(() => {
    if (isEditMode && initialActivity) {
      // Try multiple possible date field names
      const startDate = initialActivity.starts_at || initialActivity.start_date || initialActivity.start || initialActivity.duration?.start;
      const endDate = initialActivity.ends_at || initialActivity.end_date || initialActivity.end || initialActivity.duration?.end;
      
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
      if (isEditMode) {
        // Edit mode: only send activity_id, name, starts_at, ends_at
        const payload = {
          activity_id: initialActivity.id,
          name: values.activityName,
          starts_at: values.startsAt,
          ends_at: values.endsAt,
        };
        setSubmitting(true);
        onSubmit(payload);
      } else {
        // Create mode: send all fields
        const payload = {
          name: values.activityName,
          company_id: values.companyId,
          term_id: values.termId,
          starts_at: values.startsAt,
          ends_at: values.endsAt,
        };
        setSubmitting(true);
        onSubmit(payload);
      }
      // Form will be reset after successful submission via useEffect
    }
  });

  // Pre-select company and term when modal opens with preselected values (create mode only)
  // Or pre-fill activity data in edit mode
  React.useEffect(() => {
    if (!isOpen) return;
    
    if (isEditMode && initialActivity) {
      // Edit mode: pre-fill with activity data
      const name = initialActivity.name || '';
      // Try multiple possible date field names
      const startDate = initialActivity.starts_at || initialActivity.start_date || initialActivity.start || initialActivity.duration?.start;
      const endDate = initialActivity.ends_at || initialActivity.end_date || initialActivity.end || initialActivity.duration?.end;
      
      const startsAt = formatDateForInput(startDate);
      const endsAt = formatDateForInput(endDate);
      
      // Set all values at once to avoid multiple re-renders
      formik.setValues({
        activityName: name,
        companyId: '',
        termId: '',
        startsAt: startsAt,
        endsAt: endsAt,
      });
    } else {
      // Create mode: pre-select company and term
      if (preselectedCompanyId) {
        formik.setFieldValue('companyId', String(preselectedCompanyId));
        // Find company name if not provided
        if (preselectedCompanyName) {
          setSelectedCompanyName(preselectedCompanyName);
        } else {
          const company = companies.find(c => String(c.id) === String(preselectedCompanyId));
          setSelectedCompanyName(company?.name || '');
        }
      }
      if (preselectedTermId) {
        formik.setFieldValue('termId', String(preselectedTermId));
        // Find term name if not provided
        if (preselectedTermName) {
          setSelectedTermName(preselectedTermName);
        } else {
          const term = terms.find(t => String(t.id) === String(preselectedTermId));
          setSelectedTermName(term?.name || term?.term_name || '');
        }
      }
    }
    // Only run when modal opens or edit mode/initialActivity changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isEditMode, initialActivity?.id, initialActivity?.starts_at, initialActivity?.ends_at]);

  // Reset form when modal closes (after successful submission or cancellation)
  React.useEffect(() => {
    if (!isOpen) {
      // Reset form when modal is closed
      const resetValues = isEditMode && initialActivity ? {
        // Edit mode: reset to initial activity values
        activityName: initialActivity.name || '',
        companyId: '',
        termId: '',
        startsAt: formatDateForInput(initialActivity.starts_at),
        endsAt: formatDateForInput(initialActivity.ends_at),
      } : {
        // Create mode: reset to empty or preselected values
        activityName: '',
        companyId: preselectedCompanyId ? String(preselectedCompanyId) : '',
        termId: preselectedTermId ? String(preselectedTermId) : '',
        startsAt: '',
        endsAt: '',
      };
      formik.resetForm({ values: resetValues });
      
      // Reset company name display
      if (preselectedCompanyId && preselectedCompanyName) {
        setSelectedCompanyName(preselectedCompanyName);
      } else if (preselectedCompanyId) {
        const company = companies.find(c => String(c.id) === String(preselectedCompanyId));
        setSelectedCompanyName(company?.name || '');
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
      
      // Reset formik submitting state
      formik.setSubmitting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isSubmitting && !formik.isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-[10000] p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md animate-scale-in transform transition-all">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#14B8A6]/5 dark:from-[#14B8A6]/10 to-transparent">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {isEditMode ? 'Edit Activity' : 'Add New Activity'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isEditMode ? 'Update activity details' : 'Create a new activity for your marketing plan'}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting || formik.isSubmitting}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-all hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg hover:rotate-90 duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:rotate-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={formik.handleSubmit}>
          <div className="p-6 space-y-2">
            {/* Activity Name */}
            <Input
              label="Activity Name"
              name="activityName"
              placeholder="e.g., SMS campaign"
              value={formik.values.activityName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.activityName}
              touched={formik.touched.activityName || formik.submitCount > 0}
              disabled={isSubmitting || formik.isSubmitting}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 pl-1">
              Enter a descriptive name for your marketing activity
            </p>

            {/* Dealer Dropdown - Only show in create mode */}
            {!isEditMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Dealer
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => !isSubmitting && !formik.isSubmitting && setShowCompanyDropdown(!showCompanyDropdown)}
                  onBlur={() => setTimeout(() => setShowCompanyDropdown(false), 200)}
                  disabled={isSubmitting || formik.isSubmitting}
                  className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 border-2 ${
                    formik.errors.companyId && (formik.touched.companyId || formik.submitCount > 0)
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  } text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-gray-400 dark:focus:border-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span className={selectedCompanyName ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}>
                    {selectedCompanyName || 'Select dealer'}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform ${showCompanyDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showCompanyDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl z-[10000] max-h-48 overflow-y-auto">
                    {companies.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                        No dealers available
                      </div>
                    ) : (
                      companies.map((company) => (
                        <button
                          key={company.id}
                          type="button"
                          onClick={() => {
                            formik.setFieldValue('companyId', company.id);
                            formik.setFieldTouched('companyId', true);
                            setSelectedCompanyName(company.name || company.label || '');
                            setShowCompanyDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-xl last:rounded-b-xl"
                        >
                          {company.name || company.label}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              {formik.errors.companyId && (formik.touched.companyId || formik.submitCount > 0) && (
                <ErrorMessage message={formik.errors.companyId} />
              )}
            </div>
            )}

            {/* Term Dropdown - Only show in create mode */}
            {!isEditMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Term
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => !isSubmitting && !formik.isSubmitting && setShowTermDropdown(!showTermDropdown)}
                  onBlur={() => setTimeout(() => setShowTermDropdown(false), 200)}
                  disabled={isSubmitting || formik.isSubmitting}
                  className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 border-2 ${
                    formik.errors.termId && (formik.touched.termId || formik.submitCount > 0)
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  } text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-gray-400 dark:focus:border-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span className={selectedTermName ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}>
                    {selectedTermName || 'Select term'}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform ${showTermDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showTermDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl z-[10000] max-h-48 overflow-y-auto">
                    {terms.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                        No terms available
                      </div>
                    ) : (
                      terms.map((term) => (
                        <button
                          key={term.id}
                          type="button"
                          onClick={() => {
                            formik.setFieldValue('termId', term.id);
                            formik.setFieldTouched('termId', true);
                            setSelectedTermName(term.name || term.term_name || '');
                            setShowTermDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-xl last:rounded-b-xl"
                        >
                          {term.name || term.term_name}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              {formik.errors.termId && (formik.touched.termId || formik.submitCount > 0) && (
                <ErrorMessage message={formik.errors.termId} />
              )}
            </div>
            )}

            {/* Plan Term Info */}
            {planStartDate && planEndDate && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-start gap-3">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Plan Term Period</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Activity dates must be within: <span className="font-semibold">{formatDateDisplay(planStartDate)}</span> - <span className="font-semibold">{formatDateDisplay(planEndDate)}</span>
                  </p>
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Starts At
                </label>
                <input
                  type="date"
                  name="startsAt"
                  value={formik.values.startsAt}
                  onChange={(e) => {
                    formik.handleChange(e);
                    formik.setFieldTouched('startsAt', true);
                    // Validate immediately so errors clear on change (no need to blur)
                    formik.validateField('startsAt');
                  }}
                  onBlur={formik.handleBlur}
                  min={planStartDate || undefined}
                  max={planEndDate || undefined}
                  disabled={isSubmitting || formik.isSubmitting}
                  className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 border-2 ${
                    formik.errors.startsAt && formik.touched.startsAt
                      ? 'border-red-500 dark:border-red-500 focus:border-red-600 dark:focus:border-red-600'
                      : 'border-gray-300 dark:border-gray-600 focus:border-gray-400 dark:focus:border-gray-500'
                  } text-sm text-gray-900 dark:text-gray-100 focus:outline-none transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                />
                {formik.errors.startsAt && formik.touched.startsAt && (
                  <ErrorMessage message={formik.errors.startsAt} />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ends At
                </label>
                <input
                  type="date"
                  name="endsAt"
                  value={formik.values.endsAt}
                  onChange={(e) => {
                    formik.handleChange(e);
                    formik.setFieldTouched('endsAt', true);
                    // Validate immediately so related errors clear on change
                    formik.validateField('endsAt');
                    // Also re-validate startsAt since end change can affect start-related rules
                    formik.validateField('startsAt');
                  }}
                  onBlur={formik.handleBlur}
                  min={formik.values.startsAt || planStartDate || undefined}
                  max={planEndDate || undefined}
                  disabled={isSubmitting || formik.isSubmitting}
                  className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 border-2 ${
                    formik.errors.endsAt && formik.touched.endsAt
                      ? 'border-red-500 dark:border-red-500 focus:border-red-600 dark:focus:border-red-600'
                      : 'border-gray-300 dark:border-gray-600 focus:border-gray-400 dark:focus:border-gray-500'
                  } text-sm text-gray-900 dark:text-gray-100 focus:outline-none transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                />
                {formik.errors.endsAt && formik.touched.endsAt && (
                  <ErrorMessage message={formik.errors.endsAt} />
                )}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-transparent to-gray-50/50 dark:to-gray-800/50">
            <button
              type="button"
              onClick={() => !isSubmitting && !formik.isSubmitting && onClose()}
              disabled={isSubmitting || formik.isSubmitting}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all border-2 border-gray-200 dark:border-gray-700 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || formik.isSubmitting}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#E60012] hover:bg-[#C00010] transition-all shadow-md hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#E60012] disabled:hover:scale-100 flex items-center gap-2"
            >
              {(isSubmitting || formik.isSubmitting) ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isEditMode ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                isEditMode ? 'Update Activity' : 'Add Activity'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

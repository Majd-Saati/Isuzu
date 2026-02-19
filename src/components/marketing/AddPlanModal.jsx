import React, { useState } from 'react';
import { X, ChevronDown, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { usePlanForm } from '@/hooks/plan/usePlanForm';
import { usePlanModalState } from '@/hooks/plan/usePlanModalState';
import { useDropdowns } from '@/hooks/plan/useDropdowns';
import { getResetState, findCompanyName } from '@/utils/planForm/planFormUtils';

export const AddPlanModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  mode = 'create',
  initialPlan = null,
  preselectedCompanyId = null,
  preselectedCompanyName = '',
  companies = [],
  terms = [],
}) => {
  // Form management hook
  const { formik, isAdmin, currentUser } = usePlanForm({ mode, initialPlan, onSubmit });

  // Dropdown state management
  const {
    showCompanyDropdown,
    showTermDropdown,
    toggleCompanyDropdown,
    closeCompanyDropdown,
    toggleTermDropdown,
    closeTermDropdown,
  } = useDropdowns();

  // Selected names state
  const [selectedTermName, setSelectedTermName] = useState('');
  const [selectedCompanyName, setSelectedCompanyName] = useState('');

  // Modal state synchronization
  usePlanModalState({
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
  });

  // Handlers
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      handleClose();
    }
  };

  const handleTermSelect = (term) => {
    formik.setFieldValue('termId', term.id);
    setSelectedTermName(term.name);
    closeTermDropdown();
  };

  const handleCompanySelect = (company) => {
    formik.setFieldValue('companyId', company.id);
    setSelectedCompanyName(company.name || company.label || '');
    closeCompanyDropdown();
  };

  const handleClose = () => {
    if (isSubmitting) return;
    
    const resetState = getResetState({
      mode,
      initialPlan,
      isAdmin,
      userCompanyId: currentUser?.company_id,
      companies,
      preselectedCompanyId,
      preselectedCompanyName,
    });

    formik.resetForm({ values: resetState.formValues });
    setSelectedTermName(resetState.selectedTermName);
    setSelectedCompanyName(resetState.selectedCompanyName);
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-scale-in transform transition-all">
        {/* Modal Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#E60012]/5 dark:from-[#E60012]/10 to-transparent rounded-t-2xl flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {mode === 'edit' ? 'Update Plan' : 'Add Plan'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {mode === 'edit' ? 'Update marketing plan details' : 'Create a new marketing plan'}
            </p>
          </div>
          <button 
            onClick={handleClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-all hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg hover:rotate-90 duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <form onSubmit={formik.handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Plan Name - Full Width */}
              <div className="md:col-span-2">
                <Input
                  label="Plan Name"
                  name="planName"
                  placeholder="Enter plan name"
                  value={formik.values.planName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.planName}
                  touched={formik.submitCount > 0}
                />
              </div>

              {/* Description - Full Width */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Enter plan description, goals, and key messages"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 ${
                    formik.errors.description && formik.submitCount > 0
                      ? 'border-red-500 dark:border-red-600 focus:border-red-600 dark:focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:border-gray-400 dark:focus:border-gray-500'
                  } text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 min-h-[96px] resize-y`}
                />
                {formik.submitCount > 0 && (
                  <ErrorMessage message={formik.errors.description} />
                )}
              </div>

              {/* Dealer Dropdown - Full Width - Only show for admin users */}
              {isAdmin && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={toggleCompanyDropdown}
                      onBlur={closeCompanyDropdown}
                      className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 ${
                        formik.errors.companyId && formik.submitCount > 0
                          ? 'border-red-500 dark:border-red-600'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                      } text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 focus:border-transparent transition-all`}
                    >
                      <span className={selectedCompanyName ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}>
                        {selectedCompanyName || 'Select company'}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform ${showCompanyDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showCompanyDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl z-[10000] max-h-48 overflow-y-auto">
                        {companies.length === 0 ? (
                          <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                            No dealers available
                          </div>
                        ) : (
                          companies.map((company) => (
                            <button
                              key={company.id}
                              type="button"
                              onClick={() => handleCompanySelect(company)}
                              className="w-full px-4 py-3 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors first:rounded-t-xl last:rounded-b-xl"
                            >
                              {company.name}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  {formik.submitCount > 0 && (
                    <ErrorMessage message={formik.errors.companyId} />
                  )}
                </div>
              )}

              {/* Term Dropdown - Full Width */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Term
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={toggleTermDropdown}
                    onBlur={closeTermDropdown}
                    className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 ${
                      formik.errors.termId && formik.submitCount > 0
                        ? 'border-red-500 dark:border-red-600'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    } text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 focus:border-transparent transition-all`}
                  >
                    <span className={selectedTermName ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}>
                      {selectedTermName || 'Select term'}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform ${showTermDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showTermDropdown && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl z-[10000] max-h-48 overflow-y-auto">
                      {terms.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                          No terms available
                        </div>
                      ) : (
                        terms.map((term) => (
                          <button
                            key={term.id}
                            type="button"
                            onClick={() => handleTermSelect(term)}
                            className="w-full px-4 py-3 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors first:rounded-t-xl last:rounded-b-xl"
                          >
                            <div className="font-medium">{term.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {new Date(term.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(term.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
                {formik.submitCount > 0 && (
                  <ErrorMessage message={formik.errors.termId} />
                )}
              </div>

              {/* Status Dropdown - Full Width */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <div className="relative">
                  <select
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 ${
                      formik.errors.status && formik.submitCount > 0
                        ? 'border-red-500 dark:border-red-600'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    } text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 focus:border-transparent transition-all`}
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
                {formik.submitCount > 0 && (
                  <ErrorMessage message={formik.errors.status} />
                )}
              </div>

            </div>
          </div>

          {/* Modal Footer - Fixed */}
          <div className="flex items-center justify-end gap-3 p-6 border-t-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-transparent to-gray-50/50 dark:to-gray-800/50 flex-shrink-0">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all border-2 border-gray-200 dark:border-gray-700 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formik.isValid}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#E60012] hover:bg-[#C00010] transition-all shadow-md hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#E60012] disabled:hover:scale-100 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                mode === 'edit' ? 'Update Plan' : 'Add Plan'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

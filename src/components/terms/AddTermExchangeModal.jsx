import React, { useState, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, ChevronDown } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/Input';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useAddTermExchange } from '@/hooks/api/useTerms';
import { useTerms } from '@/hooks/api/useTerms';
import { useCountries } from '@/hooks/api/useCountries';

const addTermExchangeSchema = Yup.object({
  term_id: Yup.string().required('Term is required'),
  country_id: Yup.string().required('Country is required'),
  rate: Yup.number()
    .required('Rate is required')
    .positive('Rate must be greater than 0')
    .typeError('Please enter a valid number'),
  note: Yup.string().max(500, 'Note must be less than 500 characters').nullable(),
});

const formatTermDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

/**
 * @param {{ isOpen: boolean, onClose: () => void, defaultTermId?: string | number }} props
 * defaultTermId — term selected in Term exchange rates (table filter); pre-fills the Term field when opening.
 */
export const AddTermExchangeModal = ({ isOpen, onClose, defaultTermId = '' }) => {
  const [showTermDropdown, setShowTermDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [termDropdownPosition, setTermDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [countryDropdownPosition, setCountryDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const termTriggerRef = useRef(null);
  const countryTriggerRef = useRef(null);

  const addMutation = useAddTermExchange();
  const { data: termsData } = useTerms({ page: 1, perPage: 100 });
  const { data: countriesData, isLoading: isLoadingCountries } = useCountries({ perPage: 100 });

  const terms = termsData?.terms || [];
  const countries = countriesData?.countries || [];
  const isLoading = addMutation.isPending;

  const prevIsOpenRef = useRef(false);

  const formik = useFormik({
    initialValues: {
      term_id: '',
      country_id: '',
      rate: '',
      note: '',
    },
    validationSchema: addTermExchangeSchema,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: (values, { resetForm }) => {
      addMutation.mutate(
        {
          term_id: Number(values.term_id),
          country_id: Number(values.country_id),
          rate: Number(values.rate),
          note: values.note?.trim() || undefined,
        },
        {
          onSuccess: () => {
            resetForm();
            onClose();
          },
        }
      );
    },
  });

  const resolveDefaultTermId = () => {
    const raw = defaultTermId != null ? String(defaultTermId).trim() : '';
    if (!raw || !terms.some((t) => String(t.id) === raw)) return '';
    return raw;
  };

  useLayoutEffect(() => {
    if (!isOpen) {
      prevIsOpenRef.current = false;
      return;
    }

    const termId = resolveDefaultTermId();
    const justOpened = !prevIsOpenRef.current;
    prevIsOpenRef.current = true;

    if (justOpened) {
      formik.resetForm({
        values: {
          term_id: termId,
          country_id: '',
          rate: '',
          note: '',
        },
      });
      return;
    }

    if (terms.length && termId && !String(formik.values.term_id || '').trim()) {
      formik.setFieldValue('term_id', termId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync open/term list with formik; avoid loops
  }, [isOpen, defaultTermId, terms]);

  const selectedTerm = terms.find((t) => String(t.id) === String(formik.values.term_id));
  const selectedCountry = countries.find((c) => String(c.id) === String(formik.values.country_id));
  const selectedTermName = selectedTerm
    ? `${selectedTerm.name}${selectedTerm.start_date ? ` (${formatTermDate(selectedTerm.start_date)} – ${formatTermDate(selectedTerm.end_date)})` : ''}`
    : '';
  const selectedCountryName = selectedCountry
    ? `${selectedCountry.name}${selectedCountry.currency ? ` (${selectedCountry.currency})` : ''}`
    : '';

  useLayoutEffect(() => {
    if (showTermDropdown && termTriggerRef.current) {
      const rect = termTriggerRef.current.getBoundingClientRect();
      setTermDropdownPosition({ top: rect.bottom + 8, left: rect.left, width: rect.width });
    }
  }, [showTermDropdown]);

  useLayoutEffect(() => {
    if (showCountryDropdown && countryTriggerRef.current) {
      const rect = countryTriggerRef.current.getBoundingClientRect();
      setCountryDropdownPosition({ top: rect.bottom + 8, left: rect.left, width: rect.width });
    }
  }, [showCountryDropdown]);

  const handleTermSelect = (term) => {
    formik.setFieldValue('term_id', String(term.id));
    setShowTermDropdown(false);
  };

  const handleCountrySelect = (country) => {
    formik.setFieldValue('country_id', String(country.id));
    setShowCountryDropdown(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      formik.resetForm();
      onClose();
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      formik.resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md animate-scale-in transform transition-all">
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#E60012]/5 dark:from-[#E60012]/10 to-transparent">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Add term exchange rate</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Set exchange rate for a term and country
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-all hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg hover:rotate-90 duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="p-6 space-y-4">
            {/* Term dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Term
              </label>
              <div className="relative">
                <button
                  ref={termTriggerRef}
                  type="button"
                  onClick={() => {
                    setShowTermDropdown(!showTermDropdown);
                    setShowCountryDropdown(false);
                  }}
                  onBlur={() => setTimeout(() => setShowTermDropdown(false), 200)}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 ${
                    formik.errors.term_id && formik.submitCount > 0
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  } text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span className={selectedTermName ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}>
                    {selectedTermName || 'Select term'}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2 transition-transform ${showTermDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showTermDropdown && typeof document !== 'undefined' && createPortal(
                  <div
                    className="fixed bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl z-[10001] max-h-48 overflow-y-auto"
                    style={{
                      top: termDropdownPosition.top,
                      left: termDropdownPosition.left,
                      width: termDropdownPosition.width,
                    }}
                  >
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
                          className="w-full px-4 py-3 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-xl last:rounded-b-xl"
                        >
                          <div className="font-medium">{term.name}</div>
                          {term.start_date && term.end_date && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTermDate(term.start_date)} – {formatTermDate(term.end_date)}
                            </div>
                          )}
                        </button>
                      ))
                    )}
                  </div>,
                  document.body
                )}
              </div>
              {formik.submitCount > 0 && <ErrorMessage message={formik.errors.term_id} />}
            </div>

            {/* Country dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Country
              </label>
              <div className="relative">
                <button
                  ref={countryTriggerRef}
                  type="button"
                  onClick={() => {
                    setShowCountryDropdown(!showCountryDropdown);
                    setShowTermDropdown(false);
                  }}
                  onBlur={() => setTimeout(() => setShowCountryDropdown(false), 200)}
                  disabled={isLoading || isLoadingCountries}
                  className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 ${
                    formik.errors.country_id && formik.submitCount > 0
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  } text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span className={selectedCountryName ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}>
                    {isLoadingCountries ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      selectedCountryName || 'Select country'
                    )}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showCountryDropdown && !isLoadingCountries && typeof document !== 'undefined' && createPortal(
                  <div
                    className="fixed bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl z-[10001] max-h-48 overflow-y-auto"
                    style={{
                      top: countryDropdownPosition.top,
                      left: countryDropdownPosition.left,
                      width: countryDropdownPosition.width,
                    }}
                  >
                    {countries.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                        No countries available
                      </div>
                    ) : (
                      countries.map((country) => (
                        <button
                          key={country.id}
                          type="button"
                          onClick={() => handleCountrySelect(country)}
                          className="w-full px-4 py-3 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-xl last:rounded-b-xl"
                        >
                          <div className="font-medium">{country.name}</div>
                          {country.currency && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">{country.currency}</div>
                          )}
                        </button>
                      ))
                    )}
                  </div>,
                  document.body
                )}
              </div>
              {formik.submitCount > 0 && <ErrorMessage message={formik.errors.country_id} />}
            </div>

            <Input
              label="Rate to JPY"
              name="rate"
              type="number"
              step="any"
              min="0"
              placeholder="e.g. 150"
              value={formik.values.rate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.rate}
              touched={formik.submitCount > 0}
              disabled={isLoading}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Note <span className="text-gray-400 dark:text-gray-500 font-normal">(optional)</span>
              </label>
              <textarea
                name="note"
                placeholder="Optional note"
                value={formik.values.note}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isLoading}
                rows={3}
                className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 ${
                  formik.errors.note && formik.submitCount > 0
                    ? 'border-red-500 dark:border-red-600'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                } text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 transition-all disabled:opacity-50 resize-none`}
              />
              {formik.submitCount > 0 && formik.errors.note && (
                <ErrorMessage message={formik.errors.note} />
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-transparent to-gray-50/50 dark:to-gray-800/50">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all border-2 border-gray-200 dark:border-gray-700 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
                  Adding...
                </>
              ) : (
                'Add exchange rate'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

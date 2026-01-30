import React, { useState, useEffect } from 'react';
import { X, Loader2, ChevronDown } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { Input } from '@/components/ui/Input';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useCreateCompany, useUpdateCompany } from '@/hooks/api/useCompanies';
import { useCountries } from '@/hooks/api/useCountries';

// Register FilePond plugins
registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);

const companySchema = Yup.object({
  name: Yup.string()
    .required('Company name is required')
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters'),
  country_id: Yup.string()
    .required('Country is required'),
});

export const AddEditCompanyModal = ({ isOpen, onClose, editData = null }) => {
  const isEditMode = !!editData;
  const createMutation = useCreateCompany();
  const updateMutation = useUpdateCompany();
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedCountryName, setSelectedCountryName] = useState('');
  const [logoFiles, setLogoFiles] = useState([]);

  // Fetch countries from API
  const { data: countriesData, isLoading: isLoadingCountries } = useCountries();
  const countries = countriesData?.countries || [];

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const formik = useFormik({
    initialValues: {
      name: editData?.name || '',
      country_id: editData?.country_id || '',
    },
    validationSchema: companySchema,
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: (values, { resetForm }) => {
      const mutation = isEditMode ? updateMutation : createMutation;
      
      // Get the actual file from FilePond
      const logoFile = logoFiles.length > 0 ? logoFiles[0].file : null;
      
      const data = isEditMode 
        ? { id: editData.id, ...values, logo: logoFile }
        : { ...values, logo: logoFile };

      mutation.mutate(data, {
        onSuccess: () => {
          resetForm();
          setSelectedCountryName('');
          setLogoFiles([]);
          onClose();
        },
      });
    },
  });

  // Set initial country name when editing
  useEffect(() => {
    if (editData?.country_name) {
      setSelectedCountryName(editData.country_name);
    } else if (editData?.country_id && countries.length > 0) {
      const country = countries.find(c => c.id === editData.country_id);
      if (country) setSelectedCountryName(country.name);
    }
  }, [editData, countries]);

  const handleCountrySelect = (country) => {
    formik.setFieldValue('country_id', country.id);
    setSelectedCountryName(country.name);
    setShowCountryDropdown(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      formik.resetForm();
      setSelectedCountryName('');
      setLogoFiles([]);
      onClose();
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      formik.resetForm();
      setSelectedCountryName('');
      setLogoFiles([]);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col animate-scale-in transform transition-all">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#E60012]/5 dark:from-[#E60012]/10 to-transparent flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {isEditMode ? 'Edit Company' : 'Add New Company'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isEditMode ? 'Update company information' : 'Create a new company/dealer'}
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

        {/* Modal Body */}
        <form onSubmit={formik.handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            <Input
              label="Company Name"
              name="name"
              placeholder="e.g., QTA Motors"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.name}
              touched={formik.submitCount > 0}
              disabled={isLoading}
            />

            {/* Country Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Country
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  onBlur={() => setTimeout(() => setShowCountryDropdown(false), 200)}
                  disabled={isLoading || isLoadingCountries}
                  className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 border-2 ${
                    formik.errors.country_id && formik.submitCount > 0
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  } text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-gray-400 dark:focus:border-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span className={selectedCountryName ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}>
                    {isLoadingCountries ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading countries...
                      </span>
                    ) : (
                      selectedCountryName || 'Select country'
                    )}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showCountryDropdown && !isLoadingCountries && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl z-[10000] max-h-48 overflow-y-auto">
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
                          <div className="text-xs text-gray-500 dark:text-gray-400">{country.currency}</div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              {formik.submitCount > 0 && (
                <ErrorMessage message={formik.errors.country_id} />
              )}
            </div>

            {/* Logo Upload with FilePond */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Logo
              </label>
              <FilePond
                files={logoFiles}
                onupdatefiles={setLogoFiles}
                allowMultiple={false}
                maxFiles={1}
                acceptedFileTypes={['image/*']}
                labelIdle='Drag & Drop your logo or <span class="filepond--label-action">Browse</span>'
                stylePanelLayout="compact"
                imagePreviewHeight={120}
                credits={false}
                disabled={isLoading}
                className="filepond-company-logo"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Supported formats: JPG, PNG, WebP. Max size: 2MB
              </p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-transparent to-gray-50/50 dark:to-gray-800/50 flex-shrink-0">
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
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditMode ? 'Update Company' : 'Add Company'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Custom FilePond Styles */}
      <style>{`
        .filepond-company-logo .filepond--root {
          font-family: inherit;
        }
        .filepond-company-logo .filepond--panel-root {
          background-color: #f9fafb;
          border: 2px dashed #d1d5db;
          border-radius: 12px;
        }
        .dark .filepond-company-logo .filepond--panel-root {
          background-color: #1f2937;
          border-color: #4b5563;
        }
        .filepond-company-logo .filepond--drop-label {
          color: #6b7280;
          font-size: 14px;
        }
        .dark .filepond-company-logo .filepond--drop-label {
          color: #9ca3af;
        }
        .filepond-company-logo .filepond--label-action {
          color: #E60012;
          text-decoration: none;
          font-weight: 600;
        }
        .filepond-company-logo .filepond--label-action:hover {
          text-decoration: underline;
        }
        .filepond-company-logo .filepond--item-panel {
          background-color: #f3f4f6;
          border-radius: 8px;
        }
        .dark .filepond-company-logo .filepond--item-panel {
          background-color: #374151;
        }
        .filepond-company-logo .filepond--drip-blob {
          background-color: #E60012;
        }
        .filepond-company-logo [data-filepond-item-state*='error'] .filepond--item-panel,
        .filepond-company-logo [data-filepond-item-state*='invalid'] .filepond--item-panel {
          background-color: #fee2e2;
        }
        .dark .filepond-company-logo [data-filepond-item-state*='error'] .filepond--item-panel,
        .dark .filepond-company-logo [data-filepond-item-state*='invalid'] .filepond--item-panel {
          background-color: #7f1d1d;
        }
        .filepond-company-logo [data-filepond-item-state='processing-complete'] .filepond--item-panel {
          background-color: #d1fae5;
        }
        .dark .filepond-company-logo [data-filepond-item-state='processing-complete'] .filepond--item-panel {
          background-color: #064e3b;
        }
      `}</style>
    </div>
  );
};

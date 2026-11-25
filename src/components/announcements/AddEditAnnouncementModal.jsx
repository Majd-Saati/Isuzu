import React, { useEffect, useMemo, useRef, useState } from 'react';
import { X, Loader2, ChevronDown, Check } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/Input';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useCreateAnnouncement, useUpdateAnnouncement } from '@/hooks/api/useAnnouncements';
import { useUsers } from '@/hooks/api/useUsers';

/** Audience select values. "IIF users" sends `is_admin: 1` instead of `for_all`/`company_id`. */
const AUDIENCE = {
  ALL_DEALERS: 'all_dealers',
  COMPANY: 'company',
  ALL_USERS: 'all_users',
};

const getInitialAudience = (editData) => {
  if (!editData) return AUDIENCE.ALL_DEALERS;
  if (Number(editData.is_admin) === 1) return AUDIENCE.ALL_USERS;
  return String(editData.for_all) === '0' ? AUDIENCE.COMPANY : AUDIENCE.ALL_DEALERS;
};

const getInitialUserIds = (editData) => {
  const list = editData?.users_list || editData?.users || editData?.user_ids || [];
  if (!Array.isArray(list)) return [];
  return list
    .map((item) => (typeof item === 'object' ? item?.id : item))
    .filter((id) => id != null && id !== '')
    .map(String);
};

const announcementSchema = Yup.object({
  title: Yup.string()
    .required('Title is required')
    .min(2, 'Title must be at least 2 characters')
    .max(150, 'Title must be less than 150 characters'),
  description: Yup.string()
    .required('Description is required')
    .max(1000, 'Description must be less than 1000 characters'),
  audience: Yup.string().oneOf(Object.values(AUDIENCE)).required(),
  company_id: Yup.string().when('audience', {
    is: AUDIENCE.COMPANY,
    then: (schema) => schema.required('Company is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  users_list: Yup.array().of(Yup.string()),
});

const selectClass = (hasError) =>
  `w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 ${
    hasError
      ? 'border-red-500 dark:border-red-600 focus:border-red-600'
      : 'border-gray-300 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-600'
  } text-sm text-gray-900 dark:text-gray-100 focus:outline-none transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed`;

const formatUserLabel = (user) => {
  const name = user?.name?.trim() || 'Unknown';
  const email = user?.email?.trim();
  return email ? `${name} (${email})` : name;
};

const CompanyUsersMultiSelect = ({
  companyId,
  value,
  onChange,
  disabled,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const rootRef = useRef(null);

  const hasCompany = Boolean(companyId);
  const { data, isLoading, isFetching } = useUsers(
    {
      page: 1,
      perPage: 100,
      companyId: companyId || undefined,
      isAdmin: 0,
    },
    { enabled: hasCompany }
  );

  const users = data?.users || [];
  const loadingUsers = hasCompany && (isLoading || isFetching);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((user) => {
      const name = String(user?.name || '').toLowerCase();
      const email = String(user?.email || '').toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [users, search]);

  const selectedUsers = useMemo(() => {
    const selected = new Set(value.map(String));
    return users.filter((user) => selected.has(String(user.id)));
  }, [users, value]);

  useEffect(() => {
    if (!open) return undefined;
    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  useEffect(() => {
    setOpen(false);
    setSearch('');
  }, [companyId]);

  const toggleUser = (userId) => {
    const id = String(userId);
    if (value.map(String).includes(id)) {
      onChange(value.filter((item) => String(item) !== id));
      return;
    }
    onChange([...value, id]);
  };

  const removeUser = (userId) => {
    onChange(value.filter((item) => String(item) !== String(userId)));
  };

  let triggerLabel = 'Select company first';
  if (hasCompany && loadingUsers) triggerLabel = 'Loading users...';
  else if (hasCompany && selectedUsers.length === 0) triggerLabel = 'Search user by name or email...';
  else if (selectedUsers.length === 1) triggerLabel = formatUserLabel(selectedUsers[0]);
  else if (selectedUsers.length > 1) triggerLabel = `${selectedUsers.length} users selected`;

  return (
    <div ref={rootRef} className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Users (Optional)
      </label>

      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedUsers.map((user) => (
            <span
              key={user.id}
              className="inline-flex items-center gap-1.5 max-w-full rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2.5 py-1.5 text-xs text-gray-800 dark:text-gray-200"
            >
              <span className="truncate">{formatUserLabel(user)}</span>
              <button
                type="button"
                onClick={() => removeUser(user.id)}
                disabled={disabled}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50"
                aria-label={`Remove ${user.name || 'user'}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => {
            if (!hasCompany || disabled || loadingUsers) return;
            setOpen((prev) => !prev);
          }}
          disabled={!hasCompany || disabled || loadingUsers}
          className={`${selectClass(false)} flex items-center justify-between gap-2 text-left`}
        >
          <span
            className={
              selectedUsers.length > 0
                ? 'truncate'
                : 'truncate text-gray-400 dark:text-gray-500'
            }
          >
            {triggerLabel}
          </span>
          {loadingUsers ? (
            <Loader2 className="w-4 h-4 animate-spin text-gray-400 flex-shrink-0" />
          ) : (
            <ChevronDown
              className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
            />
          )}
        </button>

        {open && hasCompany && !loadingUsers && (
          <div className="absolute z-20 mt-2 w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl overflow-hidden">
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search user by name or email..."
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#E60012]"
                autoFocus
              />
            </div>
            <div className="max-h-48 overflow-y-auto py-1">
              {filteredUsers.length === 0 ? (
                <p className="px-3 py-2.5 text-sm text-gray-500 dark:text-gray-400">
                  No users found
                </p>
              ) : (
                filteredUsers.map((user) => {
                  const selected = value.map(String).includes(String(user.id));
                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => toggleUser(user.id)}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <span className="truncate text-gray-900 dark:text-gray-100">
                        {formatUserLabel(user)}
                      </span>
                      {selected && <Check className="w-4 h-4 text-[#E60012] flex-shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const AddEditAnnouncementModal = ({ isOpen, onClose, editData = null, companies = [] }) => {
  const isEditMode = !!editData;
  const createMutation = useCreateAnnouncement();
  const updateMutation = useUpdateAnnouncement();

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const formik = useFormik({
    initialValues: {
      title: editData?.title || '',
      description: editData?.description || '',
      audience: getInitialAudience(editData),
      company_id: editData?.company_id != null ? String(editData.company_id) : '',
      users_list: getInitialUserIds(editData),
    },
    validationSchema: announcementSchema,
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: (values, { resetForm }) => {
      const mutation = isEditMode ? updateMutation : createMutation;

      const payload = {
        title: values.title.trim(),
        description: values.description.trim(),
      };
      if (values.audience === AUDIENCE.ALL_USERS) {
        payload.is_admin = 1;
        payload.for_all = 1;
      } else if (values.audience === AUDIENCE.COMPANY) {
        payload.for_all = 0;
        payload.company_id = Number(values.company_id);
        if (values.users_list?.length) {
          payload.users_list = values.users_list.map(Number);
        }
      } else {
        payload.for_all = 1;
      }
      if (isEditMode) {
        payload.announcement_id = editData.id;
      }

      mutation.mutate(payload, {
        onSuccess: () => {
          resetForm();
          onClose();
        },
      });
    },
  });

  const handleAudienceChange = (e) => {
    const value = e.target.value;
    formik.setFieldValue('audience', value);
    if (value !== AUDIENCE.COMPANY) {
      formik.setFieldValue('company_id', '');
      formik.setFieldValue('users_list', []);
    }
  };

  const handleCompanyChange = (e) => {
    formik.handleChange(e);
    formik.setFieldValue('users_list', []);
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
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md animate-scale-in transform transition-all">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#E60012]/5 dark:from-[#E60012]/10 to-transparent">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {isEditMode ? 'Edit Announcement' : 'New Announcement'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isEditMode ? 'Update announcement details' : 'Send an announcement to your dealers'}
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
        <form onSubmit={formik.handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <Input
                label="Title"
                name="title"
                placeholder="e.g., New campaign instructions"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.title}
                touched={formik.submitCount > 0}
                disabled={isLoading}
              />
              {formik.submitCount > 0 && <ErrorMessage message={formik.errors.title} />}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                placeholder="Please review the updated campaign requirements."
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isLoading}
                className={`${selectClass(formik.errors.description && formik.submitCount > 0)} resize-none placeholder-gray-400 dark:placeholder-gray-500`}
              />
              {formik.submitCount > 0 && <ErrorMessage message={formik.errors.description} />}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Audience
              </label>
              <select
                name="audience"
                value={formik.values.audience}
                onChange={handleAudienceChange}
                onBlur={formik.handleBlur}
                disabled={isLoading}
                className={selectClass(false)}
              >
                <option value={AUDIENCE.ALL_DEALERS}>All dealers</option>
                <option value={AUDIENCE.COMPANY}>Specific company</option>
                <option value={AUDIENCE.ALL_USERS}>IIF users</option>
              </select>
            </div>

            {formik.values.audience === AUDIENCE.COMPANY && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company
                  </label>
                  <select
                    name="company_id"
                    value={formik.values.company_id}
                    onChange={handleCompanyChange}
                    onBlur={formik.handleBlur}
                    disabled={isLoading}
                    className={selectClass(formik.errors.company_id && formik.submitCount > 0)}
                  >
                    <option value="">Select company</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                  {formik.submitCount > 0 && <ErrorMessage message={formik.errors.company_id} />}
                </div>

                <CompanyUsersMultiSelect
                  companyId={formik.values.company_id}
                  value={formik.values.users_list}
                  onChange={(next) => formik.setFieldValue('users_list', next)}
                  disabled={isLoading}
                />
              </>
            )}
          </div>

          {/* Modal Footer */}
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
                  {isEditMode ? 'Updating...' : 'Sending...'}
                </>
              ) : isEditMode ? (
                'Update Announcement'
              ) : (
                'Send Announcement'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

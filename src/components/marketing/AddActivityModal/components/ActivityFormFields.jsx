import React from 'react';
import { Input } from '@/components/ui/Input';
import { CompanyDropdown } from './CompanyDropdown';
import { TermDropdown } from './TermDropdown';
import { DateInput } from './DateInput';
import { PlanTermInfo } from './PlanTermInfo';

export const ActivityFormFields = ({
  isEditMode,
  formik,
  isSubmitting,
  formikIsSubmitting,
  companies,
  terms,
  planStartDate,
  planEndDate,
  showCompanyDropdown,
  setShowCompanyDropdown,
  showTermDropdown,
  setShowTermDropdown,
  selectedCompanyName,
  selectedTermName,
  handleCompanySelect,
  handleTermSelect,
}) => {
  return (
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
        disabled={isSubmitting || formikIsSubmitting}
      />
      <p className="text-xs text-gray-500 dark:text-gray-400 pl-1">
        Enter a descriptive name for your marketing activity
      </p>

      {/* Dealer Dropdown - Only show in create mode */}
      {!isEditMode && (
        <CompanyDropdown
          companies={companies}
          selectedCompanyName={selectedCompanyName}
          showCompanyDropdown={showCompanyDropdown}
          setShowCompanyDropdown={setShowCompanyDropdown}
          formik={formik}
          isSubmitting={isSubmitting}
          formikIsSubmitting={formikIsSubmitting}
          onCompanySelect={handleCompanySelect}
        />
      )}

      {/* Term Dropdown - Only show in create mode */}
      {!isEditMode && (
        <TermDropdown
          terms={terms}
          selectedTermName={selectedTermName}
          showTermDropdown={showTermDropdown}
          setShowTermDropdown={setShowTermDropdown}
          formik={formik}
          isSubmitting={isSubmitting}
          formikIsSubmitting={formikIsSubmitting}
          onTermSelect={handleTermSelect}
        />
      )}

      {/* Plan Term Info */}
      <PlanTermInfo planStartDate={planStartDate} planEndDate={planEndDate} />

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DateInput
          label="Starts At"
          name="startsAt"
          value={formik.values.startsAt}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.startsAt}
          touched={formik.touched.startsAt}
          min={planStartDate || undefined}
          max={planEndDate || undefined}
          disabled={isSubmitting || formikIsSubmitting}
          formik={formik}
        />
        <DateInput
          label="Ends At"
          name="endsAt"
          value={formik.values.endsAt}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.endsAt}
          touched={formik.touched.endsAt}
          min={formik.values.startsAt || planStartDate || undefined}
          max={planEndDate || undefined}
          disabled={isSubmitting || formikIsSubmitting}
          formik={formik}
        />
      </div>
    </div>
  );
};


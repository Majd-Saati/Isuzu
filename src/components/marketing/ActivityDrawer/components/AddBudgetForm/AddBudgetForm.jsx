import React from 'react';
import { Plus, Upload, Loader2 } from 'lucide-react';
import { useAddBudgetForm } from './useAddBudgetForm';
import { BudgetTypeDropdown } from './BudgetTypeDropdown';
import { MonthlyBreakdownSection } from './MonthlyBreakdownSection';

const FORM_CLASS =
  'bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700 space-y-4';
const INPUT_CLASS =
  'w-full px-3 py-2.5 rounded-lg bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 transition-all';
const LABEL_CLASS =
  'block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5';
const FILE_LABEL_CLASS =
  'flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all';
const CANCEL_BUTTON_CLASS =
  'flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all';
const SUBMIT_BUTTON_CLASS =
  'flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[#E60012] hover:bg-[#cc0010] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';

export function AddBudgetForm({
  activityId,
  planId,
  companyId,
  existingBudgets = [],
  onSuccess,
  onCancel,
  activityStartDate,
  activityEndDate,
}) {
  const {
    value,
    setValue,
    description,
    setDescription,
    media,
    showTypeDropdown,
    setShowTypeDropdown,
    validationError,
    monthsBreakdown,
    showMonthsBreakdown,
    setShowMonthsBreakdown,
    termMonths,
    breakdownTotal,
    breakdownValidation,
    typeOptions,
    hasTermMonths,
    selectedType,
    handleDistributeEvenly,
    handleMonthValueChange,
    handleSubmit,
    handleFileChange,
    handleSelectType,
    createBudgetMutation,
  } = useAddBudgetForm({
    activityId,
    planId,
    companyId,
    existingBudgets,
    onSuccess,
    onCancel,
    activityStartDate,
    activityEndDate,
  });

  const isSubmitDisabled =
    createBudgetMutation.isPending ||
    !value ||
    !description ||
    !!validationError ||
    !breakdownValidation.isValid;

  return (
    <form onSubmit={handleSubmit} className={FORM_CLASS}>
      <div className="flex items-center gap-2 mb-2">
        <Plus className="w-4 h-4 text-[#E60012]" />
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Add New Budget Entry
        </h4>
      </div>

      <BudgetTypeDropdown
        typeOptions={typeOptions}
        selectedType={selectedType}
        showTypeDropdown={showTypeDropdown}
        onToggleDropdown={() => setShowTypeDropdown(!showTypeDropdown)}
        onSelectType={handleSelectType}
        validationError={validationError}
        onBlurClose={() => setShowTypeDropdown(false)}
      />

      <div>
        <label className={LABEL_CLASS}>Value *</label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter amount"
          className={INPUT_CLASS}
          required
        />
      </div>

      {hasTermMonths && (
        <MonthlyBreakdownSection
          termMonths={termMonths}
          monthsBreakdown={monthsBreakdown}
          showMonthsBreakdown={showMonthsBreakdown}
          onToggleBreakdown={() => setShowMonthsBreakdown(!showMonthsBreakdown)}
          onDistributeEvenly={handleDistributeEvenly}
          onMonthValueChange={handleMonthValueChange}
          breakdownTotal={breakdownTotal}
          totalValue={value}
          breakdownValidation={breakdownValidation}
        />
      )}

      <div>
        <label className={LABEL_CLASS}>Description *</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          rows={2}
          className={`${INPUT_CLASS} resize-none`}
          required
        />
      </div>

      <div>
        <label className={LABEL_CLASS}>Media (Optional)</label>
        <div className="relative">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="add-budget-media-upload"
            accept="image/*,.pdf,.doc,.docx"
          />
          <label htmlFor="add-budget-media-upload" className={FILE_LABEL_CLASS}>
            <Upload className="w-4 h-4" />
            {media ? media.name : 'Select file'}
          </label>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className={CANCEL_BUTTON_CLASS}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className={SUBMIT_BUTTON_CLASS}
        >
          {createBudgetMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add Budget
            </>
          )}
        </button>
      </div>
    </form>
  );
}

import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Upload, ChevronDown, Loader2, AlertCircle, Calendar } from 'lucide-react';
import { useCreateActivityBudget } from '@/hooks/api/useActivities';
import { getAvailableBudgetTypes, canAddBudgetType } from '../utils/budgetValidation';
import { format, eachMonthOfInterval, parseISO, isValid } from 'date-fns';

export const AddBudgetForm = ({ 
  activityId, 
  planId, 
  companyId, 
  existingBudgets = [], 
  onSuccess, 
  onCancel,
  termStartDate,
  termEndDate
}) => {
  const [type, setType] = useState('estimated cost');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState(null);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [monthsBreakdown, setMonthsBreakdown] = useState({});
  const [showMonthsBreakdown, setShowMonthsBreakdown] = useState(false);

  const createBudgetMutation = useCreateActivityBudget();

  // Generate months array from term dates
  const termMonths = useMemo(() => {
    if (!termStartDate || !termEndDate) return [];
    
    try {
      const startDate = typeof termStartDate === 'string' ? parseISO(termStartDate) : termStartDate;
      const endDate = typeof termEndDate === 'string' ? parseISO(termEndDate) : termEndDate;
      
      if (!isValid(startDate) || !isValid(endDate)) return [];
      
      const months = eachMonthOfInterval({ start: startDate, end: endDate });
      return months.map(date => ({
        key: format(date, 'yyyy-MM'),
        label: format(date, 'MMM yyyy'),
      }));
    } catch (error) {
      console.error('Error generating months:', error);
      return [];
    }
  }, [termStartDate, termEndDate]);

  // Initialize months breakdown when term months change
  useEffect(() => {
    if (termMonths.length > 0) {
      const initialBreakdown = {};
      termMonths.forEach(month => {
        initialBreakdown[month.key] = '';
      });
      setMonthsBreakdown(initialBreakdown);
    }
  }, [termMonths]);

  // Calculate total from months breakdown
  const breakdownTotal = useMemo(() => {
    return Object.values(monthsBreakdown).reduce((sum, val) => {
      const numVal = parseFloat(val) || 0;
      return sum + numVal;
    }, 0);
  }, [monthsBreakdown]);

  // Validation for months breakdown
  const breakdownValidation = useMemo(() => {
    const totalValue = parseFloat(value) || 0;
    if (totalValue === 0) return { isValid: true, message: '' };
    
    if (breakdownTotal > totalValue) {
      return {
        isValid: false,
        message: `Monthly values total (${breakdownTotal.toLocaleString()}) exceeds budget value (${totalValue.toLocaleString()})`,
      };
    }
    
    if (showMonthsBreakdown && breakdownTotal < totalValue) {
      return {
        isValid: true,
        warning: `Monthly total: ${breakdownTotal.toLocaleString()} of ${totalValue.toLocaleString()}`,
      };
    }
    
    return { isValid: true, message: '' };
  }, [value, breakdownTotal, showMonthsBreakdown]);

  // Get available types based on existing budgets
  const typeOptions = useMemo(() => {
    return getAvailableBudgetTypes(existingBudgets);
  }, [existingBudgets]);

  // Find the first available type as default
  const defaultType = useMemo(() => {
    const available = typeOptions.find(t => t.canAdd);
    return available ? available.value : 'estimated cost';
  }, [typeOptions]);

  // Update type to default if current type is not available
  useEffect(() => {
    const currentTypeOption = typeOptions.find(t => t.value === type);
    if (!currentTypeOption?.canAdd) {
      setType(defaultType);
    }
  }, [type, typeOptions, defaultType]);

  // Distribute value evenly across months
  const handleDistributeEvenly = () => {
    const totalValue = parseFloat(value) || 0;
    if (totalValue === 0 || termMonths.length === 0) return;
    
    const valuePerMonth = Math.floor(totalValue / termMonths.length);
    const remainder = totalValue - (valuePerMonth * termMonths.length);
    
    const newBreakdown = {};
    termMonths.forEach((month, index) => {
      // Add remainder to the last month
      const monthValue = index === termMonths.length - 1 
        ? valuePerMonth + remainder 
        : valuePerMonth;
      newBreakdown[month.key] = monthValue.toString();
    });
    
    setMonthsBreakdown(newBreakdown);
  };

  const handleMonthValueChange = (monthKey, monthValue) => {
    setMonthsBreakdown(prev => ({
      ...prev,
      [monthKey]: monthValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value || !description) return;

    // Validate budget type before submitting
    const validation = canAddBudgetType(type, existingBudgets);
    if (!validation.canAdd) {
      setValidationError(validation.reason);
      return;
    }

    // Validate months breakdown
    if (!breakdownValidation.isValid) {
      setValidationError(breakdownValidation.message);
      return;
    }

    setValidationError('');

    // Prepare months breakdown data - only include if values are entered
    const hasBreakdownValues = Object.values(monthsBreakdown).some(v => parseFloat(v) > 0);
    const cleanedBreakdown = {};
    if (showMonthsBreakdown && hasBreakdownValues) {
      Object.entries(monthsBreakdown).forEach(([key, val]) => {
        const numVal = parseFloat(val) || 0;
        if (numVal > 0) {
          cleanedBreakdown[key] = numVal;
        }
      });
    }

    createBudgetMutation.mutate(
      {
        activity_id: activityId,
        plan_id: planId,
        company_id: companyId,
        type,
        value,
        description,
        media,
        months_breakdown: hasBreakdownValues && showMonthsBreakdown ? cleanedBreakdown : undefined,
      },
      {
        onSuccess: () => {
          setValue('');
          setDescription('');
          setMedia(null);
          setType(defaultType);
          setValidationError('');
          setMonthsBreakdown({});
          setShowMonthsBreakdown(false);
          onSuccess?.();
        },
      }
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setMedia(file);
    }
  };

  const selectedType = typeOptions.find(t => t.value === type);
  const hasTermMonths = termMonths.length > 0;

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Plus className="w-4 h-4 text-[#E60012]" />
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Add New Budget Entry</h4>
      </div>

      {/* Type Dropdown */}
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Type *</label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowTypeDropdown(!showTypeDropdown)}
            onBlur={() => setTimeout(() => setShowTypeDropdown(false), 200)}
            className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 text-sm text-left flex items-center justify-between focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 transition-all"
          >
            <span className={selectedType?.color || 'text-gray-900 dark:text-gray-100'}>{selectedType?.label || 'Select type'}</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showTypeDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl z-[10000] overflow-hidden">
              {typeOptions.map((option) => {
                const isDisabled = !option.canAdd;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      if (!isDisabled) {
                        setType(option.value);
                        setShowTypeDropdown(false);
                        setValidationError('');
                      }
                    }}
                    disabled={isDisabled}
                    title={isDisabled ? option.reason : ''}
                    className={`w-full px-3 py-2.5 text-left text-sm transition-colors ${
                      isDisabled
                        ? 'opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-600'
                        : `hover:bg-gray-50 dark:hover:bg-gray-800 ${option.color}`
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option.label}</span>
                      {isDisabled && (
                        <AlertCircle className="w-4 h-4 text-gray-400 dark:text-gray-600 ml-2" />
                      )}
                    </div>
                    {isDisabled && option.reason && (
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1 italic">
                        {option.reason}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        {validationError && (
          <div className="mt-1.5 flex items-start gap-1.5 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}
      </div>

      {/* Value */}
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Value *</label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter amount"
          className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 transition-all"
          required
        />
      </div>

      {/* Months Breakdown Section */}
      {hasTermMonths && value && parseFloat(value) > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowMonthsBreakdown(!showMonthsBreakdown)}
              className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-[#E60012] transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              Monthly Breakdown
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMonthsBreakdown ? 'rotate-180' : ''}`} />
            </button>
            {showMonthsBreakdown && (
              <button
                type="button"
                onClick={handleDistributeEvenly}
                className="text-xs text-[#E60012] hover:text-[#B91C1C] font-medium"
              >
                Distribute evenly
              </button>
            )}
          </div>

          {showMonthsBreakdown && (
            <div className="bg-white dark:bg-gray-900 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-3 space-y-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Allocate the budget across each month of the term. Total must not exceed {parseFloat(value).toLocaleString()}.
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                {termMonths.map((month) => (
                  <div key={month.key} className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {month.label}
                    </label>
                    <input
                      type="number"
                      value={monthsBreakdown[month.key] || ''}
                      onChange={(e) => handleMonthValueChange(month.key, e.target.value)}
                      placeholder="0"
                      min="0"
                      className="w-full px-2.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#E60012]/50 focus:ring-1 focus:ring-[#E60012]/30 transition-all"
                    />
                  </div>
                ))}
              </div>

              {/* Breakdown Validation/Info */}
              <div className={`flex items-center justify-between text-xs pt-2 border-t border-gray-100 dark:border-gray-700 ${
                !breakdownValidation.isValid ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
              }`}>
                <span>Monthly Total:</span>
                <span className="font-semibold">
                  {breakdownTotal.toLocaleString()} / {parseFloat(value).toLocaleString()}
                </span>
              </div>
              
              {!breakdownValidation.isValid && (
                <div className="flex items-start gap-1.5 text-xs text-red-600 dark:text-red-400">
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <span>{breakdownValidation.message}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Description */}
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description *</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          rows={2}
          className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 transition-all resize-none"
          required
        />
      </div>

      {/* Media Upload */}
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Media (Optional)</label>
        <div className="relative">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="media-upload"
            accept="image/*,.pdf,.doc,.docx"
          />
          <label
            htmlFor="media-upload"
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all"
          >
            <Upload className="w-4 h-4" />
            {media ? media.name : 'Select file'}
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={createBudgetMutation.isPending || !value || !description || validationError || !breakdownValidation.isValid}
          className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[#E60012] hover:bg-[#cc0010] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
};

import { useState, useMemo, useEffect } from 'react';
import { useCreateActivityBudget } from '@/hooks/api/useActivities';
import { getAvailableBudgetTypes, canAddBudgetType } from '../../utils/budgetValidation';
import { getTermMonths } from './utils';
import { getAddBudgetSchema } from './addBudgetSchema';

export function useAddBudgetForm({
  activityId,
  planId,
  companyId,
  existingBudgets = [],
  onSuccess,
  onCancel,
  activityStartDate,
  activityEndDate,
}) {
  const [type, setType] = useState('estimated cost');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState(null);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [monthsBreakdown, setMonthsBreakdown] = useState({});
  const [showMonthsBreakdown, setShowMonthsBreakdown] = useState(false);
  const [breakdownErrors, setBreakdownErrors] = useState({});

  const createBudgetMutation = useCreateActivityBudget();

  // Monthly breakdown is based on activity period, not term period
  const termMonths = useMemo(
    () => getTermMonths(activityStartDate, activityEndDate),
    [activityStartDate, activityEndDate]
  );

  useEffect(() => {
    if (termMonths.length > 0) {
      const initialBreakdown = {};
      termMonths.forEach((month) => {
        initialBreakdown[month.key] = '';
      });
      setMonthsBreakdown(initialBreakdown);
    }
  }, [termMonths]);

  const breakdownTotal = useMemo(() => {
    return Object.values(monthsBreakdown).reduce((sum, val) => {
      const numVal = parseFloat(val) || 0;
      return sum + numVal;
    }, 0);
  }, [monthsBreakdown]);

  // Clear breakdown errors when user has filled all months and sum matches budget value
  useEffect(() => {
    if (termMonths.length === 0) return;
    const totalValue = parseFloat(value) || 0;
    if (totalValue <= 0) return;
    const allFilled = termMonths.every((m) => {
      const v = monthsBreakdown[m.key];
      const num = Number(v);
      return v !== '' && v != null && !Number.isNaN(num) && num >= 0;
    });
    const sum = termMonths.reduce(
      (s, m) => s + (parseFloat(monthsBreakdown[m.key]) || 0),
      0
    );
    if (allFilled && Math.abs(sum - totalValue) < 0.01) {
      setBreakdownErrors({});
    }
  }, [termMonths, value, monthsBreakdown]);

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

  const typeOptions = useMemo(
    () => getAvailableBudgetTypes(existingBudgets),
    [existingBudgets]
  );

  const defaultType = useMemo(() => {
    const available = typeOptions.find((t) => t.canAdd);
    return available ? available.value : 'estimated cost';
  }, [typeOptions]);

  useEffect(() => {
    const currentTypeOption = typeOptions.find((t) => t.value === type);
    if (!currentTypeOption?.canAdd) {
      setType(defaultType);
    }
  }, [type, typeOptions, defaultType]);

  const handleDistributeEvenly = () => {
    const totalValue = parseFloat(value) || 0;
    if (totalValue === 0 || termMonths.length === 0) return;
    const valuePerMonth = Math.floor(totalValue / termMonths.length);
    const remainder = totalValue - valuePerMonth * termMonths.length;
    const newBreakdown = {};
    termMonths.forEach((month, index) => {
      const monthValue =
        index === termMonths.length - 1 ? valuePerMonth + remainder : valuePerMonth;
      newBreakdown[month.key] = monthValue.toString();
    });
    setMonthsBreakdown(newBreakdown);
  };

  const handleMonthValueChange = (monthKey, monthValue) => {
    setMonthsBreakdown((prev) => ({ ...prev, [monthKey]: monthValue }));
    setBreakdownErrors((prev) => {
      const next = { ...prev };
      delete next[monthKey];
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = canAddBudgetType(type, existingBudgets);
    if (!validation.canAdd) {
      setValidationError(validation.reason);
      setBreakdownErrors({});
      return;
    }

    const totalValue = parseFloat(value) || 0;
    const needsBreakdown = termMonths.length > 0 && totalValue > 0;
    if (needsBreakdown) {
      setShowMonthsBreakdown(true);
    }

    const schema = getAddBudgetSchema(termMonths);
    try {
      await schema.validate(
        {
          value,
          description,
          monthsBreakdown: needsBreakdown ? monthsBreakdown : {},
        },
        { abortEarly: false, context: { budgetValue: totalValue } }
      );
    } catch (err) {
      if (err.name === 'ValidationError' && err.inner) {
        const byPath = {};
        err.inner.forEach((e) => {
          if (e.path?.startsWith('monthsBreakdown.')) {
            const monthKey = e.path.replace('monthsBreakdown.', '');
            byPath[monthKey] = e.message;
          } else if (e.path === 'monthsBreakdown') {
            termMonths.forEach((m) => {
              if (!byPath[m.key]) byPath[m.key] = e.message;
            });
          }
        });
        const topError = err.inner.find(
          (e) => e.path === 'value' || e.path === 'description'
        );
        setValidationError(topError ? topError.message : '');
        setBreakdownErrors(byPath);
      } else {
        setValidationError(err.message ?? 'Validation failed');
        setBreakdownErrors({});
      }
      return;
    }

    setValidationError('');
    setBreakdownErrors({});

    const hasBreakdownValues = Object.values(monthsBreakdown).some(
      (v) => parseFloat(v) > 0
    );
    const cleanedBreakdown = {};
    if (showMonthsBreakdown && hasBreakdownValues) {
      Object.entries(monthsBreakdown).forEach(([key, val]) => {
        const numVal = parseFloat(val) || 0;
        if (numVal > 0) cleanedBreakdown[key] = numVal;
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
        months_breakdown:
          hasBreakdownValues && showMonthsBreakdown ? cleanedBreakdown : undefined,
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
          setBreakdownErrors({});
          onSuccess?.();
        },
      }
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setMedia(file);
  };

  const resetTypeDropdown = () => setValidationError('');

  return {
    // Form state
    type,
    setType,
    value,
    setValue,
    description,
    setDescription,
    media,
    setMedia,
    showTypeDropdown,
    setShowTypeDropdown,
    validationError,
    monthsBreakdown,
    showMonthsBreakdown,
    setShowMonthsBreakdown,
    breakdownErrors,
    // Derived
    termMonths,
    breakdownTotal,
    breakdownValidation,
    typeOptions,
    defaultType,
    hasTermMonths: termMonths.length > 0,
    selectedType: typeOptions.find((t) => t.value === type),
    // Handlers
    handleDistributeEvenly,
    handleMonthValueChange,
    handleSubmit,
    handleFileChange,
    handleSelectType: (newType) => {
      setType(newType);
      setShowTypeDropdown(false);
      resetTypeDropdown();
    },
    createBudgetMutation,
    onCancel,
  };
}

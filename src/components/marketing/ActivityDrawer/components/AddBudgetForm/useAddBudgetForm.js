import { useState, useMemo, useEffect } from 'react';
import { useCreateActivityBudget } from '@/hooks/api/useActivities';
import { getAvailableBudgetTypes, canAddBudgetType } from '../../utils/budgetValidation';
import { getTermMonths } from './utils';
import { getAddBudgetSchema, isMediaRequiredForBudgetType } from './addBudgetSchema';

export function useAddBudgetForm({
  activityId,
  planId,
  companyId,
  existingBudgets = [],
  initialType = null,
  isAdmin = true,
  onSuccess,
  onCancel,
  activityStartDate,
  activityEndDate,
}) {
  const [type, setType] = useState(initialType || 'estimated cost');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState([]);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [mediaError, setMediaError] = useState('');
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

  // Clear breakdown errors when monthly sum matches budget (blank months count as 0)
  useEffect(() => {
    if (termMonths.length === 0) return;
    const totalValue = parseFloat(value) || 0;
    if (totalValue <= 0) return;
    const sum = termMonths.reduce(
      (s, m) => s + (parseFloat(monthsBreakdown[m.key]) || 0),
      0
    );
    if (Math.abs(sum - totalValue) < 0.01) {
      setBreakdownErrors({});
    }
  }, [termMonths, value, monthsBreakdown]);

  const needsMonthlyBreakdown = termMonths.length > 0 && (parseFloat(value) || 0) > 0;

  const breakdownValidation = useMemo(() => {
    const totalValue = parseFloat(value) || 0;
    if (!needsMonthlyBreakdown) return { isValid: true, message: '' };
    if (Math.abs(breakdownTotal - totalValue) < 0.01) {
      return { isValid: true, message: '' };
    }
    if (breakdownTotal > totalValue) {
      return {
        isValid: false,
        message: 'Monthly total exceeds budget value',
      };
    }
    return {
      isValid: false,
      message: 'Monthly total must equal budget value',
    };
  }, [value, breakdownTotal, needsMonthlyBreakdown]);

  const typeOptions = useMemo(
    () => getAvailableBudgetTypes(existingBudgets, { isAdmin }),
    [existingBudgets, isAdmin]
  );

  const defaultType = useMemo(() => {
    const preferred = typeOptions.find((t) => t.value === initialType && t.canAdd);
    if (preferred) return preferred.value;
    const available = typeOptions.find((t) => t.canAdd);
    return available ? available.value : 'estimated cost';
  }, [typeOptions, initialType]);

  useEffect(() => {
    const preferred = typeOptions.find((t) => t.value === initialType && t.canAdd);
    if (preferred) {
      setType(preferred.value);
      return;
    }
    const currentTypeOption = typeOptions.find((t) => t.value === type);
    if (!currentTypeOption?.canAdd) {
      setType(defaultType);
    }
  }, [type, typeOptions, defaultType, initialType]);

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
    setMediaError('');

    const validation = canAddBudgetType(type, existingBudgets, { isAdmin });
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
          media,
          monthsBreakdown: needsBreakdown ? monthsBreakdown : {},
        },
        {
          abortEarly: false,
          context: { budgetValue: totalValue, budgetType: type },
        }
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
        const mediaErr = err.inner.find((e) => e.path === 'media');
        setMediaError(mediaErr ? mediaErr.message : '');
        const topError = err.inner.find(
          (e) => e.path === 'value' || e.path === 'description'
        );
        setValidationError(topError ? topError.message : '');
        setBreakdownErrors(byPath);
      } else {
        setValidationError(err.message ?? 'Validation failed');
        setMediaError('');
        setBreakdownErrors({});
      }
      return;
    }

    setValidationError('');
    setMediaError('');
    setBreakdownErrors({});

    const cleanedBreakdown = {};
    if (needsBreakdown) {
      termMonths.forEach((month) => {
        const raw = monthsBreakdown[month.key];
        const numVal =
          raw === '' || raw == null ? 0 : parseFloat(raw);
        cleanedBreakdown[month.key] = Number.isNaN(numVal) ? 0 : numVal;
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
        months_breakdown: needsBreakdown ? cleanedBreakdown : undefined,
      },
      {
        onSuccess: () => {
          setValue('');
          setDescription('');
          setMedia([]);
          setType(defaultType);
          setValidationError('');
          setMonthsBreakdown({});
          setShowMonthsBreakdown(false);
          setBreakdownErrors({});
          setMediaError('');
          onSuccess?.();
        },
      }
    );
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      setMedia((prev) => [...prev, ...files]);
      setMediaError('');
    }
    e.target.value = '';
  };

  const handleRemoveFile = (index) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
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
    mediaError,
    monthsBreakdown,
    showMonthsBreakdown,
    setShowMonthsBreakdown,
    breakdownErrors,
    // Derived
    termMonths,
    breakdownTotal,
    breakdownValidation,
    needsMonthlyBreakdown,
    typeOptions,
    defaultType,
    hasTermMonths: termMonths.length > 0,
    selectedType: typeOptions.find((t) => t.value === type),
    isMediaRequired: isMediaRequiredForBudgetType(type),
    // Handlers
    handleDistributeEvenly,
    handleMonthValueChange,
    handleSubmit,
    handleFileChange,
    handleRemoveFile,
    handleSelectType: (newType) => {
      setType(newType);
      setShowTypeDropdown(false);
      resetTypeDropdown();
      setMediaError('');
    },
    createBudgetMutation,
    onCancel,
  };
}

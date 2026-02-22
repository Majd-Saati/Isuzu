/**
 * Validates if a budget type can be added based on existing budgets
 * Order: estimated cost -> actual cost -> support cost
 *
 * @param {string} type - The budget type to validate
 * @param {Array} existingBudgets - Array of existing budget entries
 * @returns {Object} - { canAdd: boolean, reason: string }
 */
export const canAddBudgetType = (type, existingBudgets = []) => {
  const hasEstimated = existingBudgets.some(b => b.type === 'estimated cost');
  const hasActual = existingBudgets.some(b => b.type === 'actual cost');

  switch (type) {
    case 'estimated cost':
      return { canAdd: true, reason: '' };

    case 'actual cost':
      if (!hasEstimated) {
        return {
          canAdd: false,
          reason: 'You must add at least one "Estimated Cost" entry before adding an "Actual Cost" entry.'
        };
      }
      return { canAdd: true, reason: '' };

    case 'support cost':
      if (!hasEstimated) {
        return {
          canAdd: false,
          reason: 'You must add at least one "Estimated Cost" entry before adding a "Support Cost" entry.'
        };
      }
      if (!hasActual) {
        return {
          canAdd: false,
          reason: 'You must add at least one "Actual Cost" entry before adding a "Support Cost" entry.'
        };
      }
      return { canAdd: true, reason: '' };

    default:
      return { canAdd: true, reason: '' };
  }
};

/**
 * Gets all available budget types based on existing budgets
 * 
 * @param {Array} existingBudgets - Array of existing budget entries
 * @returns {Array} - Array of available type options with validation info
 */
export const getAvailableBudgetTypes = (existingBudgets = []) => {
  const allTypes = [
    { value: 'estimated cost', label: 'Estimated Cost', color: 'text-blue-600' },
    { value: 'actual cost', label: 'Actual Cost', color: 'text-emerald-600' },
    { value: 'support cost', label: 'Support Cost', color: 'text-purple-600' },
  ];

  return allTypes.map(type => {
    const validation = canAddBudgetType(type.value, existingBudgets);
    return {
      ...type,
      canAdd: validation.canAdd,
      reason: validation.reason,
    };
  });
};


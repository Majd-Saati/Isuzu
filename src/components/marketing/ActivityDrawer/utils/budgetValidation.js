const isApprovedStatus = (status) => {
  const key = (status || '').toLowerCase();
  return key === 'accepted' || key === 'approved';
};

const hasApprovedEstimatedCost = (existingBudgets = []) =>
  existingBudgets.some(
    (b) => b.type === 'estimated cost' && isApprovedStatus(b.status)
  );

const hasApprovedActualCost = (existingBudgets = []) =>
  existingBudgets.some(
    (b) => b.type === 'actual cost' && isApprovedStatus(b.status)
  );

/**
 * Validates if a budget type can be added based on existing budgets
 * Order: estimated cost -> actual cost -> support cost
 *
 * @param {string} type - The budget type to validate
 * @param {Array} existingBudgets - Array of existing budget entries
 * @param {{ isAdmin?: boolean }} [options]
 * @returns {Object} - { canAdd: boolean, reason: string }
 */
export const canAddBudgetType = (type, existingBudgets = [], { isAdmin = true } = {}) => {
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
      if (!hasApprovedEstimatedCost(existingBudgets)) {
        return {
          canAdd: false,
          reason: 'You must have at least one approved Estimated Cost before adding an Actual Cost entry.',
        };
      }
      return { canAdd: true, reason: '' };

    case 'support cost':
      if (!isAdmin) {
        return {
          canAdd: false,
          reason: '',
        };
      }
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
      if (!hasApprovedActualCost(existingBudgets)) {
        return {
          canAdd: false,
          reason: 'You must have at least one approved Actual Cost before adding a Support Cost entry.',
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
 * @param {{ isAdmin?: boolean }} [options]
 * @returns {Array} - Array of available type options with validation info
 */
export const getAvailableBudgetTypes = (existingBudgets = [], { isAdmin = true } = {}) => {
  const allTypes = [
    { value: 'estimated cost', label: 'Estimated Cost', color: 'text-blue-600' },
    { value: 'actual cost', label: 'Actual Cost', color: 'text-emerald-600' },
    { value: 'support cost', label: 'Support Cost', color: 'text-purple-600' },
  ];

  const typesForRole = isAdmin
    ? allTypes
    : allTypes.filter((t) => t.value !== 'support cost');

  return typesForRole.map((type) => {
    const validation = canAddBudgetType(type.value, existingBudgets, { isAdmin });
    return {
      ...type,
      canAdd: validation.canAdd,
      reason: validation.reason,
    };
  });
};


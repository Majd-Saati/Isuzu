import { useMemo, useCallback } from 'react';
import { useUpdateBudgetStatus, useDeleteActivity, useDeleteBudget, useDeleteMeta } from '@/hooks/api/useActivities';

export const useActivityDrawerActions = ({ activity, planId, companyId, onClose }) => {
  // Memoize the activity context to prevent unnecessary re-renders
  const activityContext = useMemo(() => ({
    activityId: activity?.id,
    planId: planId,
    companyId: companyId,
  }), [activity?.id, planId, companyId]);

  // Mutations
  const updateBudgetStatusMutation = useUpdateBudgetStatus(activityContext);
  const deleteActivityMutation = useDeleteActivity();
  const deleteBudgetMutation = useDeleteBudget(activityContext);
  const deleteMetaMutation = useDeleteMeta(activityContext);

  return {
    activityContext,
    updateBudgetStatusMutation,
    deleteActivityMutation,
    deleteBudgetMutation,
    deleteMetaMutation,
  };
};

import { useMemo } from 'react';
import { useActivityMeta, useActivityBudgetList } from '@/hooks/api/useActivities';

export const useActivityDrawerData = ({
  isOpen,
  activity,
  planId,
  companyId,
  budgetFilterType,
  budgetFilterStatus,
  metaType,
}) => {
  // Memoize query params for budget list
  const budgetQueryParams = useMemo(
    () => ({
      activityId: activity?.id,
      planId: planId,
      companyId: companyId,
      type: budgetFilterType,
      status: budgetFilterStatus,
      page: 1,
      perPage: 100,
    }),
    [activity?.id, planId, companyId, budgetFilterType, budgetFilterStatus]
  );

  // Memoize query params for meta (comments/evidences)
  const metaQueryParams = useMemo(() => ({
    activityId: activity?.id,
    planId: planId,
    companyId: companyId,
    type: metaType,
  }), [activity?.id, planId, companyId, metaType]);

  // Fetch activity meta data - only when drawer is open
  const {
    data: metaData,
    isLoading: isLoadingMeta,
    isError: isErrorMeta,
    refetch: refetchActivityMeta,
  } = useActivityMeta(metaQueryParams, {
    enabled: isOpen && !!activity?.id && !!planId && !!companyId,
  });

  // Budget list (includes months_breakdown) — fetch whenever drawer is open for Overview merge + Budget tab
  const { 
    data: budgetListData, 
    isLoading: isLoadingBudget, 
    isError: isErrorBudget,
    refetch: refetchBudgetList,
  } = useActivityBudgetList(budgetQueryParams, {
    enabled: isOpen && !!activity?.id && !!planId && !!companyId,
  });

  return {
    metaData,
    isLoadingMeta,
    isErrorMeta,
    refetchActivityMeta,
    budgetListData,
    isLoadingBudget,
    isErrorBudget,
    refetchBudgetList,
  };
};

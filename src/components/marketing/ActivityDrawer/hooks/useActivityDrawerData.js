import { useMemo } from 'react';
import { useActivityMeta, useActivityBudgetList } from '@/hooks/api/useActivities';

export const useActivityDrawerData = ({
  isOpen,
  activity,
  planId,
  companyId,
  activeTab,
  budgetFilterType,
  budgetFilterStatus,
  metaType,
}) => {
  // Memoize query params for budget list
  const budgetQueryParams = useMemo(() => ({
    activityId: activity?.id,
    planId: planId,
    companyId: companyId,
    type: budgetFilterType,
    status: budgetFilterStatus,
  }), [activity?.id, planId, companyId, budgetFilterType, budgetFilterStatus]);

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
    isError: isErrorMeta 
  } = useActivityMeta(
    metaQueryParams,
    {
      enabled: isOpen && !!activity?.id && !!planId && !!companyId,
    }
  );

  // Fetch activity budget list - only when budget tab is active
  const { 
    data: budgetListData, 
    isLoading: isLoadingBudget, 
    isError: isErrorBudget 
  } = useActivityBudgetList(budgetQueryParams, {
    enabled: isOpen && !!activity?.id && !!planId && !!companyId && activeTab === 'budget',
  });

  return {
    metaData,
    isLoadingMeta,
    isErrorMeta,
    budgetListData,
    isLoadingBudget,
    isErrorBudget,
  };
};

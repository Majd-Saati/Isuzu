import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { activitiesService } from '@/lib/api/services/activitiesService';

export const useActivities = (params = {}) => {
  return useQuery({
    queryKey: ['activities', params],
    queryFn: () => activitiesService.getActivities(params),
    select: (data) => ({
      activities: data?.body?.activities || [],
      pagination: data?.body?.pagination || {
        page: 1,
        per_page: 20,
        total: 0,
        total_pages: 1,
      },
    }),
    enabled: params.planIds && params.planIds.length > 0,
  });
};

export const useActivity = (id) => {
  return useQuery({
    queryKey: ['activity', id],
    queryFn: () => activitiesService.getActivity(id),
    enabled: !!id,
  });
};

export const useCreateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activitiesService.createActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
};

export const useUpdateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activitiesService.updateActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
};

export const useDeleteActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activitiesService.deleteActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
};

export const useUpdateActivityStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activitiesService.updateActivityStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
};

export const useActivityMeta = (params = {}, options = {}) => {
  const { activityId, planId, companyId, type } = params;
  return useQuery({
    queryKey: ['activityMeta', String(activityId || ''), String(planId || ''), String(companyId || ''), type || ''],
    queryFn: () => activitiesService.getActivityMeta(params),
    select: (data) => ({
      meta: data?.body?.meta || [],
      budget: data?.body?.budget || [],
      pagination: data?.body?.pagination || {
        page: 1,
        per_page: 20,
        total: 0,
        total_pages: 0,
      },
    }),
    enabled: !!activityId && !!planId && !!companyId,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useActivityBudgetList = (params = {}, options = {}) => {
  const { activityId, planId, companyId, type, status } = params;
  return useQuery({
    queryKey: [
      'activityBudgetList',
      String(activityId || ''),
      String(planId || ''),
      String(companyId || ''),
      type || '',
      status || '',
    ],
    queryFn: () => activitiesService.getActivityBudgetList(params),
    select: (data) => ({
      budget: data?.body?.budget || [],
      pagination: data?.body?.pagination || {
        page: 1,
        per_page: 20,
        total: 0,
        total_pages: 0,
      },
    }),
    enabled: !!activityId && !!planId && !!companyId,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useCreateActivityBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activitiesService.createActivityBudget,
    onSettled: (_, __, variables) => {
      const actId = String(variables.activity_id);
      const plnId = String(variables.plan_id);
      const cmpId = String(variables.company_id);
      
      // Invalidate and let React Query handle refetch for all matching (including filtered) queries
      queryClient.invalidateQueries({ 
        queryKey: ['activityBudgetList', actId, plnId, cmpId],
        refetchType: 'active'
      });
      queryClient.invalidateQueries({ 
        queryKey: ['activityMeta', actId, plnId, cmpId], 
        exact: true,
        refetchType: 'active'
      });
    },
  });
};

export const useUpdateBudgetStatus = (activityContext = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activitiesService.updateBudgetStatus,
    onSettled: () => {
      const { activityId, planId, companyId } = activityContext;
      
      if (activityId && planId && companyId) {
        const actId = String(activityId);
        const plnId = String(planId);
        const cmpId = String(companyId);
        
        // Invalidate and let React Query handle refetch for all matching (including filtered) queries
        queryClient.invalidateQueries({ 
          queryKey: ['activityBudgetList', actId, plnId, cmpId],
          refetchType: 'active'
        });
        queryClient.invalidateQueries({ 
          queryKey: ['activityMeta', actId, plnId, cmpId], 
          exact: true,
          refetchType: 'active'
        });
      }
    },
  });
};

export const useDeleteBudget = (activityContext = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activitiesService.deleteBudget,
    onSettled: () => {
      const { activityId, planId, companyId } = activityContext;
      
      if (activityId && planId && companyId) {
        const actId = String(activityId);
        const plnId = String(planId);
        const cmpId = String(companyId);
        
        // Invalidate and let React Query handle refetch for all matching (including filtered) queries
        queryClient.invalidateQueries({ 
          queryKey: ['activityBudgetList', actId, plnId, cmpId],
          refetchType: 'active'
        });
        queryClient.invalidateQueries({ 
          queryKey: ['activityMeta', actId, plnId, cmpId], 
          exact: true,
          refetchType: 'active'
        });
      }
    },
  });
};

export const useCreateActivityMeta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activitiesService.createActivityMeta,
    onSettled: (_, __, variables) => {
      const actId = String(variables.activity_id);
      const plnId = String(variables.plan_id);
      const cmpId = String(variables.company_id);
      
      // Invalidate activity meta query (without exact: true to match all type filters)
      queryClient.invalidateQueries({ 
        queryKey: ['activityMeta', actId, plnId, cmpId], 
        refetchType: 'active'
      });
    },
  });
};

export const useDeleteMeta = (activityContext = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activitiesService.deleteMeta,
    onSettled: () => {
      const { activityId, planId, companyId } = activityContext;
      
      if (activityId && planId && companyId) {
        const actId = String(activityId);
        const plnId = String(planId);
        const cmpId = String(companyId);
        
        // Invalidate activity meta query (without exact: true to match all type filters)
        queryClient.invalidateQueries({ 
          queryKey: ['activityMeta', actId, plnId, cmpId], 
          refetchType: 'active'
        });
      }
    },
  });
};


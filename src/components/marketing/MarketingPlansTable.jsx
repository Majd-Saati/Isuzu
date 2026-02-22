import React, { useMemo } from 'react';
import { DealerPlanTable } from './DealerPlanTable';

// Calculate costs from budget array
const calculateCosts = (budget = []) => {
  let estimatedCost = 0;
  let actualCost = 0;
  let supportCost = 0;

  let estimatedStatus = null;
  let actualStatus = null;
  let supportStatus = null;

  budget.forEach((item) => {
    const value = parseFloat(item.value) || 0;
    const type = (item.type || '').toLowerCase();
    const status = item.status || null;

    if (type === 'estimated cost') {
      estimatedCost += value;
      estimatedStatus = status || estimatedStatus;
    } else if (type === 'actual cost') {
      actualCost += value;
      actualStatus = status || actualStatus;
    } else if (type === 'support cost') {
      supportCost += value;
      supportStatus = status || supportStatus;
    }
  });

  return {
    estimatedCost,
    actualCost,
    supportCost,
    estimatedStatus,
    actualStatus,
    supportStatus,
  };
};

// Transform API activity to component format
const transformActivity = (apiActivity) => {
  const {
    estimatedCost,
    actualCost,
    supportCost,
    estimatedStatus,
    actualStatus,
    supportStatus,
  } = calculateCosts(apiActivity.budget);

  const isOverBudget = actualCost > estimatedCost;

  return {
    id: parseInt(apiActivity.id),
    name: apiActivity.name,
    hasComment: false,
    commentCount: 0,
    hasAddIcon: true,
    duration: {
      start: apiActivity.starts_at,
      end: apiActivity.ends_at,
    },
    teamMember: {
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${apiActivity.id}`,
      badge: null,
    },
    estimatedCost,
    actualCost,
    supportCost,
    estimatedStatus,
    actualStatus,
    supportStatus,
    isOverBudget,
    status: apiActivity.status,
    created_by_name: apiActivity.created_by_name,
    status_updated_by_name: apiActivity.status_updated_by_name,
  };
};

// Transform API plan data to component format
const transformPlanData = (apiPlan, activitiesForPlan = []) => {
  // Transform only real activities from API
  const activities = activitiesForPlan.map(transformActivity);
  
  return {
    id: parseInt(apiPlan.id),
    quarter: apiPlan.term_name || 'N/A',
    name: apiPlan.name,
    description: apiPlan.description,
    totalActivities: activities.length,
    activities: activities,
    // Additional data from API
    company_name: apiPlan.company_name,
    company_id: apiPlan.company_id,
    status: apiPlan.status,
    creation_date: apiPlan.creation_date,
    start_date: apiPlan.start_date,
    end_date: apiPlan.end_date,
    term_name: apiPlan.term_name,
    term_id: apiPlan.term_id,
  };
};

export const MarketingPlansTable = ({ plans = [], activities = [], onEditPlan, companies = [], terms = [], showBudgetColumns = false, showMediaUploadColumns = false, autoOpenActivityId = null }) => {
  // Group activities by plan_id
  const activitiesByPlan = useMemo(() => {
    const grouped = {};
    activities.forEach(activity => {
      const planId = activity.plan_id;
      if (!grouped[planId]) {
        grouped[planId] = [];
      }
      grouped[planId].push(activity);
    });
    return grouped;
  }, [activities]);
  
  // Transform plans with their activities
  const transformedPlans = useMemo(() => {
    return plans.map(plan => {
      const planActivities = activitiesByPlan[plan.id] || [];
      return transformPlanData(plan, planActivities);
    });
  }, [plans, activitiesByPlan]);
  
  return (
    <div className="space-y-6">
      {transformedPlans.map((plan) => (
        <DealerPlanTable
          key={plan.id}
          plan={plan}
          onEdit={onEditPlan}
          companies={companies}
          terms={terms}
          showBudgetColumns={showBudgetColumns}
          showMediaUploadColumns={showMediaUploadColumns}
          autoOpenActivityId={autoOpenActivityId}
        />
      ))}
    </div>
  );
};

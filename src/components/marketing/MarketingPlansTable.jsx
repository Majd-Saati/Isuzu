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

  // Track latest status per type as a fallback for the UI badge color
  let latestEstimatedStatus = null;
  let latestActualStatus = null;
  let latestSupportStatus = null;

  budget.forEach((item) => {
    const value = parseFloat(item.value) || 0;
    const type = (item.type || '').toLowerCase();
    const status = (item.status || '').toLowerCase() || null;
    const isAccepted = status === 'accepted';

    if (type === 'estimated cost') {
      latestEstimatedStatus = status || latestEstimatedStatus;
      if (isAccepted) {
        estimatedCost += value;
        estimatedStatus = 'accepted';
      }
    } else if (type === 'actual cost') {
      latestActualStatus = status || latestActualStatus;
      if (isAccepted) {
        actualCost += value;
        actualStatus = 'accepted';
      }
    } else if (type === 'support cost') {
      latestSupportStatus = status || latestSupportStatus;
      if (isAccepted) {
        supportCost += value;
        supportStatus = 'accepted';
      }
    }
  });

  // If no accepted entries exist for a type, fall back to the latest status so the badge still reflects state
  estimatedStatus = estimatedStatus || latestEstimatedStatus;
  actualStatus = actualStatus || latestActualStatus;
  supportStatus = supportStatus || latestSupportStatus;

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
    logo: apiActivity.logo || null,
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
const transformPlanData = (apiPlan, activitiesForPlan = [], planSummary = null) => {
  // Transform only real activities from API
  const activities = activitiesForPlan.map(transformActivity);
  
  return {
    id: parseInt(apiPlan.id),
    quarter: apiPlan.term_name || 'N/A',
    name: apiPlan.name,
    description: apiPlan.description,
    totalActivities: activities.length,
    activities: activities,
    planSummary,
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

export const MarketingPlansTable = ({ plans = [], activities = [], plansSummary = [], onEditPlan, companies = [], terms = [], showBudgetColumns = false, showMediaUploadColumns = false, autoOpenActivityId = null }) => {
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

  // Map plan_id -> summary for lookup
  const summaryByPlanId = useMemo(() => {
    const map = {};
    (plansSummary || []).forEach((s) => {
      const id = s.plan_id != null ? String(s.plan_id) : null;
      if (id) map[id] = s;
    });
    return map;
  }, [plansSummary]);
  
  // Transform plans with their activities and API plan summary
  const transformedPlans = useMemo(() => {
    return plans.map(plan => {
      const planActivities = activitiesByPlan[plan.id] || [];
      const planIdKey = plan.id != null ? String(plan.id) : null;
      const summary = planIdKey ? summaryByPlanId[planIdKey] || null : null;
      return transformPlanData(plan, planActivities, summary);
    });
  }, [plans, activitiesByPlan, summaryByPlanId]);
  
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

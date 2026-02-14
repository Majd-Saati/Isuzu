import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MarketingPlansTable } from '@/components/marketing/MarketingPlansTable';
import { MarketingPlansTableSkeleton } from '@/components/marketing/MarketingPlansTableSkeleton';
import { MarketingPlansTableEmpty } from '@/components/marketing/MarketingPlansTableEmpty';
import { MarketingPlansActionBar } from '@/components/marketing/MarketingPlansActionBar';
import { AddPlanModal } from '@/components/marketing/AddPlanModal';
import { usePlans, useCreatePlan, useUpdatePlan } from '@/hooks/api/usePlans';
import { useActivities } from '@/hooks/api/useActivities';
import { useMarketingPlansFilters } from '@/hooks/useMarketingPlansFilters';

const MarketingPlans = () => {
  // Plan modal state
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [planModalMode, setPlanModalMode] = useState('create');
  const [editPlanData, setEditPlanData] = useState(null);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // URL params for activity id and open drawer flag
  const [searchParams] = useSearchParams();
  // support both `activity_id` and `activity` (export previously used `activity`)
  const rawActivityParam = searchParams.get('activity_id') || searchParams.get('activity');
  const openDrawerParam = searchParams.get('openDrawer') || searchParams.get('openDrawer');
  // Only auto-open when openDrawer flag is present and truthy (e.g. '1' or 'true')
  const activityIdFromUrl = rawActivityParam && ['1', 'true', 'yes'].includes((openDrawerParam || '1').toString().toLowerCase())
    ? rawActivityParam
    : null;

  // Filters and pagination from custom hook
  const {
    page,
    perPage,
    companyFilter,
    termFilter,
    companyFilterId,
    companyFilterName,
    termFilterId,
    companies,
    terms,
    isAdmin,
  } = useMarketingPlansFilters();
  console.log('isAdmin',isAdmin);
  
  // API mutations
  const createPlanMutation = useCreatePlan();
  const updatePlanMutation = useUpdatePlan();

  // Fetch plans
  const { data, isLoading: isLoadingPlans, isError } = usePlans({
    page,
    perPage,
    companyId: companyFilterId,
    termId: termFilterId,
    search: searchTerm || undefined,
  });
  const plans = data?.plans || [];

  // Fetch activities for all visible plans
  const planIds = useMemo(() => plans.map((plan) => plan.id), [plans]);
  const { data: activitiesData, isLoading: isLoadingActivities } = useActivities({
    planIds,
    page: 1,
    perPage: 100,
  });
  const activities = activitiesData?.activities || [];

  const isLoading = isLoadingPlans || isLoadingActivities;

  // Modal handlers
  const openCreateModal = useCallback(() => {
    setPlanModalMode('create');
    setEditPlanData(null);
    setShowAddPlanModal(true);
  }, []);

  const openEditModal = useCallback((plan) => {
    setPlanModalMode('edit');
    setEditPlanData(plan);
    setShowAddPlanModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowAddPlanModal(false);
    setPlanModalMode('create');
    setEditPlanData(null);
  }, []);

  const handleSubmitPlan = useCallback((payload) => {
    const mutation = planModalMode === 'edit' ? updatePlanMutation : createPlanMutation;
    mutation.mutate(payload, { onSuccess: closeModal });
  }, [planModalMode, updatePlanMutation, createPlanMutation, closeModal]);

  // Search handler
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // Render table content based on loading/error/empty state
  const renderContent = () => {
    if (isLoading) return <MarketingPlansTableSkeleton />;
    if (isError || plans.length === 0) return <MarketingPlansTableEmpty />;

    return (
      <MarketingPlansTable
        plans={plans}
        activities={activities}
        companies={companies}
        terms={terms}
        showBudgetColumns
        showMediaUploadColumns
        onEditPlan={openEditModal}
        autoOpenActivityId={activityIdFromUrl}
      />
    );
  };

  return (
    <>
      <AddPlanModal
        isOpen={showAddPlanModal}
        onClose={closeModal}
        onSubmit={handleSubmitPlan}
        isSubmitting={createPlanMutation.isPending || updatePlanMutation.isPending}
        mode={planModalMode}
        initialPlan={editPlanData}
        preselectedCompanyId={companyFilterId}
        preselectedCompanyName={companyFilterName}
        companies={companies}
        terms={terms}
      />

      {/* Page Header */}
      <div className="pt-6 pb-8 mb-8 border-b-2 border-gray-100 dark:border-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 pb-4 border-b-4 border-[#E60012] inline-block">
          Marketing Plans
        </h1>
      </div>

      {/* Action Bar */}
      <MarketingPlansActionBar
        onAddPlan={openCreateModal}
        companyFilter={companyFilter}
        termFilter={termFilter}
        search={searchTerm}
        onSearchChange={handleSearchChange}
        isAdmin={isAdmin}
      />

      {/* Content Separator */}
      <div className="mb-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Table */}
      {renderContent()}
    </>
  );
};

export default MarketingPlans;
import React, { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MarketingPlansTable } from '@/components/marketing/MarketingPlansTable';
import { MarketingPlansTableSkeleton } from '@/components/marketing/MarketingPlansTableSkeleton';
import { MarketingPlansTableEmpty } from '@/components/marketing/MarketingPlansTableEmpty';
import { MarketingPlansActionBar } from '@/components/marketing/MarketingPlansActionBar';
import { AddPlanModal } from '@/components/marketing/AddPlanModal';
import { CustomPagination } from '@/components/ui/CustomPagination';
import { usePlans, usePlan, useCreatePlan, useUpdatePlan } from '@/hooks/api/usePlans';
import { useActivities } from '@/hooks/api/useActivities';
import { useMarketingPlansFilters } from '@/hooks/useMarketingPlansFilters';
import { parseMarketingPlansDeepLink } from '@/lib/marketingPlansDeepLink';

const MarketingPlans = () => {
  // Plan modal state
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [planModalMode, setPlanModalMode] = useState('create');
  const [editPlanData, setEditPlanData] = useState(null);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Deep-link: open drawer + scroll to budget/meta
  const [searchParams] = useSearchParams();
  const deepLink = useMemo(
    () => parseMarketingPlansDeepLink(searchParams),
    [searchParams]
  );
  const activityIdFromUrl = deepLink.openDrawer ? deepLink.activityId : null;
  const planIdFromUrl = deepLink.planId;
  const budgetIdFromUrl = deepLink.budgetId;
  const metaIdFromUrl = deepLink.metaId;

  // Filters and pagination from custom hook
  const {
    page,
    setPage,
    perPage,
    setPerPage,
    companyFilter,
    termFilter,
    companyFilterId,
    companyFilterName,
    termFilterId,
    companies,
    terms,
    isAdmin,
  } = useMarketingPlansFilters();
  
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
  const listPlans = data?.plans || [];
  const pagination = data?.pagination;

  // Ensure deep-linked plan is available even if not on the current page
  const { data: deepPlan, isLoading: isLoadingDeepPlan } = usePlan(
    planIdFromUrl && activityIdFromUrl ? planIdFromUrl : null
  );

  const plans = useMemo(() => {
    if (!deepPlan?.id) return listPlans;
    if (listPlans.some((p) => String(p.id) === String(deepPlan.id))) return listPlans;
    return [deepPlan, ...listPlans];
  }, [listPlans, deepPlan]);

  // Fetch activities for all visible plans (+ deep-linked plan id)
  const planIds = useMemo(() => {
    const ids = plans.map((plan) => plan.id);
    if (planIdFromUrl && !ids.some((id) => String(id) === String(planIdFromUrl))) {
      return [...ids, planIdFromUrl];
    }
    return ids;
  }, [plans, planIdFromUrl]);

  const { data: activitiesData, isLoading: isLoadingActivities } = useActivities({
    planIds,
    page: 1,
    perPage: 100,
  });
  const activities = activitiesData?.activities || [];
  const plansSummary = activitiesData?.plans_summary || [];

  const isLoading =
    isLoadingPlans ||
    isLoadingActivities ||
    (Boolean(planIdFromUrl && activityIdFromUrl) && isLoadingDeepPlan);

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
    setPage(1);
  }, [setPage]);

  const handlePageChange = useCallback((newPage) => {
    if (newPage < 1) return;
    if (pagination?.total_pages && newPage > pagination.total_pages) return;
    setPage(newPage);
  }, [setPage, pagination?.total_pages]);

  const handlePerPageChange = useCallback((newPerPage) => {
    setPerPage(newPerPage);
    setPage(1);
  }, [setPerPage, setPage]);

  // Render table content based on loading/error/empty state
  const renderContent = () => {
    if (isLoading) return <MarketingPlansTableSkeleton />;
    if (isError || plans.length === 0) return <MarketingPlansTableEmpty />;

    return (
      <MarketingPlansTable
        plans={plans}
        activities={activities}
        plansSummary={plansSummary}
        companies={companies}
        terms={terms}
        showBudgetColumns
        showMediaUploadColumns
        onEditPlan={openEditModal}
        autoOpenActivityId={activityIdFromUrl}
        autoOpenPlanId={planIdFromUrl}
        highlightBudgetId={budgetIdFromUrl}
        highlightMetaId={metaIdFromUrl}
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

      {/* Pagination */}
      {!isLoading && !isError && plans.length > 0 && pagination && (
        <div className="mt-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
          <CustomPagination
            currentPage={pagination.page || page}
            totalPages={pagination.total_pages || 1}
            onPageChange={handlePageChange}
            itemsPerPage={pagination.per_page || perPage}
            totalItems={pagination.total || 0}
            onItemsPerPageChange={handlePerPageChange}
          />
        </div>
      )}
    </>
  );
};

export default MarketingPlans;

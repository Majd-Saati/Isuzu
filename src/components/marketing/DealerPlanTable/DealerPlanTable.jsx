import React from 'react';
import { AddActivityModal } from '../AddActivityModal';
import { StatusUpdateModal } from '../StatusUpdateModal';
import { ActivityDrawer } from '../ActivityDrawer';
import { DeleteConfirmationModal } from '../../ui/DeleteConfirmationModal';
import { useDealerPlanTable } from './hooks/useDealerPlanTable';
import { PlanHeader } from './components/PlanHeader';
import { ActivitiesTable } from './components/ActivitiesTable';
import { ActivitiesCards } from './components/ActivitiesCards';
import { ActivitiesFooter } from './components/ActivitiesFooter';

export const DealerPlanTable = ({ 
  plan, 
  onEdit, 
  companies = [], 
  terms = [], 
  onPlanDeleted, 
  showBudgetColumns = false, 
  showMediaUploadColumns = false, 
  autoOpenActivityId = null 
}) => {
  const {
    // State
    isExpanded,
    setIsExpanded,
    selectedActivities,
    showAddActivityModal,
    setShowAddActivityModal,
    openStatusMenu,
    showStatusUpdateModal,
    statusUpdateData,
    showActivityDrawer,
    setShowActivityDrawer,
    selectedActivity,
    drawerBudgetFilter,
    drawerMetaType,
    showDeleteModal,
    showPlanMenu,
    setShowPlanMenu,
    statusMenuPosition,
    statusButtonRefs,
    customStatusInputs,
    isAdmin,
    isAllSelected,
    
    // Handlers
    handleOpenDrawer,
    handleSelectAll,
    handleSelectActivity,
    handleAddActivity,
    handleStatusClick,
    handleCustomStatusSubmit,
    handleCustomStatusInputChange,
    handleConfirmStatusUpdate,
    handleCloseStatusModal,
    handleDeletePlan,
    handleConfirmDelete,
    handleCloseDeleteModal,
    handleStatusMenuToggle,
    
    // Mutations
    createActivityMutation,
    updateStatusMutation,
    deletePlanMutation,
  } = useDealerPlanTable({ plan, autoOpenActivityId, onPlanDeleted });

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-visible shadow-sm border-2 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 relative">
      {/* Plan Header */}
      <PlanHeader
        plan={plan}
        isExpanded={isExpanded}
        onToggleExpand={() => setIsExpanded(!isExpanded)}
        onEdit={onEdit}
        onDelete={handleDeletePlan}
        onAddActivity={() => setShowAddActivityModal(true)}
        showPlanMenu={showPlanMenu}
        onTogglePlanMenu={() => setShowPlanMenu(!showPlanMenu)}
      />

      {/* Plan Content */}
      {isExpanded && (
        <div className="animate-accordion-down">
          {/* Desktop Table */}
          <ActivitiesTable
            activities={plan.activities}
            selectedActivities={selectedActivities}
            onSelectActivity={handleSelectActivity}
            onSelectAll={handleSelectAll}
            isAllSelected={isAllSelected}
            onOpenDrawer={handleOpenDrawer}
            onAddActivity={() => setShowAddActivityModal(true)}
            showBudgetColumns={showBudgetColumns}
            showMediaUploadColumns={showMediaUploadColumns}
            isAdmin={isAdmin}
            openStatusMenu={openStatusMenu}
            statusMenuPosition={statusMenuPosition}
            statusButtonRefs={statusButtonRefs}
            customStatusInputs={customStatusInputs}
            onCustomStatusInputChange={handleCustomStatusInputChange}
            onCustomStatusSubmit={handleCustomStatusSubmit}
            onStatusClick={handleStatusClick}
            onStatusMenuToggle={handleStatusMenuToggle}
          />

          {/* Mobile Card Layout */}
          <ActivitiesCards
            activities={plan.activities}
            selectedActivities={selectedActivities}
            onSelectActivity={handleSelectActivity}
            onOpenDrawer={handleOpenDrawer}
            showBudgetColumns={showBudgetColumns}
            isAdmin={isAdmin}
            openStatusMenu={openStatusMenu}
            statusMenuPosition={statusMenuPosition}
            statusButtonRefs={statusButtonRefs}
            customStatusInputs={customStatusInputs}
            onCustomStatusInputChange={handleCustomStatusInputChange}
            onCustomStatusSubmit={handleCustomStatusSubmit}
            onStatusClick={handleStatusClick}
            onStatusMenuToggle={handleStatusMenuToggle}
          />

          {/* Activities Footer */}
          <ActivitiesFooter
            activities={plan.activities}
            selectedActivities={selectedActivities}
            showBudgetColumns={showBudgetColumns}
          />
        </div>
      )}

      {/* Modals */}
      <AddActivityModal 
        isOpen={showAddActivityModal}
        onClose={() => setShowAddActivityModal(false)}
        onSubmit={handleAddActivity}
        isSubmitting={createActivityMutation.isPending}
        companies={companies}
        terms={terms}
        planStartDate={plan.start_date}
        planEndDate={plan.end_date}
        planName={plan.name}
        preselectedCompanyId={plan.company_id}
        preselectedCompanyName={plan.company_name}
        preselectedTermId={plan.term_id}
        preselectedTermName={plan.term_name}
      />

      <StatusUpdateModal
        isOpen={showStatusUpdateModal}
        onClose={handleCloseStatusModal}
        onConfirm={handleConfirmStatusUpdate}
        activityName={statusUpdateData?.activityName}
        currentStatus={statusUpdateData?.currentStatus}
        newStatus={statusUpdateData?.newStatus}
        isLoading={updateStatusMutation.isPending}
      />

      <ActivityDrawer
        isOpen={showActivityDrawer}
        onClose={() => setShowActivityDrawer(false)}
        activity={selectedActivity}
        planId={plan.id}
        companyId={plan.company_id}
        initialBudgetType={drawerBudgetFilter?.type}
        initialBudgetStatus={drawerBudgetFilter?.status}
        initialMetaType={drawerMetaType}
        termStartDate={plan.start_date}
        termEndDate={plan.end_date}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Plan"
        message="Are you sure you want to delete this plan? All associated activities and data will be permanently removed."
        itemName={`${plan.quarter} - ${plan.name}`}
        confirmText="Delete Plan"
        isLoading={deletePlanMutation.isPending}
      />
    </div>
  );
};


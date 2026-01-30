import React, { useState, useEffect, useRef } from 'react';
import { BarChart3, List } from 'lucide-react';
import { DeleteConfirmationModal } from '../../ui/DeleteConfirmationModal';
import { formatCurrency } from './utils/formatters';
import { TabButton } from './components/TabButton';
import { DrawerHeader } from './components/DrawerHeader';
import { DrawerResizeHandle } from './components/DrawerResizeHandle';
import { OverviewTab } from './components/OverviewTab';
import { BudgetListTab } from './components/BudgetListTab';
import { AcceptBudgetModal } from './components/AcceptBudgetModal';
import { AddActivityModal } from '../AddActivityModal';
import { useActivityDrawerData } from './hooks/useActivityDrawerData';
import { useActivityDrawerActions } from './hooks/useActivityDrawerActions';
import { useActivityDrawerModals } from './hooks/useActivityDrawerModals';
import { useDrawerResize } from './hooks/useDrawerResize';
import { useUpdateActivity } from '@/hooks/api/useActivities';
import { toast } from 'sonner';

export const ActivityDrawer = ({
  isOpen,
  onClose,
  activity,
  planId,
  companyId,
  initialBudgetType,
  initialBudgetStatus,
  initialMetaType,
  termStartDate,
  termEndDate,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [budgetFilterType, setBudgetFilterType] = useState(initialBudgetType || null);
  const [budgetFilterStatus, setBudgetFilterStatus] = useState(initialBudgetStatus || null);
  const [metaType, setMetaType] = useState(initialMetaType || null);
  const [showEditModal, setShowEditModal] = useState(false);
  const drawerRef = useRef(null);

  // Update activity mutation
  const updateActivityMutation = useUpdateActivity();

  // Custom hooks
  const { metaData, isLoadingMeta, isErrorMeta, budgetListData, isLoadingBudget, isErrorBudget } =
    useActivityDrawerData({
      isOpen,
      activity,
      planId,
      companyId,
      activeTab,
      budgetFilterType,
      budgetFilterStatus,
      metaType,
    });

  const { 
    updateBudgetStatusMutation, 
    deleteActivityMutation, 
    deleteBudgetMutation, 
    deleteMetaMutation 
  } = useActivityDrawerActions({ activity, planId, companyId, onClose });

  const {
    showAcceptModal,
    selectedBudget,
    handleAcceptBudget,
    handleConfirmAccept,
    handleCloseAcceptModal,
    showDeleteModal,
    handleDeleteActivity,
    handleConfirmDeleteActivity,
    handleCloseDeleteModal,
    showDeleteBudgetModal,
    budgetToDelete,
    handleDeleteBudget,
    handleConfirmDeleteBudget,
    handleCloseDeleteBudgetModal,
    showDeleteMetaModal,
    metaToDelete,
    handleDeleteMeta,
    handleConfirmDeleteMeta,
    handleCloseDeleteMetaModal,
  } = useActivityDrawerModals({
    isOpen,
    activity,
    updateBudgetStatusMutation,
    deleteActivityMutation,
    deleteBudgetMutation,
    deleteMetaMutation,
    onClose,
  });

  const { drawerWidth, isDragging, handleMouseDown } = useDrawerResize({ isOpen });

  const handleClearBudgetFilter = () => {
    setBudgetFilterType(null);
    setBudgetFilterStatus(null);
  };

  const handleClearMetaFilter = () => {
    setMetaType(null);
  };

  // Handle edit activity
  const handleEditActivity = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    if (!updateActivityMutation.isPending) {
      setShowEditModal(false);
    }
  };

  const handleSubmitEditActivity = async (payload) => {
    updateActivityMutation.mutate(payload, {
      onSuccess: (data) => {
        toast.success('Activity updated successfully');
        setShowEditModal(false);
        // Close the Activity Drawer as well
        onClose();
        // Invalidate queries to refresh data
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || 'Failed to update activity');
      },
    });
  };

  // Reset tab and filters when drawer closes or apply initial filter when opening
  useEffect(() => {
    if (!isOpen) {
      setActiveTab('overview');
      setBudgetFilterType(null);
      setBudgetFilterStatus(null);
      setMetaType(null);
    } else {
      if (initialBudgetType) {
        setActiveTab('budget');
        setBudgetFilterType(initialBudgetType);
        setBudgetFilterStatus(initialBudgetStatus || null);
      }
      if (initialMetaType) {
        setActiveTab('overview');
        setMetaType(initialMetaType);
      }
    }
  }, [isOpen, initialBudgetType, initialBudgetStatus, initialMetaType]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (showDeleteMetaModal) {
          handleCloseDeleteMetaModal();
        } else if (showDeleteBudgetModal) {
          handleCloseDeleteBudgetModal();
        } else if (showDeleteModal) {
          handleCloseDeleteModal();
        } else if (showAcceptModal) {
          handleCloseAcceptModal();
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, showAcceptModal, showDeleteModal, showDeleteBudgetModal, showDeleteMetaModal, handleCloseAcceptModal, handleCloseDeleteModal, handleCloseDeleteBudgetModal, handleCloseDeleteMetaModal]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-[9998] transition-opacity duration-300 ease-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        style={{ width: isOpen ? drawerWidth : 0 }}
        className={`fixed top-0 right-0 h-full bg-white dark:bg-gray-900 shadow-2xl z-[9999] transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } ${isDragging ? '' : 'transition-[width]'}`}
      >
        {/* Resize Handle */}
        <DrawerResizeHandle onMouseDown={handleMouseDown} isDragging={isDragging} />

        {/* Drawer Header */}
        <DrawerHeader 
          activityName={activity?.name} 
          onDelete={handleDeleteActivity} 
          onClose={onClose}
          onEdit={handleEditActivity}
        />

        {/* Tabs */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex gap-2">
            <TabButton
              active={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
              icon={BarChart3}
              label="Overview"
            />
            <TabButton
              active={activeTab === 'budget'}
              onClick={() => setActiveTab('budget')}
              icon={List}
              label="Budget List"
            />
          </div>
        </div>

        {/* Drawer Content */}
        <div className="p-6 overflow-y-auto h-[calc(100%-168px)]">
          {activeTab === 'overview' ? (
            <OverviewTab 
              data={metaData} 
              isLoading={isLoadingMeta} 
              isError={isErrorMeta}
              onAcceptBudget={handleAcceptBudget}
              onDeleteBudget={handleDeleteBudget}
              onDeleteMeta={handleDeleteMeta}
              activityId={activity?.id}
              planId={planId}
              companyId={companyId}
              filterType={budgetFilterType}
              filterStatus={budgetFilterStatus}
              onClearFilter={handleClearBudgetFilter}
              metaType={metaType}
              onClearMetaFilter={handleClearMetaFilter}
            />
          ) : (
            <BudgetListTab 
              data={budgetListData} 
              isLoading={isLoadingBudget} 
              isError={isErrorBudget}
              activityId={activity?.id}
              planId={planId}
              companyId={companyId}
              onAcceptBudget={handleAcceptBudget}
              onDeleteBudget={handleDeleteBudget}
              filterType={budgetFilterType}
              filterStatus={budgetFilterStatus}
              onClearFilter={handleClearBudgetFilter}
              termStartDate={termStartDate}
              termEndDate={termEndDate}
            />
          )}
        </div>
      </div>

      {/* Accept Budget Confirmation Modal */}
      <AcceptBudgetModal
        isOpen={showAcceptModal}
        onClose={handleCloseAcceptModal}
        onConfirm={handleConfirmAccept}
        budget={selectedBudget}
        isLoading={updateBudgetStatusMutation.isPending}
      />

      {/* Delete Activity Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteActivity}
        title="Delete Activity"
        message="Are you sure you want to delete this activity? All associated data, budgets, and comments will be permanently removed."
        itemName={activity?.name}
        confirmText="Delete Activity"
        isLoading={deleteActivityMutation.isPending}
      />

      {/* Delete Budget Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteBudgetModal}
        onClose={handleCloseDeleteBudgetModal}
        onConfirm={handleConfirmDeleteBudget}
        title="Delete Budget Allocation"
        message="Are you sure you want to delete this budget allocation? This action cannot be undone."
        itemName={budgetToDelete ? `${budgetToDelete.type} - ${formatCurrency(budgetToDelete.value)}` : ''}
        confirmText="Delete Budget"
        isLoading={deleteBudgetMutation.isPending}
      />

      {/* Delete Meta Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteMetaModal}
        onClose={handleCloseDeleteMetaModal}
        onConfirm={handleConfirmDeleteMeta}
        title={metaToDelete?.type === 'evidence' ? 'Delete Evidence' : 'Delete Comment'}
        message={metaToDelete?.type === 'evidence' 
          ? 'Are you sure you want to delete this evidence? This action cannot be undone.'
          : 'Are you sure you want to delete this comment? This action cannot be undone.'}
        itemName={metaToDelete?.description ? (metaToDelete.description.length > 50 ? `${metaToDelete.description.substring(0, 50)}...` : metaToDelete.description) : ''}
        confirmText={metaToDelete?.type === 'evidence' ? 'Delete Evidence' : 'Delete Comment'}
        isLoading={deleteMetaMutation.isPending}
      />

      {/* Edit Activity Modal */}
      <AddActivityModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        onSubmit={handleSubmitEditActivity}
        isSubmitting={updateActivityMutation.isPending}
        mode="edit"
        initialActivity={activity ? {
          id: activity.id,
          name: activity.name,
          starts_at: activity.starts_at || activity.duration?.start,
          ends_at: activity.ends_at || activity.duration?.end,
        } : null}
        planStartDate={null}
        planEndDate={null}
      />
    </>
  );
};

import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useCreateActivity, useUpdateActivityStatus } from '@/hooks/api/useActivities';
import { useDeletePlan } from '@/hooks/api/usePlans';

export const useDealerPlanTable = ({ plan, autoOpenActivityId, onPlanDeleted }) => {
  // Get user from Redux store
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.is_admin === '1' || user?.is_admin === 1;

  // State management
  const [isExpanded, setIsExpanded] = useState(plan.activities && plan.activities.length > 0);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [openStatusMenu, setOpenStatusMenu] = useState(null);
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);
  const [statusUpdateData, setStatusUpdateData] = useState(null);
  const [showActivityDrawer, setShowActivityDrawer] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [drawerBudgetFilter, setDrawerBudgetFilter] = useState(null);
  const [drawerMetaType, setDrawerMetaType] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPlanMenu, setShowPlanMenu] = useState(false);
  const [statusMenuPosition, setStatusMenuPosition] = useState({ top: 0, left: 0 });
  const statusButtonRefs = useRef({});
  const [customStatusInputs, setCustomStatusInputs] = useState({});
  const [autoOpened, setAutoOpened] = useState(false);

  // Mutations
  const createActivityMutation = useCreateActivity();
  const updateStatusMutation = useUpdateActivityStatus();
  const deletePlanMutation = useDeletePlan();

  // Handlers
  const handleOpenDrawer = (activity, budgetType = null, budgetStatus = null, metaType = null) => {
    setSelectedActivity(activity);
    if (budgetType) {
      setDrawerBudgetFilter({ type: budgetType, status: budgetStatus || null });
      setDrawerMetaType(null);
    } else if (metaType) {
      setDrawerMetaType(metaType);
      setDrawerBudgetFilter(null);
    } else {
      setDrawerBudgetFilter(null);
      setDrawerMetaType(null);
    }
    setShowActivityDrawer(true);
  };

  const handleSelectAll = () => {
    if (selectedActivities.length === plan.activities.length) {
      setSelectedActivities([]);
    } else {
      setSelectedActivities(plan.activities.map(a => a.id));
    }
  };

  const handleSelectActivity = (activityId) => {
    setSelectedActivities(prev => 
      prev.includes(activityId) 
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const handleAddActivity = (payload) => {
    const data = {
      plan_id: plan.id,
      ...payload,
    };

    createActivityMutation.mutate(data, {
      onSuccess: () => {
        setShowAddActivityModal(false);
      },
    });
  };

  const handleStatusClick = (activity, newStatus) => {
    if (isAdmin) return;
    
    setOpenStatusMenu(null);
    
    if (activity.status?.toLowerCase() !== newStatus.toLowerCase()) {
      setStatusUpdateData({
        activityId: activity.id,
        activityName: activity.name,
        currentStatus: activity.status,
        newStatus: newStatus,
      });
      setShowStatusUpdateModal(true);
    }
  };

  const handleCustomStatusSubmit = (activity, customStatus) => {
    if (!customStatus || !customStatus.trim() || isAdmin) {
      return;
    }

    setOpenStatusMenu(null);
    setCustomStatusInputs(prev => ({ ...prev, [activity.id]: '' }));
    
    setStatusUpdateData({
      activityId: activity.id,
      activityName: activity.name,
      currentStatus: activity.status,
      newStatus: customStatus.trim(),
    });
    setShowStatusUpdateModal(true);
  };

  const handleCustomStatusInputChange = (activityId, value) => {
    setCustomStatusInputs(prev => ({ ...prev, [activityId]: value }));
  };

  const handleConfirmStatusUpdate = () => {
    if (!statusUpdateData || isAdmin) return;

    updateStatusMutation.mutate(
      {
        activity_id: statusUpdateData.activityId,
        status: statusUpdateData.newStatus,
      },
      {
        onSuccess: () => {
          setShowStatusUpdateModal(false);
          setStatusUpdateData(null);
        },
      }
    );
  };

  const handleCloseStatusModal = () => {
    if (!updateStatusMutation.isPending) {
      setShowStatusUpdateModal(false);
      setStatusUpdateData(null);
    }
  };

  const handleDeletePlan = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    deletePlanMutation.mutate(plan.id, {
      onSuccess: () => {
        setShowDeleteModal(false);
        onPlanDeleted?.();
      },
    });
  };

  const handleCloseDeleteModal = () => {
    if (!deletePlanMutation.isPending) {
      setShowDeleteModal(false);
    }
  };

  const handleStatusMenuToggle = (activityId, position) => {
    setStatusMenuPosition(position);
    setOpenStatusMenu(openStatusMenu === activityId ? null : activityId);
  };

  // Auto-open drawer for activity_id from URL
  useEffect(() => {
    if (!autoOpenActivityId) return;
    setAutoOpened(false);
  }, [autoOpenActivityId]);

  useEffect(() => {
    if (!autoOpenActivityId || autoOpened) return;
    if (plan.activities && !showActivityDrawer) {
      const activity = plan.activities.find(a => parseInt(a.id) === parseInt(autoOpenActivityId));
      if (activity) {
        handleOpenDrawer(activity);
        setIsExpanded(true);
        setAutoOpened(true);
      }
    }
  }, [autoOpenActivityId, plan.activities, showActivityDrawer, autoOpened]);

  // Close dropdown on scroll, resize, or click outside
  useEffect(() => {
    if (openStatusMenu) {
      const handleScroll = () => setOpenStatusMenu(null);
      const handleResize = () => setOpenStatusMenu(null);
      const handleClickOutside = (e) => {
        const dropdown = e.target.closest('.status-dropdown-menu');
        if (dropdown) return;
        
        const button = statusButtonRefs.current[openStatusMenu] || statusButtonRefs.current[`mobile-${openStatusMenu}`];
        if (button && button.contains(e.target)) return;
        
        setOpenStatusMenu(null);
      };
      
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside, true);
      }, 10);
      
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('mousedown', handleClickOutside, true);
      };
    }
  }, [openStatusMenu]);

  const isAllSelected = selectedActivities.length === plan.activities.length && plan.activities.length > 0;

  return {
    // State
    isExpanded,
    setIsExpanded,
    selectedActivities,
    showAddActivityModal,
    setShowAddActivityModal,
    openStatusMenu,
    setOpenStatusMenu,
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
    setStatusMenuPosition,
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
    
    // Mutations
    createActivityMutation,
    updateStatusMutation,
    deletePlanMutation,
    
    // Additional handlers
    handleStatusMenuToggle,
  };
};


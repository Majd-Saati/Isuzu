import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight, MessageCircle, Plus, Building2, Calendar, Edit2, CheckCircle2, Clock3, Ban, Trash2, MoreVertical, FileText, PlusCircle, Check } from 'lucide-react';
import { useSelector } from 'react-redux';
import logo from '../../asstes/images/logo.png';
import { Checkbox } from '../ui/Checkbox';
import { AddActivityModal } from './AddActivityModal';
import { StatusUpdateModal } from './StatusUpdateModal';
import { ActivityDrawer } from './ActivityDrawer';
import { DeleteConfirmationModal } from '../ui/DeleteConfirmationModal';
import { useCreateActivity, useUpdateActivityStatus } from '@/hooks/api/useActivities';
import { useDeletePlan } from '@/hooks/api/usePlans';

// Format date to readable format
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch {
    return 'N/A';
  }
};

// Map budget status (accepted/pending/other) to color classes used in the table
const getAmountColorByStatus = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'accepted') return 'text-emerald-600';
  if (s === 'pending') return 'text-amber-600';
  return 'text-gray-900';
};

export const DealerPlanTable = ({ plan, onEdit, companies = [], terms = [], onPlanDeleted, showBudgetColumns = false, showMediaUploadColumns = false }) => {
  // Plans with no activities should be closed by default
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

  // Get user from Redux store
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.is_admin === '1' || user?.is_admin === 1;

  // Close dropdown on scroll, resize, or click outside
  useEffect(() => {
    if (openStatusMenu) {
      const handleScroll = () => {
        setOpenStatusMenu(null);
      };
      const handleResize = () => {
        setOpenStatusMenu(null);
      };
      const handleClickOutside = (e) => {
        // Check if click is on the dropdown menu itself
        const dropdown = e.target.closest('.status-dropdown-menu');
        if (dropdown) {
          // Click is on dropdown, don't close
          return;
        }
        
        // Check if click is on the button
        const button = statusButtonRefs.current[openStatusMenu] || statusButtonRefs.current[`mobile-${openStatusMenu}`];
        if (button && button.contains(e.target)) {
          // Click is on button, don't close (button handles its own toggle)
          return;
        }
        
        // Click is outside both button and dropdown, close the menu
        setOpenStatusMenu(null);
      };
      
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
      // Use a small delay to allow button onClick to process first
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

  const createActivityMutation = useCreateActivity();
  const updateStatusMutation = useUpdateActivityStatus();
  const deletePlanMutation = useDeletePlan();

  const statusStyles = {
    done: {
      bg: 'bg-green-100 border-green-200 text-green-700',
      dot: 'bg-green-500',
      text: 'text-green-700',
      icon: <CheckCircle2 className="w-4 h-4" />
    },
    pending: {
      bg: 'bg-red-100 border-red-200 text-red-700',
      dot: 'bg-red-500',
      text: 'text-red-700',
      icon: <Ban className="w-4 h-4" />
    },
    'working on it': {
      bg: 'bg-amber-100 border-amber-200 text-amber-700',
      dot: 'bg-amber-500',
      text: 'text-amber-700',
      icon: <Clock3 className="w-4 h-4" />
    },
  };

  const statusOptions = [
    { value: 'done', label: 'Done' },
    { value: 'pending', label: 'Pending' },
    { value: 'working on it', label: 'Working on it' },
  ];

  const renderStatusBadge = (status) => {
    const key = (status || '').toLowerCase();
    const style = statusStyles[key] || statusStyles['working on it'];
    const label = statusOptions.find(o => o.value === key)?.label || status;
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap ${style.bg}`}>
        {style.icon}
        <span>{label || 'Status'}</span>
        <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />
      </div>
    );
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

  const isAllSelected = selectedActivities.length === plan.activities.length && plan.activities.length > 0;

  const handleStatusClick = (activity, newStatus) => {
    // Prevent admin users from editing activity status
    if (isAdmin) {
      return;
    }
    
    // Close the dropdown menu
    setOpenStatusMenu(null);
    
    // Only show modal if status is different
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

    // Close the dropdown menu
    setOpenStatusMenu(null);
    
    // Clear the input
    setCustomStatusInputs(prev => ({ ...prev, [activity.id]: '' }));
    
    // Show modal with custom status
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
    if (!statusUpdateData) return;
    
    // Prevent admin users from updating activity status
    if (isAdmin) {
      return;
    }

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
        onError: () => {
          // Keep modal open on error so user can retry or cancel
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

  // Render status badge for mobile
  const renderMobileStatusBadge = (activity) => {
    const key = (activity.status || '').toLowerCase();
    const style = statusStyles[key] || statusStyles['working on it'];
    return (
      <div className="relative">
        <button
          ref={(el) => (statusButtonRefs.current[`mobile-${activity.id}`] = el)}
          type="button"
          disabled={isAdmin}
          onClick={(e) => {
            if (isAdmin) return;
            e.stopPropagation();
            const button = e.currentTarget;
            const rect = button.getBoundingClientRect();
            // For fixed positioning, use viewport coordinates directly
            // Calculate dropdown position, ensuring it doesn't go off-screen
            const dropdownHeight = 180; // Approximate height of dropdown (includes input field)
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            
            // Position below button if there's enough space, otherwise above
            let top = rect.bottom + 8;
            if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
              top = rect.top - dropdownHeight - 8;
            }
            
            // Ensure dropdown doesn't go off left/right edges
            let left = rect.left;
            const dropdownWidth = 220; // min-w-[220px]
            if (left + dropdownWidth > window.innerWidth) {
              left = window.innerWidth - dropdownWidth - 8;
            }
            if (left < 8) {
              left = 8;
            }
            
            setStatusMenuPosition({ top, left });
            setOpenStatusMenu(openStatusMenu === activity.id ? null : activity.id);
          }}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-sm transition-all ${
            isAdmin 
              ? 'opacity-60 cursor-not-allowed' 
              : 'hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer'
          }`}
        >
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${style.dot}`} />
          <span className={`text-xs font-semibold whitespace-nowrap ${style.text} dark:text-gray-200`}>
            {statusOptions.find(o => o.value === key)?.label || activity.status || 'Status'}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 text-gray-400 dark:text-gray-500 transition-transform flex-shrink-0 ${openStatusMenu === activity.id ? 'rotate-180' : ''}`} />
        </button>
        {openStatusMenu === activity.id && (
          <div 
            className="status-dropdown-menu fixed bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl z-[10000] min-w-[220px] overflow-hidden"
            style={{
              top: `${statusMenuPosition.top}px`,
              left: `${statusMenuPosition.left}px`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Custom Status Input */}
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={customStatusInputs[activity.id] || ''}
                  onChange={(e) => handleCustomStatusInputChange(activity.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleCustomStatusSubmit(activity, customStatusInputs[activity.id]);
                    }
                  }}
                  placeholder="Enter custom status"
                  disabled={isAdmin}
                  className="flex-1 px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E60012]/50 focus:border-[#E60012] disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => handleCustomStatusSubmit(activity, customStatusInputs[activity.id])}
                  disabled={isAdmin || !customStatusInputs[activity.id]?.trim()}
                  className="p-1.5 rounded-lg bg-[#E60012] text-white hover:bg-[#C00010] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#E60012]"
                  title="Submit custom status"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            
            {/* Status Options */}
            {statusOptions.map((opt) => {
              const optStyle = statusStyles[opt.value];
              const isCurrentStatus = activity.status?.toLowerCase() === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleStatusClick(activity, opt.value)}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-2.5 ${
                    isCurrentStatus ? 'bg-gray-50 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${optStyle.dot}`} />
                  <span className={`font-medium whitespace-nowrap ${optStyle.text} dark:text-gray-200`}>{opt.label}</span>
                  {isCurrentStatus && <span className="ml-auto text-[10px] text-gray-400 dark:text-gray-500">✓</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-visible shadow-sm border-2 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 relative">
      {/* Plan Header */}
      <div className="w-full px-4 sm:px-6 py-4 sm:py-5 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-all duration-200 border-b-2 border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3 relative">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-start gap-3 flex-1 pr-10 sm:pr-0"
          >
            <div className="transition-transform duration-300 hover:scale-110 mt-0.5">
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-[#E60012]" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              )}
            </div>
            <div className="flex-1 text-left">
              {/* Plan Title and Badge */}
              <div className="text-sm font-semibold text-[#E60012] flex items-center gap-2 flex-wrap">
                <span className="break-words">{plan.quarter} - {plan.name}</span>
                <span className="text-xs font-normal text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                  {plan.activities.length} activities
                </span>
              </div>
              
              {/* Plan Description */}
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                {plan.description}
              </div>
              
              {/* Additional Info: Company, Term Dates */}
              <div className="flex items-center gap-3 sm:gap-4 mt-2 flex-wrap">
                {/* Company Name */}
                {plan.company_name && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                    <Building2 className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                    <span className="font-medium">{plan.company_name}</span>
                  </div>
                )}
                
                {/* Term Dates */}
                {plan.start_date && plan.end_date && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                    <span className="hidden sm:inline">{formatDate(plan.start_date)} - {formatDate(plan.end_date)}</span>
                    <span className="sm:hidden">{formatDate(plan.start_date)}</span>
                  </div>
                )}
              </div>
            </div>
          </button>
          
          {/* Action Menu */}
          <div className="absolute top-0 right-0 sm:relative sm:top-auto sm:right-auto sm:ml-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPlanMenu(!showPlanMenu);
              }}
              className="flex items-center justify-center p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 border-2 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
              title="Plan options"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            {showPlanMenu && (
              <div 
                className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl z-[1000000] w-[200px] sm:w-auto sm:min-w-[180px] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Add Activity */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAddActivityModal(true);
                    setShowPlanMenu(false);
                  }}
                  className="w-full px-4 py-3 sm:py-3 text-left text-sm sm:text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-3 first:rounded-t-xl active:bg-gray-100 dark:active:bg-gray-700 sm:active:bg-gray-50"
                >
                  <Plus className="w-4 h-4 text-[#E60012] flex-shrink-0" />
                  <span className="whitespace-nowrap">Add Activity</span>
                </button>

                {/* Edit Plan */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(plan);
                    setShowPlanMenu(false);
                  }}
                  className="w-full px-4 py-3 sm:py-3 text-left text-sm sm:text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-3 active:bg-gray-100 dark:active:bg-gray-700 sm:active:bg-gray-50"
                >
                  <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                  <span className="whitespace-nowrap">Edit Plan</span>
                </button>

                {/* Delete Plan */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePlan();
                    setShowPlanMenu(false);
                  }}
                  className="w-full px-4 py-3 sm:py-3 text-left text-sm sm:text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3 last:rounded-b-xl active:bg-red-100 dark:active:bg-red-900/30 sm:active:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">Delete Plan</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Plan Content */}
      {isExpanded && (
        <div className="animate-accordion-down">
          {/* Desktop Table - Only visible on xl screens - Single scrollable container */}
          <div className="hidden xl:block overflow-x-auto custom-scrollbar border-b-2 border-gray-200 dark:border-gray-700">
            <table className="w-full table-fixed min-w-max">
              <thead className="bg-gray-50/70 dark:bg-gray-800/70 sticky top-0 z-10">
                <tr>
                  <th className="w-12 py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700">
                    <Checkbox 
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-left text-sm font-medium text-gray-500 dark:text-gray-400 py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700 w-[250px]">
                    Activities
                  </th>
                  <th className="text-left text-sm font-medium text-gray-500 dark:text-gray-400 py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700 w-24">
                    Assign
                  </th>
                  <th className="text-left text-sm font-medium text-gray-500 dark:text-gray-400 py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700 w-40">
                    Duration
                  </th>
                  <th className="text-left text-sm font-medium text-gray-500 dark:text-gray-400 py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700 w-36">
                    Team Member
                  </th>
                  <th className="text-left text-sm font-medium text-gray-500 dark:text-gray-400 py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700 w-44">
                    Status
                  </th>
                  {showBudgetColumns && (
                    <>
                      <th className="text-left text-sm font-medium text-gray-500 dark:text-gray-400 py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700 w-32">
                        Estimated
                      </th>
                      <th className="text-left text-sm font-medium text-gray-500 dark:text-gray-400 py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700 w-32">
                        Actual
                      </th>
                      <th className="text-left text-sm font-medium text-gray-500 dark:text-gray-400 py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700 w-32">
                        Support
                      </th>
                      <th className="text-left text-sm font-medium text-gray-500 dark:text-gray-400 py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700 w-32">
                        Invoice
                      </th>
                    </>
                  )}
                  {showMediaUploadColumns && (
                    <>
                      <th className="text-left text-sm font-medium text-gray-500 dark:text-gray-400 py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700 w-28">
                        Evidence Media
                      </th>
                      <th className="text-left text-sm font-medium text-gray-500 dark:text-gray-400 py-4 px-6 w-28">
                        Invoice Upload
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {plan.activities.length > 0 && plan.activities.map((activity) => (
                <tr key={activity.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group relative">
                  <td className="py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700 w-12">
                    <Checkbox 
                      checked={selectedActivities.includes(activity.id)}
                      onChange={() => handleSelectActivity(activity.id)}
                    />
                  </td>
                  <td className="py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700 w-[250px]">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-900 dark:text-gray-100 font-medium group-hover:text-[#E60012] transition-colors">
                        {activity.name}
                      </span>
                      <button
                        onClick={() => handleOpenDrawer(activity)}
                        className="relative flex-shrink-0 p-1 rounded-lg hover:bg-[#E60012]/10 transition-all duration-200"
                        title="View Details"
                      >
                        <MessageCircle className="w-4 h-4 text-gray-400 dark:text-gray-500 hover:text-[#E60012] transition-colors" />
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700 w-24">
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-md ring-1 ring-gray-200 dark:ring-gray-700 hover:scale-110 transition-transform cursor-pointer">
                      <img 
                        src={logo} 
                        alt="Assign" 
                        className="w-6 h-6 object-contain" 
                      />
                    </div>
                  </td>
                  <td className="py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700 w-40">
                    <div className="text-xs text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                      <div>Start : {activity.duration.start}</div>
                      <div>End : {activity.duration.end}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700 w-36">
                    <div className="flex items-center gap-2">
                      <img 
                        src={activity.teamMember.avatar} 
                        alt="Team member" 
                        className="w-8 h-8 rounded-full ring-2 ring-gray-200 dark:ring-gray-700 hover:ring-[#E60012] transition-all hover:scale-110 cursor-pointer"
                      />
                      {activity.created_by_name && (
                        <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                          {activity.created_by_name}
                        </span>
                      )}
                      {activity.teamMember.badge && (
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                          {activity.teamMember.badge}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700 w-44 relative">
                    <div className="relative">
                      <button
                        ref={(el) => (statusButtonRefs.current[activity.id] = el)}
                        type="button"
                        disabled={isAdmin}
                        onClick={(e) => {
                          if (isAdmin) return;
                          e.stopPropagation();
                          const button = e.currentTarget;
                          const rect = button.getBoundingClientRect();
                          // For fixed positioning, use viewport coordinates directly
                          // Calculate dropdown position, ensuring it doesn't go off-screen
                          const dropdownHeight = 120; // Approximate height of dropdown
                          const spaceBelow = window.innerHeight - rect.bottom;
                          const spaceAbove = rect.top;
                          
                          // Position below button if there's enough space, otherwise above
                          let top = rect.bottom + 8;
                          if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
                            top = rect.top - dropdownHeight - 8;
                          }
                          
                          // Ensure dropdown doesn't go off left/right edges
                          let left = rect.left;
                          const dropdownWidth = 220; // min-w-[220px]
                          if (left + dropdownWidth > window.innerWidth) {
                            left = window.innerWidth - dropdownWidth - 8;
                          }
                          if (left < 8) {
                            left = 8;
                          }
                          
                          setStatusMenuPosition({ top, left });
                          setOpenStatusMenu(openStatusMenu === activity.id ? null : activity.id);
                        }}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 text-sm focus:outline-none transition-all ${
                          isAdmin
                            ? 'opacity-60 cursor-not-allowed'
                            : 'hover:border-gray-400 dark:hover:border-gray-600 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 focus:border-gray-400 dark:focus:border-gray-600 cursor-pointer'
                        }`}
                      >
                        {(() => {
                          const key = (activity.status || '').toLowerCase();
                          const style = statusStyles[key] || statusStyles['working on it'];
                          return (
                            <>
                              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${style.dot}`} />
                              <span className={`text-xs font-semibold whitespace-nowrap ${style.text}`}>
                                {statusOptions.find(o => o.value === key)?.label || activity.status || 'Status'}
                              </span>
                            </>
                          );
                        })()}
                        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 dark:text-gray-500 transition-transform flex-shrink-0 ${openStatusMenu === activity.id ? 'rotate-180' : ''}`} />
                      </button>
                      {openStatusMenu === activity.id && (
                        <div 
                          className="status-dropdown-menu fixed bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl z-[10000] min-w-[220px] overflow-hidden"
                          style={{
                            top: `${statusMenuPosition.top}px`,
                            left: `${statusMenuPosition.left}px`
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Custom Status Input */}
                          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={customStatusInputs[activity.id] || ''}
                                onChange={(e) => handleCustomStatusInputChange(activity.id, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleCustomStatusSubmit(activity, customStatusInputs[activity.id]);
                                  }
                                }}
                                placeholder="Enter custom status"
                                disabled={isAdmin}
                                className="flex-1 px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E60012]/50 focus:border-[#E60012] disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                              <button
                                type="button"
                                onClick={() => handleCustomStatusSubmit(activity, customStatusInputs[activity.id])}
                                disabled={isAdmin || !customStatusInputs[activity.id]?.trim()}
                                className="p-1.5 rounded-lg bg-[#E60012] text-white hover:bg-[#C00010] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#E60012]"
                                title="Submit custom status"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          
                          {/* Status Options */}
                          {statusOptions.map((opt) => {
                            const optStyle = statusStyles[opt.value];
                            const isCurrentStatus = activity.status?.toLowerCase() === opt.value;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => handleStatusClick(activity, opt.value)}
                                className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-2.5 ${
                                  isCurrentStatus 
                                    ? 'bg-gray-50 dark:bg-gray-800' 
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                              >
                                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${optStyle.dot}`} />
                                <span className={`font-medium whitespace-nowrap ${optStyle.text} dark:text-gray-200`}>{opt.label}</span>
                                {isCurrentStatus && (
                                  <span className="ml-auto text-[10px] text-gray-400 dark:text-gray-500">✓</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </td>
                  {showBudgetColumns && (
                    <>
                      <td className="py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700 w-32">
                        <button
                          type="button"
                          onClick={() => handleOpenDrawer(activity, 'estimated cost', activity.estimatedStatus)}
                          className={`text-sm font-medium ${getAmountColorByStatus(
                            activity.estimatedStatus
                          )} hover:underline`}
                        >
                          ${activity.estimatedCost.toLocaleString()}
                        </button>
                      </td>
                      <td className="py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700 w-32">
                        <button
                          type="button"
                          onClick={() => handleOpenDrawer(activity, 'actual cost', activity.actualStatus)}
                          className={`text-sm font-medium ${getAmountColorByStatus(
                            activity.actualStatus
                          )} hover:underline`}
                        >
                          ${activity.actualCost.toLocaleString()}
                        </button>
                      </td>
                      <td className="py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700 w-32">
                        <button
                          type="button"
                          onClick={() => handleOpenDrawer(activity, 'support cost', activity.supportStatus)}
                          className={`text-sm font-medium ${getAmountColorByStatus(
                            activity.supportStatus
                          )} hover:underline`}
                        >
                          ${activity.supportCost.toLocaleString()}
                        </button>
                      </td>
                      <td className="py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700 w-32">
                        <button
                          type="button"
                          onClick={() => handleOpenDrawer(activity, 'invoice', activity.invoiceStatus)}
                          className={`text-sm font-medium ${getAmountColorByStatus(
                            activity.invoiceStatus
                          )} hover:underline`}
                        >
                          ${activity.invoiceCost.toLocaleString()}
                        </button>
                      </td>
                    </>
                  )}
                  {showMediaUploadColumns && (
                    <>
                      <td className="py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700 w-28 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenDrawer(activity, null, null, 'evidence')}
                          className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-600 dark:text-gray-400 hover:text-[#E60012]"
                          title="Evidence Media"
                        >
                          <FileText className="w-5 h-5" />
                        </button>
                      </td>
                      <td className="py-4 px-6 w-28 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenDrawer(activity, 'invoice', null)}
                          className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-600 dark:text-gray-400 hover:text-[#E60012]"
                          title="Invoice Upload"
                        >
                          <PlusCircle className="w-5 h-5" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
                ))}
              </tbody>
            </table>
            {plan.activities.length === 0 && (
              <div className="py-8 px-4 sm:px-6 bg-gray-50/30 dark:bg-gray-800/30 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  There are no activities for this plan yet. Click "Add Activity" to create your first activity.
                </p>
              </div>
            )}
          </div>

          {/* Card Layout - Mobile and Large screens */}
          <div className="xl:hidden divide-y divide-gray-200 dark:divide-gray-700">
            {plan.activities.map((activity) => (
              <div key={activity.id} className="p-4 lg:p-5 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                    {/* Activity Header */}
                    <div className="flex items-start justify-between gap-3 mb-3 lg:mb-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Checkbox 
                          checked={selectedActivities.includes(activity.id)}
                          onChange={() => handleSelectActivity(activity.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm lg:text-base text-gray-900 dark:text-gray-100 font-medium truncate">
                              {activity.name}
                            </span>
                            <button
                              onClick={() => handleOpenDrawer(activity)}
                              className="flex-shrink-0 p-1 rounded-lg hover:bg-[#E60012]/10 transition-all"
                            >
                              <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 dark:text-gray-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                      {renderMobileStatusBadge(activity)}
                    </div>

                    {/* Activity Details Grid */}
                    <div
                      className={`ml-8 lg:ml-10 grid gap-3 lg:gap-4 text-xs lg:text-sm ${
                        showBudgetColumns ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2'
                      }`}
                    >
                      {/* Duration */}
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 font-medium">Duration</span>
                        <div className="text-gray-700 dark:text-gray-300 mt-1 lg:mt-1.5">
                          <div className="text-xs lg:text-sm">{activity.duration.start}</div>
                          <div className="text-xs lg:text-sm">{activity.duration.end}</div>
                        </div>
                      </div>

                      {/* Team Member */}
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 font-medium">Team Member</span>
                        <div className="flex items-center gap-2 mt-1 lg:mt-1.5">
                          <img 
                            src={activity.teamMember.avatar} 
                            alt="Team member" 
                            className="w-6 h-6 lg:w-8 lg:h-8 rounded-full ring-1 ring-gray-200 dark:ring-gray-700"
                          />
                          {activity.created_by_name && (
                            <span className="text-xs lg:text-sm text-gray-700 dark:text-gray-300 font-medium">
                              {activity.created_by_name}
                            </span>
                          )}
                          {activity.teamMember.badge && (
                            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full hidden lg:inline">
                              {activity.teamMember.badge}
                            </span>
                          )}
                        </div>
                      </div>

                      {showBudgetColumns && (
                        <>
                          {/* Estimated Cost */}
                          <div>
                            <span className="text-gray-500 dark:text-gray-400 font-medium">Estimated</span>
                            <button
                              type="button"
                              onClick={() => handleOpenDrawer(activity, 'estimated cost', activity.estimatedStatus)}
                              className={`${getAmountColorByStatus(
                                activity.estimatedStatus
                              )} font-semibold mt-1 lg:mt-1.5 text-sm lg:text-base hover:underline`}
                            >
                              ${activity.estimatedCost.toLocaleString()}
                            </button>
                          </div>

                          {/* Actual Cost */}
                          <div>
                            <span className="text-gray-500 dark:text-gray-400 font-medium">Actual</span>
                            <button
                              type="button"
                              onClick={() => handleOpenDrawer(activity, 'actual cost', activity.actualStatus)}
                              className={`${getAmountColorByStatus(
                                activity.actualStatus
                              )} font-semibold mt-1 lg:mt-1.5 text-sm lg:text-base hover:underline`}
                            >
                              ${activity.actualCost.toLocaleString()}
                            </button>
                          </div>

                          {/* Support Cost */}
                          <div>
                            <span className="text-gray-500 dark:text-gray-400 font-medium">Support</span>
                            <button
                              type="button"
                              onClick={() => handleOpenDrawer(activity, 'support cost', activity.supportStatus)}
                              className={`${getAmountColorByStatus(
                                activity.supportStatus
                              )} font-semibold mt-1 lg:mt-1.5 text-sm lg:text-base hover:underline`}
                            >
                              ${activity.supportCost.toLocaleString()}
                            </button>
                          </div>

                          {/* Invoice */}
                          <div>
                            <span className="text-gray-500 dark:text-gray-400 font-medium">Invoice</span>
                            <button
                              type="button"
                              onClick={() => handleOpenDrawer(activity, 'invoice', activity.invoiceStatus)}
                              className={`${getAmountColorByStatus(
                                activity.invoiceStatus
                              )} font-semibold mt-1 lg:mt-1.5 text-sm lg:text-base hover:underline`}
                            >
                              ${activity.invoiceCost.toLocaleString()}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

          {/* Total Activities Footer */}
          {plan.activities.length > 0 && (
            <div className="border-t-2 border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 bg-gray-50/70 dark:bg-gray-800/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                {plan.activities.length} Activities
                {selectedActivities.length > 0 && (
                  <span className="ml-2 text-[#E60012] font-medium">
                    ({selectedActivities.length} selected)
                  </span>
                )}
              </span>
              {showBudgetColumns && (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-600 dark:text-gray-400">Estimated:</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      ${plan.activities.reduce((sum, a) => sum + a.estimatedCost, 0).toLocaleString()}
                    </span>
                  </div>
                  <span className="hidden sm:inline text-gray-400 dark:text-gray-600">|</span>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-600 dark:text-gray-400">Actual:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      ${plan.activities.reduce((sum, a) => sum + a.actualCost, 0).toLocaleString()}
                    </span>
                  </div>
                  <span className="hidden sm:inline text-gray-400 dark:text-gray-600">|</span>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-600 dark:text-gray-400">Support:</span>
                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                      ${plan.activities.reduce((sum, a) => sum + a.supportCost, 0).toLocaleString()}
                    </span>
                  </div>
                  <span className="hidden sm:inline text-gray-400 dark:text-gray-600">|</span>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-600 dark:text-gray-400">Invoice:</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      ${plan.activities.reduce((sum, a) => sum + a.invoiceCost, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

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

      {/* Delete Plan Confirmation Modal */}
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

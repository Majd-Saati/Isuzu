import React from 'react';
import { MessageCircle, ChevronDown } from 'lucide-react';
import { Checkbox } from '../../../ui/Checkbox';
import { getAmountColorByStatus } from '../utils';
import { statusStyles, statusOptions } from '../constants';
import { StatusDropdown } from './StatusDropdown';

export const ActivityCard = ({
  activity,
  isSelected,
  onSelect,
  onOpenDrawer,
  showBudgetColumns,
  isAdmin,
  openStatusMenu,
  statusMenuPosition,
  statusButtonRef,
  customStatusInput,
  onCustomStatusInputChange,
  onCustomStatusSubmit,
  onStatusClick,
  onStatusMenuToggle,
}) => {
  const key = (activity.status || '').toLowerCase();
  const style = statusStyles[key] || statusStyles['working on it'];

  const calculateDropdownPosition = (button) => {
    const rect = button.getBoundingClientRect();
    const dropdownHeight = 180;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    
    let top = rect.bottom + 8;
    if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
      top = rect.top - dropdownHeight - 8;
    }
    
    let left = rect.left;
    const dropdownWidth = 220;
    if (left + dropdownWidth > window.innerWidth) {
      left = window.innerWidth - dropdownWidth - 8;
    }
    if (left < 8) {
      left = 8;
    }
    
    return { top, left };
  };

  const handleStatusButtonClick = (e) => {
    if (isAdmin) return;
    e.stopPropagation();
    const button = e.currentTarget;
    const position = calculateDropdownPosition(button);
    onStatusMenuToggle(activity.id, position);
  };

  return (
    <div className="p-4 lg:p-5 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
      {/* Activity Header */}
      <div className="flex items-start justify-between gap-3 mb-3 lg:mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Checkbox 
            checked={isSelected}
            onChange={onSelect}
            className="[&>div]:w-4 [&>div]:h-4 [&>div]:border [&>div]:border-gray-300"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm lg:text-base text-gray-900 dark:text-gray-100 font-medium truncate">
                {activity.name}
              </span>
              <button
                onClick={() => onOpenDrawer(activity)}
                className="flex-shrink-0 p-1 rounded-lg hover:bg-[#E60012]/10 transition-all"
              >
                <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 dark:text-gray-500" />
              </button>
            </div>
          </div>
        </div>
        <div className="relative">
          <button
            ref={statusButtonRef}
            type="button"
            disabled={isAdmin}
            onClick={handleStatusButtonClick}
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
          <StatusDropdown
            activity={activity}
            isOpen={openStatusMenu === activity.id}
            position={statusMenuPosition}
            customInput={customStatusInput}
            onCustomInputChange={(value) => onCustomStatusInputChange(activity.id, value)}
            onCustomSubmit={() => onCustomStatusSubmit(activity, customStatusInput)}
            onStatusClick={(status) => onStatusClick(activity, status)}
            isAdmin={isAdmin}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onCustomStatusSubmit(activity, customStatusInput);
              }
            }}
          />
        </div>
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
                onClick={() => onOpenDrawer(activity, 'estimated cost', activity.estimatedStatus)}
                className={`${getAmountColorByStatus(
                    activity.estimatedStatus
                  )} ${activity.estimatedCost === 0 ? 'dark:text-white' : ''} font-semibold mt-1 lg:mt-1.5 text-sm lg:text-base hover:underline`}
              >
                ${activity.estimatedCost.toLocaleString()}
              </button>
            </div>

            {/* Actual Cost */}
            <div>
              <span className="text-gray-500 dark:text-gray-400 font-medium">Actual</span>
              <button
                type="button"
                onClick={() => onOpenDrawer(activity, 'actual cost', activity.actualStatus)}
                className={`${getAmountColorByStatus(
                  activity.actualStatus
                )} ${activity.actualCost === 0 ? 'dark:text-white' : ''} font-semibold mt-1 lg:mt-1.5 text-sm lg:text-base hover:underline`}
              >
                ${activity.actualCost.toLocaleString()}
              </button>
            </div>

            {/* Support Cost */}
            <div>
              <span className="text-gray-500 dark:text-gray-400 font-medium">Support</span>
              <button
                type="button"
                onClick={() => onOpenDrawer(activity, 'support cost', activity.supportStatus)}
                className={`${getAmountColorByStatus(
                  activity.supportStatus
                )} ${activity.supportCost === 0 ? 'dark:text-white' : ''} font-semibold mt-1 lg:mt-1.5 text-sm lg:text-base hover:underline`}
              >
                ${activity.supportCost.toLocaleString()}
              </button>
            </div>

            {/* Invoice */}
            <div>
              <span className="text-gray-500 dark:text-gray-400 font-medium">Invoice</span>
              <button
                type="button"
                onClick={() => onOpenDrawer(activity, 'invoice', activity.invoiceStatus)}
                className={`${getAmountColorByStatus(
                  activity.invoiceStatus
                )} ${activity.invoiceCost === 0 ? 'dark:text-white' : ''} font-semibold mt-1 lg:mt-1.5 text-sm lg:text-base hover:underline`}
              >
                ${activity.invoiceCost.toLocaleString()}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};



import React from 'react';
import { MessageCircle, FileText, PlusCircle, ChevronDown } from 'lucide-react';
import { Checkbox } from '../../../ui/Checkbox';
import logo from '../../../../asstes/images/logo.png';
import { getAmountColorByStatus } from '../utils';
import { statusStyles, statusOptions } from '../constants';
import { StatusDropdown } from './StatusDropdown';

export const ActivityTableRow = ({
  activity,
  isSelected,
  onSelect,
  onOpenDrawer,
  showBudgetColumns,
  showMediaUploadColumns,
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
    const dropdownHeight = 120;
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
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group relative">
      <td className="py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700 w-12">
        <div className="flex items-center justify-center">
          <Checkbox 
            checked={isSelected}
            onChange={onSelect}
            className="[&>div]:w-4 [&>div]:h-4 [&>div]:border [&>div]:border-gray-300"
          />
        </div>
      </td>
      <td className="py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700 w-[250px]">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-900 dark:text-gray-100 font-medium group-hover:text-[#E60012] transition-colors">
            {activity.name}
          </span>
          <button
            onClick={() => onOpenDrawer(activity)}
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
            ref={statusButtonRef}
            type="button"
            disabled={isAdmin}
            onClick={handleStatusButtonClick}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 text-sm focus:outline-none transition-all ${
              isAdmin
                ? 'opacity-60 cursor-not-allowed'
                : 'hover:border-gray-400 dark:hover:border-gray-600 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 focus:border-gray-400 dark:focus:border-gray-600 cursor-pointer'
            }`}
          >
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${style.dot}`} />
            <span className={`text-xs font-semibold whitespace-nowrap ${style.text}`}>
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
      </td>
      {showBudgetColumns && (
        <>
          <td className="py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700 w-32">
            <button
              type="button"
              onClick={() => onOpenDrawer(activity, 'estimated cost', activity.estimatedStatus)}
              className={`text-sm font-medium ${getAmountColorByStatus(
                activity.estimatedStatus
              )} ${activity.estimatedCost === 0 ? 'dark:text-white' : ''} hover:underline`}
            >
              ${activity.estimatedCost.toLocaleString()}
            </button>
          </td>
          <td className="py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700 w-32">
            <button
              type="button"
              onClick={() => onOpenDrawer(activity, 'actual cost', activity.actualStatus)}
              className={`text-sm font-medium ${getAmountColorByStatus(
                activity.actualStatus
              )} ${activity.actualCost === 0 ? 'dark:text-white' : ''} hover:underline`}
            >
              ${activity.actualCost.toLocaleString()}
            </button>
          </td>
          <td className="py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700 w-32">
            <button
              type="button"
              onClick={() => onOpenDrawer(activity, 'support cost', activity.supportStatus)}
              className={`text-sm font-medium ${getAmountColorByStatus(
                activity.supportStatus
              )} ${activity.supportCost === 0 ? 'dark:text-white' : ''} hover:underline`}
            >
              ${activity.supportCost.toLocaleString()}
            </button>
          </td>
          <td className="py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700 w-32">
            <button
              type="button"
              onClick={() => onOpenDrawer(activity, 'invoice', activity.invoiceStatus)}
              className={`text-sm font-medium ${getAmountColorByStatus(
                activity.invoiceStatus
              )} ${activity.invoiceCost === 0 ? 'dark:text-white' : ''} hover:underline`}
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
              onClick={() => onOpenDrawer(activity, null, null, 'evidence')}
              className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-600 dark:text-gray-400 hover:text-[#E60012]"
              title="Evidence Media"
            >
              <FileText className="w-5 h-5" />
            </button>
          </td>
          <td className="py-4 px-6 w-28 text-center">
            <button
              type="button"
              onClick={() => onOpenDrawer(activity, 'invoice', null)}
              className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-600 dark:text-gray-400 hover:text-[#E60012]"
              title="Invoice Upload"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
          </td>
        </>
      )}
    </tr>
  );
};


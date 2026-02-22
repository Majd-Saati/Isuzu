import React from 'react';
import { ChevronDown, ChevronRight, Building2, Calendar, Edit2, Trash2, Plus, MoreVertical } from 'lucide-react';
import { formatDate } from '../utils';

export const PlanHeader = ({
  plan,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
  onAddActivity,
  showPlanMenu,
  onTogglePlanMenu,
}) => {
  return (
    <div className="w-full px-4 sm:px-6 py-4 sm:py-5 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-all duration-200 border-b-2 border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 relative">
        <button
          onClick={onToggleExpand}
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
              onTogglePlanMenu();
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
                  onAddActivity();
                  onTogglePlanMenu();
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
                  onTogglePlanMenu();
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
                  onDelete();
                  onTogglePlanMenu();
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
  );
};



import React from 'react';
import { Checkbox } from '../../../ui/Checkbox';
import { ActivityTableRow } from './ActivityTableRow';
import { AddActivityRow } from './AddActivityRow';

export const ActivitiesTable = ({
  activities,
  selectedActivities,
  onSelectActivity,
  onSelectAll,
  isAllSelected,
  onOpenDrawer,
  onAddActivity,
  showBudgetColumns,
  showMediaUploadColumns,
  isAdmin,
  openStatusMenu,
  statusMenuPosition,
  statusButtonRefs,
  customStatusInputs,
  onCustomStatusInputChange,
  onCustomStatusSubmit,
  onStatusClick,
  onStatusMenuToggle,
}) => {
  return (
    <div className="hidden xl:block overflow-x-auto custom-scrollbar border-b-2 border-gray-200 dark:border-gray-700">
      <table className="w-full table-fixed min-w-max">
        <thead className="bg-gray-50/70 dark:bg-gray-800/70 sticky top-0 z-10">
          <tr>
            <th className="w-12 py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center">
                <Checkbox 
                  checked={isAllSelected}
                  onChange={onSelectAll}
                  className="[&>div]:w-4 [&>div]:h-4 [&>div]:border [&>div]:border-gray-300"
                />
              </div>
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
              </>
            )}
            {showMediaUploadColumns && (
              <th className="text-left text-sm font-medium text-gray-500 dark:text-gray-400 py-4 px-6 border-r-2 border-gray-200 dark:border-gray-700 w-28">
                Evidence Media
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {activities.length > 0 && activities.map((activity) => (
            <ActivityTableRow
              key={activity.id}
              activity={activity}
              isSelected={selectedActivities.includes(activity.id)}
              onSelect={() => onSelectActivity(activity.id)}
              onOpenDrawer={onOpenDrawer}
              showBudgetColumns={showBudgetColumns}
              showMediaUploadColumns={showMediaUploadColumns}
              isAdmin={isAdmin}
              openStatusMenu={openStatusMenu}
              statusMenuPosition={statusMenuPosition}
              statusButtonRef={(el) => (statusButtonRefs.current[activity.id] = el)}
              customStatusInput={customStatusInputs[activity.id]}
              onCustomStatusInputChange={onCustomStatusInputChange}
              onCustomStatusSubmit={onCustomStatusSubmit}
              onStatusClick={onStatusClick}
              onStatusMenuToggle={onStatusMenuToggle}
            />
          ))}
          <AddActivityRow
            onClick={onAddActivity}
            showBudgetColumns={showBudgetColumns}
            showMediaUploadColumns={showMediaUploadColumns}
          />
        </tbody>
      </table>
      {activities.length === 0 && (
        <div className="py-8 px-4 sm:px-6 bg-gray-50/30 dark:bg-gray-800/30 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            There are no activities for this plan yet. Click "Add Activity" to create your first activity.
          </p>
        </div>
      )}
    </div>
  );
};




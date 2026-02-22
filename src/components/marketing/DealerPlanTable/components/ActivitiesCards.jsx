import React from 'react';
import { ActivityCard } from './ActivityCard';

export const ActivitiesCards = ({
  activities,
  selectedActivities,
  onSelectActivity,
  onOpenDrawer,
  showBudgetColumns,
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
    <div className="xl:hidden divide-y divide-gray-200 dark:divide-gray-700">
      {activities.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          isSelected={selectedActivities.includes(activity.id)}
          onSelect={() => onSelectActivity(activity.id)}
          onOpenDrawer={onOpenDrawer}
          showBudgetColumns={showBudgetColumns}
          isAdmin={isAdmin}
          openStatusMenu={openStatusMenu}
          statusMenuPosition={statusMenuPosition}
          statusButtonRef={(el) => (statusButtonRefs.current[`mobile-${activity.id}`] = el)}
          customStatusInput={customStatusInputs[activity.id]}
          onCustomStatusInputChange={onCustomStatusInputChange}
          onCustomStatusSubmit={onCustomStatusSubmit}
          onStatusClick={onStatusClick}
          onStatusMenuToggle={onStatusMenuToggle}
        />
      ))}
    </div>
  );
};




import React from 'react';
import { Megaphone, ListChecks, MailWarning, Plus } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, iconClass }) => (
  <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3">
    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
      <Icon className="h-5 w-5" />
    </div>
    <div className="min-w-0">
      <div className="text-xl font-semibold leading-none text-gray-900 dark:text-gray-100">
        {value}
      </div>
      <div className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  </div>
);

/**
 * Page header for Announcements: title, short description and an at-a-glance
 * summary sourced from the announcements_list API response.
 */
export const AnnouncementsPageHeader = ({ total, unreadCount, onNewAnnouncement }) => (
  <div className="pt-6 pb-6 mb-8 border-b border-gray-200 dark:border-gray-800">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#E60012]/10">
          <Megaphone className="h-6 w-6 text-[#E60012]" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Announcements</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Review announcements sent to dealers and monitor their delivery status.
          </p>
        </div>
      </div>

      {onNewAnnouncement && (
        <button
          onClick={onNewAnnouncement}
          className="flex items-center gap-2 rounded-lg bg-[#E60012] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#C00010]"
        >
          <Plus className="h-4 w-4" />
          New Announcement
        </button>
      )}
    </div>

    <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-md">
      <StatCard
        icon={ListChecks}
        label="Total announcements"
        value={total ?? 0}
        iconClass="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
      />
      <StatCard
        icon={MailWarning}
        label="Unread"
        value={unreadCount ?? '—'}
        iconClass="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
      />
    </div>
  </div>
);

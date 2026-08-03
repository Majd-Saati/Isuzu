import React from 'react';
import { Trash2, Bell, Building2, CalendarClock } from 'lucide-react';
import { CustomPagination } from '@/components/ui/CustomPagination';
import {
  REMINDER_TYPES,
  REMINDER_PRIORITIES,
  REMINDER_STATUSES,
} from '@/data/mockRemindersData';

const Badge = ({ meta }) => {
  if (!meta) return <span className="text-gray-400">—</span>;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${meta.badgeClass}`}
    >
      {meta.label}
    </span>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Table of all reminders with badges and pagination.
 */
export const RemindersTable = ({
  reminders,
  pagination,
  onDelete,
  onPageChange,
  onItemsPerPageChange,
}) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50/70 dark:bg-gray-800/70 border-b-2 border-gray-200 dark:border-gray-700">
          <tr>
            {['Reminder', 'Dealer', 'Type', 'Priority', 'Status', 'Due Date'].map((h) => (
              <th
                key={h}
                className="text-left px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 border-r-2 border-gray-200 dark:border-gray-700"
              >
                {h}
              </th>
            ))}
            <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-gray-200 dark:divide-gray-700">
          {reminders.map((reminder) => (
            <tr
              key={reminder.id}
              className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-all duration-200"
            >
              <td className="px-6 py-4 border-r-2 border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E60012]/10 flex items-center justify-center flex-shrink-0">
                    <Bell className="w-5 h-5 text-[#E60012]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {reminder.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[280px]">
                      {reminder.message}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 border-r-2 border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {reminder.dealerName}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 border-r-2 border-gray-200 dark:border-gray-700">
                <Badge meta={REMINDER_TYPES[reminder.type]} />
              </td>
              <td className="px-6 py-4 border-r-2 border-gray-200 dark:border-gray-700">
                <Badge meta={REMINDER_PRIORITIES[reminder.priority]} />
              </td>
              <td className="px-6 py-4 border-r-2 border-gray-200 dark:border-gray-700">
                <Badge meta={REMINDER_STATUSES[reminder.status]} />
              </td>
              <td className="px-6 py-4 border-r-2 border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <CalendarClock className="w-3.5 h-3.5" />
                  {formatDate(reminder.dueDate)}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => onDelete?.(reminder)}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-all hover:scale-110 active:scale-95"
                    title="Delete reminder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <CustomPagination
      currentPage={pagination.page}
      totalPages={pagination.total_pages}
      totalItems={pagination.total}
      itemsPerPage={pagination.per_page}
      onPageChange={onPageChange}
      onItemsPerPageChange={onItemsPerPageChange}
    />
  </div>
);

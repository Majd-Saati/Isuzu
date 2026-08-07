import React from 'react';
import { Megaphone, Building2, Users, CalendarClock, Pencil } from 'lucide-react';
import { CustomPagination } from '@/components/ui/CustomPagination';

const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString.replace(' ', 'T'));
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const AudienceBadge = ({ audienceType, companyName }) =>
  audienceType === 'all' ? (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
      All dealers
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
      <Building2 className="w-3 h-3" />
      {companyName || '—'}
    </span>
  );

/**
 * Table of announcements returned by the announcements_list API, with pagination.
 */
export const AnnouncementsTable = ({
  announcements,
  pagination,
  onEdit,
  onPageChange,
  onItemsPerPageChange,
}) => (
  <div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
          <tr>
            {['Announcement', 'Audience', 'Recipients', 'Read / Unread', 'Date'].map((h) => (
              <th
                key={h}
                className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                {h}
              </th>
            ))}
            <th className="text-center px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {announcements.map((announcement) => (
            <tr
              key={announcement.id}
              className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors"
            >
              <td className="px-6 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#E60012]/10 flex items-center justify-center flex-shrink-0">
                    <Megaphone className="w-5 h-5 text-[#E60012]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {announcement.title || '—'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[320px]">
                      {announcement.description || '—'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <AudienceBadge
                  audienceType={announcement.audience_type}
                  companyName={announcement.company_name}
                />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Users className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  {announcement.recipient_count ?? 0}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    {announcement.read_count ?? 0} read
                  </span>
                  <span className="text-gray-300 dark:text-gray-600">/</span>
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    {announcement.unread_count ?? 0} unread
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <CalendarClock className="w-3.5 h-3.5" />
                  {formatDate(announcement.creation_date)}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => onEdit?.(announcement)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-[#E60012] dark:hover:text-[#E60012] transition-colors"
                    title="Edit announcement"
                    aria-label="Edit announcement"
                  >
                    <Pencil className="w-4 h-4" />
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

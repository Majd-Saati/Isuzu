import React, { useEffect, useRef, useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Megaphone, Building2, Users, CalendarClock, Pencil, Trash2, MailOpen, Loader2, Eye } from 'lucide-react';
import { CustomPagination } from '@/components/ui/CustomPagination';

/** True when the device has no reliable hover (phones/tablets). */
const useLacksHover = () => {
  const [lacksHover, setLacksHover] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(hover: none)').matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(hover: none)');
    const sync = () => setLacksHover(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return lacksHover;
};

const PREVIEW_CONTENT_CLASS =
  'z-[11000] max-w-[min(24rem,calc(100vw-1.5rem))] rounded-lg border border-gray-200 bg-white px-3.5 py-3 text-xs font-medium leading-snug text-gray-900 shadow-lg outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100';

/** Hover on desktop, click/tap on touch — Popover so the first tap always opens. */
const HoverClickPopover = ({ content, children, align = 'start' }) => {
  const lacksHover = useLacksHover();
  const [open, setOpen] = useState(false);
  const closeTimerRef = useRef(null);

  const clearCloseTimer = () => {
    if (closeTimerRef.current != null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openFromHover = () => {
    if (lacksHover) return;
    clearCloseTimer();
    setOpen(true);
  };

  // Delay close so the pointer can move from trigger → content without dismissing.
  const scheduleCloseFromHover = () => {
    if (lacksHover) return;
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setOpen(false);
      closeTimerRef.current = null;
    }, 180);
  };

  useEffect(() => () => clearCloseTimer(), []);

  return (
    <Popover.Root
      // Non-modal: default modal=true sets pointer-events:none on <body>,
      // which breaks native <select> and other controls (esp. after hover).
      modal={false}
      open={open}
      onOpenChange={(next) => {
        clearCloseTimer();
        setOpen(next);
      }}
    >
      <Popover.Trigger
        asChild
        onMouseEnter={openFromHover}
        onMouseLeave={scheduleCloseFromHover}
      >
        {children}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="top"
          align={align}
          sideOffset={6}
          collisionPadding={12}
          className={`${PREVIEW_CONTENT_CLASS} pointer-events-auto`}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          onMouseEnter={openFromHover}
          onMouseLeave={scheduleCloseFromHover}
        >
          {content}
          <Popover.Arrow className="fill-white dark:fill-gray-800" width={10} height={5} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

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

const isAnnouncementRead = (announcement) =>
  announcement.has_read === true || announcement.has_read === 1 || announcement.has_read === '1';

const AnnouncementTooltipBody = ({ announcement }) => {
  const title = announcement?.title?.trim() || 'Announcement';
  const body = announcement?.description?.trim() || 'No message content.';

  return (
    <div className="space-y-1.5 text-left">
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 break-words [overflow-wrap:anywhere]">
        {title}
      </p>
      <p className="text-xs font-normal text-gray-600 dark:text-gray-300 whitespace-pre-wrap break-words [overflow-wrap:anywhere] max-h-[40vh] overflow-y-auto">
        {body}
      </p>
    </div>
  );
};

const AnnouncementFullTooltip = ({ announcement, children }) => (
  <HoverClickPopover content={<AnnouncementTooltipBody announcement={announcement} />}>
    {children}
  </HoverClickPopover>
);

const AudienceBadge = ({ audienceType, companyName, isAdminAudience }) => {
  if (Number(isAdminAudience) === 1) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
        IIF users
      </span>
    );
  }
  if (audienceType === 'all') {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
        All dealers
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
      <Building2 className="w-3 h-3" />
      {companyName || '—'}
    </span>
  );
};

const RecipientsListContent = ({ users }) => (
  <div className="space-y-1.5 text-left">
    <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
      Recipients ({users.length})
    </p>
    <ul className="space-y-1.5 max-h-[40vh] overflow-y-auto">
      {users.map((user) => (
        <li
          key={user.user_id ?? user.id}
          className="text-xs text-gray-600 dark:text-gray-300 break-words [overflow-wrap:anywhere]"
        >
          <span className="font-medium text-gray-800 dark:text-gray-100">
            {user.name?.trim() || 'Unknown'}
          </span>
          {user.email?.trim() ? (
            <span className="block text-gray-500 dark:text-gray-400">{user.email.trim()}</span>
          ) : null}
        </li>
      ))}
    </ul>
  </div>
);

const RecipientsCell = ({ announcement }) => {
  const users = Array.isArray(announcement.users_list) ? announcement.users_list : [];
  const count = announcement.recipient_count ?? users.length ?? 0;

  if (users.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <Users className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        {count}
      </div>
    );
  }

  const preview = users.slice(0, 2);
  const remaining = users.length - preview.length;

  return (
    <HoverClickPopover content={<RecipientsListContent users={users} />}>
      <button
        type="button"
        className="max-w-[240px] text-left rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E60012]/40"
        aria-label={`View ${users.length} recipients`}
      >
        <div className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
          <Users className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
          <div className="min-w-0 space-y-0.5">
            {preview.map((user) => (
              <span
                key={user.user_id ?? user.id}
                className="block truncate text-xs text-gray-800 dark:text-gray-200"
              >
                {user.name?.trim() || user.email || '—'}
              </span>
            ))}
            {remaining > 0 && (
              <span className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[11px] font-medium text-gray-600 dark:text-gray-300">
                +{remaining} more · {users.length} total
              </span>
            )}
          </div>
        </div>
      </button>
    </HoverClickPopover>
  );
};

/**
 * Table of announcements returned by the announcements_list API, with pagination.
 */
export const AnnouncementsTable = ({
  announcements,
  pagination,
  isAdmin,
  onEdit,
  onDelete,
  onMarkRead,
  isMarkingRead,
  markingReadId,
  onPageChange,
  onItemsPerPageChange,
}) => (
  <div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
          <tr>
            {[
              'Announcement',
              'Audience',
              ...(isAdmin ? ['Recipients', 'Read / Unread'] : []),
              'Date',
            ].map((h) => (
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
                  <AnnouncementFullTooltip announcement={announcement}>
                    <button
                      type="button"
                      className="min-w-0 max-w-[320px] text-left rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E60012]/40"
                      aria-label="View full announcement"
                    >
                      <span className="block text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {announcement.title || '—'}
                      </span>
                      <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">
                        {announcement.description || '—'}
                      </span>
                    </button>
                  </AnnouncementFullTooltip>
                </div>
              </td>
              <td className="px-6 py-4">
                <AudienceBadge
                  audienceType={announcement.audience_type}
                  companyName={announcement.company_name}
                  isAdminAudience={announcement.is_admin}
                />
              </td>
              {isAdmin && (
                <td className="px-6 py-4">
                  <RecipientsCell announcement={announcement} />
                </td>
              )}
              {isAdmin && (
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
              )}
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <CalendarClock className="w-3.5 h-3.5" />
                  {formatDate(announcement.creation_date)}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-1">
                  <AnnouncementFullTooltip announcement={announcement}>
                    <button
                      type="button"
                      className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      aria-label="View full announcement"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </AnnouncementFullTooltip>
                  {!isAdmin && !isAnnouncementRead(announcement) && (
                    <button
                      onClick={() => onMarkRead?.(announcement)}
                      disabled={isMarkingRead}
                      className="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Mark as read"
                      aria-label="Mark as read"
                    >
                      {markingReadId === announcement.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <MailOpen className="w-4 h-4" />
                      )}
                    </button>
                  )}
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => onEdit?.(announcement)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-[#E60012] dark:hover:text-[#E60012] transition-colors"
                        title="Edit announcement"
                        aria-label="Edit announcement"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete?.(announcement)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Delete announcement"
                        aria-label="Delete announcement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
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

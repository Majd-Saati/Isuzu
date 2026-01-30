import React from 'react';
import { StatusBadge } from './StatusBadge';

/**
 * Shape used by the table and mobile card.
 * This keeps the rendering layer simple and focused on layout.
 */
const mapItemToRow = (item, index) => {
  const dealer = {
    name: item.company_name,
    avatar: item.company_logo,
  };

  let actionTitle = '';
  let actionDescription = '';
  let isHighlighted = false;
  const cost = {};
  const duration = {};
  let status = 'pending';

  const termStartLabel = item.term_start ? `Start: ${item.term_start}` : '';
  const termEndLabel = item.term_end ? `End: ${item.term_end}` : '';

  if (item.kind === 'meta') {
    // Top bold line: meta_preview
    actionTitle = item.meta_preview || item.plan_name || 'Meta update';
    // Secondary line: meta type and activity/plan context
    actionDescription = [
      item.meta_type && ` ${item.meta_type}`,
      item.activity_name && `${item.activity_name}`,
      !item.activity_name && item.plan_name && `${item.plan_name}`,
    ]
      .filter(Boolean)
      .join(' • ');
    status = 'completed';
    duration.start = termStartLabel || undefined;
    duration.end = termEndLabel || undefined;
    if (!duration.start && !duration.end && item.created_at) {
      duration.single = item.created_at;
    }
  } else if (item.kind === 'budget') {
    // Top bold line: budget_type
    actionTitle = item.budget_type || item.plan_name || 'Budget update';
    // Secondary line: status, amount, activity/plan
    actionDescription = [
      item.budget_status && `Status: ${item.budget_status}`,
      item.value != null && `Amount: ${item.value} ${item.currency || ''}`.trim(),
      item.activity_name && `Activity: ${item.activity_name}`,
      !item.activity_name && item.plan_name && `Plan: ${item.plan_name}`,
    ]
      .filter(Boolean)
      .join(' • ');
    status = item.budget_status === 'pending' ? 'pending' : 'approval';

    if (item.value != null || item.currency) {
      cost.single = `${item.value ?? ''} ${item.currency || ''}`.trim();
    }

    duration.start = termStartLabel || undefined;
    duration.end = termEndLabel || undefined;
  } else if (item.kind === 'plan_created') {
    // Top bold line: plan_name
    actionTitle = item.plan_name || 'Plan created';
    // Secondary line: generic info and status
    actionDescription = [
      'Plan created',
      item.plan_status != null && `Status: ${item.plan_status}`,
    ]
      .filter(Boolean)
      .join(' • ');
    status = item.plan_status === 1 ? 'approval' : 'pending';
    duration.start = termStartLabel || undefined;
    duration.end = termEndLabel || undefined;
  } else {
    // Fallback for any other kind
    actionTitle = item.plan_name || 'Activity';
    actionDescription = item.activity_name || '';
    duration.single = item.created_at || undefined;
  }

  // Default labels if still empty
  if (!actionTitle) {
    actionTitle = item.plan_name || item.activity_name || 'Activity';
  }

  return {
    id: String(item.meta_id || item.budget_id || item.plan_id || index),
    dealer,
    action: {
      title: actionTitle,
      description: actionDescription,
      isHighlighted,
    },
    cost,
    status,
    duration,
    meta: {
      kind: item.kind || '',
      createdByName: item.created_by_name || '',
      createdAt: item.created_at || '',
      termName: item.term_name || '',
      termStart: item.term_start || '',
      termEnd: item.term_end || '',
      // Budget-specific metadata for richer display
      budgetStatus: item.budget_status || '',
      budgetType: item.budget_type || '',
      value: item.value,
      currency: item.currency || '',
      activityName: item.activity_name || '',
      planName: item.plan_name || '',
    },
  };
};

/**
 * Desktop table cells
 */
const DealerCell = ({ dealer }) => (
  <div className="px-6 py-6 flex items-center gap-3 border-r border-gray-200 dark:border-gray-700">
    <div className="relative">
      <img
        src={dealer.avatar}
        className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-gray-900 shadow-md"
        alt={dealer.name}
      />
    </div>
    <span className="text-sm text-[#344251] dark:text-gray-200 font-semibold">{dealer.name}</span>
  </div>
);

const InfoCell = ({ row }) => (
  <div className="px-6 py-6 flex flex-col justify-center border-r border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between gap-2 mb-1">
      <div className={`text-sm font-semibold ${row.action.isHighlighted ? 'text-[#E60012]' : 'text-[#1F2937] dark:text-gray-200'}`}>
        {row.action.title}
      </div>
      {row.meta?.kind && (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide
          ${
            row.meta.kind === 'meta'
              ? 'bg-blue-50 dark:bg-blue-900/20 text-[#1D4ED8] dark:text-blue-400'
              : row.meta.kind === 'budget'
              ? 'bg-amber-50 dark:bg-amber-900/20 text-[#B45309] dark:text-amber-400'
              : row.meta.kind === 'plan_created'
              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-[#047857] dark:text-emerald-400'
              : 'bg-gray-100 dark:bg-gray-800 text-[#4B5563] dark:text-gray-300'
          }`}
        >
          {row.meta.kind}
        </span>
      )}
    </div>

    {/* Info details: for budget show each piece in its own row with bold numbers */}
    {row.meta?.kind === 'budget' ? (
      <div className="mt-1 space-y-0.5 text-xs text-[#6B7280] dark:text-gray-300">
        {row.meta.budgetStatus && (
          <div>
            Status:{' '}
            <span
              className={
                row.meta.budgetStatus === 'accepted'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : row.meta.budgetStatus === 'pending'
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-[#6B7280] dark:text-gray-400'
              }
            >
              {row.meta.budgetStatus}
            </span>
          </div>
        )}
        {(row.meta.value != null || row.meta.currency) && (
          <div>
            Amount:{' '}
            <span
              className={`text-[#111827] dark:text-gray-200 ${
                row.meta.budgetType === 'estimated cost' ? 'font-semibold' : 'font-normal'
              }`}
            >
              {row.meta.value != null ? row.meta.value : '-'}
            </span>
            {row.meta.currency && <span className="ml-1">{row.meta.currency}</span>}
          </div>
        )}
        {(row.meta.activityName || row.meta.planName) && (
          <div>
            Activity:{' '}
            <span>{row.meta.activityName || row.meta.planName}</span>
          </div>
        )}
      </div>
    ) : (
      <div className="text-xs text-[#6B7280] dark:text-gray-300 leading-relaxed">{row.action.description}</div>
    )}
  </div>
);

const UserCell = ({ meta }) => (
  <div className="px-6 py-6 flex flex-col justify-center border-r border-gray-200 dark:border-gray-700">
    <div className="flex flex-col">
      <span className="text-xs font-semibold text-[#374151] dark:text-gray-200">
        {meta?.createdByName || '-'}
      </span>
      <span className="text-[11px] text-[#6B7280] dark:text-gray-400 mt-1">
        {meta?.createdAt || '-'}
      </span>
    </div>
  </div>
);

const TermCell = ({ meta }) => (
  <div className="px-6 py-6 flex flex-col justify-center border-r border-gray-200 dark:border-gray-700">
    <span className="text-xs sm:text-sm font-semibold text-[#1F2937] dark:text-gray-200 truncate">
      {meta?.termName || '-'}
    </span>
    <span className="text-[11px] text-[#6B7280] dark:text-gray-400 mt-1 truncate">
      {meta?.termStart && meta?.termEnd
        ? `${meta.termStart} → ${meta.termEnd}`
        : meta?.termStart || meta?.termEnd || '-'}
    </span>
  </div>
);

const StatusCell = ({ status }) => (
  <div className="px-6 py-6 flex items-center">
    <StatusBadge status={status}>
      {status === 'approval' && 'Approval'}
      {status === 'pending' && 'In Pending'}
      {status === 'completed' && 'Completed'}
    </StatusBadge>
  </div>
);

/**
 * Desktop table row & header
 */
const TableRow = ({ row }) => (
  <div className="grid grid-cols-5 border-b border-gray-100/80 dark:border-gray-700 hover:bg-gradient-to-r hover:from-blue-50/30 dark:hover:from-gray-800/50 hover:to-transparent dark:hover:to-gray-800/50 transition-all duration-200">
    <DealerCell dealer={row.dealer} />
    <InfoCell row={row} />
    <UserCell meta={row.meta} />
    <TermCell meta={row.meta} />
    <StatusCell status={row.status} />
  </div>
);

const TableHeader = () => (
  <div className="grid grid-cols-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50/90 dark:from-gray-800 via-gray-50/70 dark:via-gray-800 to-gray-50/90 dark:to-gray-900/50 backdrop-blur-sm">
    <div className="px-6 py-4 text-sm font-semibold text-[#374151] dark:text-gray-200 border-r border-gray-200 dark:border-gray-700">Dealer</div>
    <div className="px-6 py-4 text-sm font-semibold text-[#374151] dark:text-gray-200 border-r border-gray-200 dark:border-gray-700">Info</div>
    <div className="px-6 py-4 text-sm font-semibold text-[#374151] dark:text-gray-200 border-r border-gray-200 dark:border-gray-700">User</div>
    <div className="px-6 py-4 text-sm font-semibold text-[#374151] dark:text-gray-200 border-r border-gray-200 dark:border-gray-700">Term</div>
    <div className="px-6 py-4 text-sm font-semibold text-[#374151] dark:text-gray-200">Status</div>
  </div>
);

const DesktopOverviewTable = ({ items }) => (
  <div className="hidden lg:block bg-white dark:bg-gray-900 overflow-hidden rounded-[24px] shadow-[0px_4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0px_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-gray-800">
    <TableHeader />
    <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
      {items.map((item, index) => {
        const row = mapItemToRow(item, index);
        return <TableRow key={row.id} row={row} />;
      })}
    </div>
  </div>
);

/**
 * Mobile card layout
 */
const MobileCard = ({ row }) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-[0px_4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0px_4px_16px_rgba(0,0,0,0.08)] border border-gray-100/80 dark:border-gray-800 overflow-hidden hover:shadow-[0px_6px_20px_rgba(0,0,0,0.12)] dark:hover:shadow-[0px_6px_20px_rgba(0,0,0,0.12)] transition-shadow duration-300">
    {/* Top Section - Dealer & Status */}
    <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-gray-50/90 dark:from-gray-800 via-gray-50/70 dark:via-gray-800 to-gray-50/90 dark:to-gray-900/50 border-b border-gray-200/80 dark:border-gray-700 backdrop-blur-sm">
      <div className="flex items-center gap-2.5">
        <img
          src={row.dealer.avatar}
          className="w-9 h-9 rounded-full object-cover ring-2 ring-white dark:ring-gray-900 shadow-md"
          alt={row.dealer.name}
        />
        <span className="text-sm font-bold text-[#1F2937] dark:text-gray-200">{row.dealer.name}</span>
      </div>
      <StatusBadge status={row.status}>
        {row.status === 'approval' && 'Approval'}
        {row.status === 'pending' && 'Pending'}
        {row.status === 'completed' && 'Done'}
      </StatusBadge>
    </div>

    {/* Content Section */}
    <div className="p-4 space-y-3">
      {/* Action */}
      <div>
        <div className={`text-sm font-bold mb-1 ${row.action.isHighlighted ? 'text-[#E60012]' : 'text-[#1F2937] dark:text-gray-200'}`}>
          {row.action.title}
        </div>
        <div className="text-xs text-[#6B7280] dark:text-gray-300 leading-relaxed">
          {row.action.description}
        </div>
      </div>

      {/* Cost & Duration Row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Cost */}
        <div className="bg-gradient-to-br from-amber-50/80 dark:from-amber-900/20 via-amber-50/60 dark:via-amber-900/15 to-amber-100/60 dark:to-amber-900/15 p-3 rounded-xl shadow-sm border border-amber-100/50 dark:border-amber-800/30">
          <div className="text-[10px] font-bold text-[#78716c] dark:text-amber-300 uppercase tracking-wide mb-1.5">Cost</div>
          {row.cost.expected && (
            <div className="text-[11px] text-[#78716c] dark:text-amber-200 font-medium leading-tight">
              {row.cost.expected}
            </div>
          )}
          {row.cost.actual && (
            <div className="text-[11px] text-[#78716c] dark:text-amber-200 font-medium leading-tight mt-1">
              {row.cost.actual}
            </div>
          )}
          {row.cost.single && (
            <div className="text-sm text-[#292524] dark:text-amber-200 font-bold">
              {row.cost.single}
            </div>
          )}
        </div>

        {/* Duration */}
        <div className="bg-gradient-to-br from-gray-50/90 dark:from-gray-800 via-gray-50/70 dark:via-gray-800 to-gray-50/90 dark:to-gray-900/50 p-3 rounded-xl shadow-sm border border-gray-100/50 dark:border-gray-700/50">
          <div className="text-[10px] font-bold text-[#6B7280] dark:text-gray-300 uppercase tracking-wide mb-1.5">Duration</div>
          {row.duration.start && (
            <div className="text-[11px] text-[#6B7280] dark:text-gray-300 font-medium leading-tight">
              {row.duration.start}
            </div>
          )}
          {row.duration.end && (
            <div className="text-[11px] text-[#6B7280] dark:text-gray-300 font-medium leading-tight mt-1">
              {row.duration.end}
            </div>
          )}
          {row.duration.single && (
            <div className="text-[11px] text-[#6B7280] dark:text-gray-300 font-medium">
              {row.duration.single}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

const MobileOverviewList = ({ items }) => (
  <div className="lg:hidden max-h-[700px] overflow-y-auto custom-scrollbar space-y-3 pr-1">
    {items.map((item, index) => {
      const row = mapItemToRow(item, index);
      return <MobileCard key={row.id} row={row} />;
    })}
  </div>
);

const CustomScrollbarStyles = () => (
  <style jsx>{`
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f9fafb;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 10px;
      border: 1px solid #f3f4f6;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #9ca3af;
    }
    .dark .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(15, 23, 42, 0.8);
    }
    .dark .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(148, 163, 184, 0.4);
    }
    .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(148, 163, 184, 0.6);
    }
  `}</style>
);

export const OverviewTable = ({ items }) => (
  <>
    <DesktopOverviewTable items={items} />
    <MobileOverviewList items={items} />
    <CustomScrollbarStyles />
  </>
);

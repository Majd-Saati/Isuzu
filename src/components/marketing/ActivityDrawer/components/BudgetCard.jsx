import React from 'react';
import { useSelector } from 'react-redux';
import { DollarSign, Clock, User, FileText, Check, XCircle, Trash2, Calendar, Paperclip, ExternalLink } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { formatCurrency, formatDate, formatMonthLabel } from '../utils/formatters';
import { getMonthsBreakdownFromRecord } from '../utils/budgetBreakdown';
import { parseMediaPaths, resolveMediaUrl, mediaFileLabel } from '../utils/mediaUrls';
import { isAdminUser } from '@/lib/permissions';

export const BudgetCard = ({ item, showCreator = true, onAccept, onDecline, onDelete }) => {
  const currentUser = useSelector((state) => state.auth.user);
  const canAcceptBudget = isAdminUser(currentUser);
  const isEstimated = item.type === 'estimated cost';
  const isActual = item.type === 'actual cost';
  const isSupport = item.type === 'support cost';
  const isPending = (item.status || '').toLowerCase() === 'pending';

  const getStyles = () => {
    if (isEstimated) {
      return {
        bg: 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-200/80 dark:border-blue-500/25',
        icon: 'bg-blue-100 dark:bg-blue-900/50',
        text: 'text-blue-600 dark:text-blue-400',
        well: 'border-blue-200/50 dark:border-blue-400/15 bg-white/85 dark:bg-slate-950/50',
        wellMuted: 'text-blue-900/45 dark:text-blue-200/45',
      };
    }
    if (isActual) {
      return {
        bg: 'bg-emerald-50/50 dark:bg-emerald-950/25 border-emerald-200/80 dark:border-emerald-500/25',
        icon: 'bg-emerald-100 dark:bg-emerald-900/50',
        text: 'text-emerald-600 dark:text-emerald-400',
        well: 'border-emerald-200/50 dark:border-emerald-400/15 bg-white/85 dark:bg-slate-950/50',
        wellMuted: 'text-emerald-900/45 dark:text-emerald-200/45',
      };
    }
    if (isSupport) {
      return {
        bg: 'bg-purple-50/50 dark:bg-purple-950/25 border-purple-200/80 dark:border-purple-500/25',
        icon: 'bg-purple-100 dark:bg-purple-900/50',
        text: 'text-purple-600 dark:text-purple-400',
        well: 'border-purple-200/50 dark:border-purple-400/15 bg-white/85 dark:bg-slate-950/50',
        wellMuted: 'text-purple-900/45 dark:text-purple-200/45',
      };
    }
    return {
      bg: 'bg-gray-50/50 dark:bg-slate-900/40 border-gray-200 dark:border-slate-600/35',
      icon: 'bg-gray-100 dark:bg-slate-800',
      text: 'text-gray-600 dark:text-gray-400',
      well: 'border-gray-200/70 dark:border-slate-500/20 bg-white/85 dark:bg-slate-950/50',
      wellMuted: 'text-gray-500 dark:text-slate-400/80',
    };
  };

  const styles = getStyles();
  const monthsBreakdown = getMonthsBreakdownFromRecord(item);
  const mediaPaths = parseMediaPaths(item.media ?? item.Media);
  const mediaLinks = mediaPaths
    .map((path) => {
      const href = resolveMediaUrl(path);
      return href ? { href, label: mediaFileLabel(path) } : null;
    })
    .filter(Boolean);

  return (
    <div className={`p-4 rounded-xl border-2 ${styles.bg}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${styles.icon}`}>
            <DollarSign className={`w-4 h-4 ${styles.text}`} />
          </div>
          <div>
            <p className={`text-xs font-medium uppercase tracking-wide ${styles.text}`}>
              {item.type}
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatCurrency(item.value)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={item.status} />
          {isPending && onAccept && canAcceptBudget && (
            <button
              onClick={() => onAccept(item)}
              className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/60 transition-all"
              title="Accept Budget"
            >
              <Check className="w-4 h-4" />
            </button>
          )}
          {isPending && onDecline && canAcceptBudget && (
            <button
              onClick={() => onDecline(item)}
              className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/60 transition-all"
              title="Deny budget"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(item)}
              className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/60 transition-all"
              title="Delete Budget"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {(item.description || (monthsBreakdown && Object.keys(monthsBreakdown).length > 0) || mediaLinks.length > 0) && (
        <div className="flex flex-col gap-3 mb-3">
          {item.description && (
            <div
              className={`rounded-xl border px-3.5 py-3 ${styles.well}`}
            >
              <div
                className={`flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide mb-2 ${styles.wellMuted}`}
              >
                <FileText className="w-3.5 h-3.5 opacity-80" aria-hidden />
                Description
              </div>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-wrap break-words">
                {item.description}
              </p>
            </div>
          )}

          {monthsBreakdown && Object.keys(monthsBreakdown).length > 0 && (
            <div className={`rounded-xl border px-3.5 py-3 ${styles.well}`}>
              <div
                className={`flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide mb-3 ${styles.wellMuted}`}
              >
                <Calendar className="w-3.5 h-3.5 opacity-80" aria-hidden />
                Monthly breakdown
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2">
                {Object.entries(monthsBreakdown)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([monthKey, amount]) => (
                    <div
                      key={monthKey}
                      className="flex items-center justify-between gap-4 rounded-lg bg-slate-500/[0.06] dark:bg-white/[0.05] px-3 py-2 text-xs"
                    >
                      <span className="text-slate-600 dark:text-slate-400">{formatMonthLabel(monthKey)}</span>
                      <span className="font-medium tabular-nums text-slate-800 dark:text-slate-200">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {mediaLinks.length > 0 && (
            <div className={`rounded-xl border px-3.5 py-3 ${styles.well}`}>
              <div
                className={`flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide mb-2.5 ${styles.wellMuted}`}
              >
                <Paperclip className="w-3.5 h-3.5 opacity-80" aria-hidden />
                Media
              </div>
              <ul className="flex flex-col gap-2">
                {mediaLinks.map(({ href, label }, index) => (
                  <li key={`${href}-${index}`}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-[#E60012] dark:text-red-400/95 break-all"
                    >
                      <span className="min-w-0 leading-snug">{label}</span>
                      <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 opacity-70" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 mt-0.5 border-t border-slate-200/55 dark:border-white/[0.07]">
        {showCreator && item.created_by_name ? (
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span>{item.created_by_name}</span>
          </div>
        ) : (
          <div />
        )}
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatDate(item.creation_date)}</span>
        </div>
      </div>
    </div>
  );
};

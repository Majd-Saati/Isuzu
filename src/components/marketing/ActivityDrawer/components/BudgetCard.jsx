import React from 'react';
import { useSelector } from 'react-redux';
import { DollarSign, Clock, User, FileText, Check, XCircle, Trash2, Calendar } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { formatCurrency, formatDate, formatMonthLabel } from '../utils/formatters';
import { isAdminUser } from '@/lib/permissions';

export const BudgetCard = ({ item, showCreator = true, onAccept, onDecline, onDelete }) => {
  const currentUser = useSelector((state) => state.auth.user);
  const canAcceptBudget = isAdminUser(currentUser);
  const isEstimated = item.type === 'estimated cost';
  const isActual = item.type === 'actual cost';
  const isSupport = item.type === 'support cost';
  const isPending = (item.status || '').toLowerCase() === 'pending';

  const getStyles = () => {
    if (isEstimated) return { bg: 'bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800', icon: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-600 dark:text-blue-400' };
    if (isActual) return { bg: 'bg-emerald-50/50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800', icon: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-600 dark:text-emerald-400' };
    if (isSupport) return { bg: 'bg-purple-50/50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800', icon: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-600 dark:text-purple-400' };
    return { bg: 'bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700', icon: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-400' };
  };

  const styles = getStyles();
  
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
              title="Decline Budget"
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
      
      {item.description && (
        <div className="flex items-start gap-2 mb-3 p-2 bg-white/60 dark:bg-gray-800/60 rounded-lg">
          <FileText className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
        </div>
      )}

      {item.months_breakdown && Object.keys(item.months_breakdown).length > 0 && (
        <div className="mb-3 p-2 bg-white/60 dark:bg-gray-800/60 rounded-lg">
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
            <Calendar className="w-3.5 h-3.5" />
            Monthly breakdown
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
            {Object.entries(item.months_breakdown)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([monthKey, amount]) => (
                <div
                  key={monthKey}
                  className="flex justify-between text-gray-700 dark:text-gray-300"
                >
                  <span>{formatMonthLabel(monthKey)}</span>
                  <span className="font-medium">{formatCurrency(amount)}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
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

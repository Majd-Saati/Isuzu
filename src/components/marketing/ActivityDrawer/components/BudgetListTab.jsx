import React, { useState } from 'react';
import { List, Plus, ChevronDown, Loader2, AlertCircle, X } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { BudgetCard } from './BudgetCard';
import { AddBudgetForm } from './AddBudgetForm/index.js';

export const BudgetListTab = ({
  data,
  isLoading,
  isError,
  activityId,
  planId,
  companyId,
  onAcceptBudget,
  onDeclineBudget,
  onDeleteBudget,
  filterType,
  filterStatus,
  onClearFilter,
  activityStartDate,
  activityEndDate,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [isBudgetItemsExpanded, setIsBudgetItemsExpanded] = useState(true);
  const { budget = [], pagination } = data || {};

  // Separate costs by type
  const estimatedCosts = budget.filter(item => item.type === 'estimated cost');
  const actualCosts = budget.filter(item => item.type === 'actual cost');
  const supportCosts = budget.filter(item => item.type === 'support cost');

  // Calculate totals
  const totalEstimated = estimatedCosts.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);
  const totalActual = actualCosts.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);
  const totalSupport = supportCosts.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);

  const hasEstimated = totalEstimated > 0;
  const hasActual = totalActual > 0;
  const hasSupport = totalSupport > 0;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-[#E60012] animate-spin mb-3" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading budget list...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400 mb-3" />
        <p className="text-sm text-red-600 dark:text-red-400">Failed to load budget list</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Budget Button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-[#E60012] bg-[#E60012]/5 dark:bg-[#E60012]/10 border-2 border-dashed border-[#E60012]/30 dark:border-[#E60012]/50 hover:bg-[#E60012]/10 dark:hover:bg-[#E60012]/20 hover:border-[#E60012]/50 dark:hover:border-[#E60012]/70 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add New Budget Entry
        </button>
      )}

      {/* Add Budget Form */}
      {showAddForm && (
        <AddBudgetForm
          activityId={activityId}
          planId={planId}
          companyId={companyId}
          existingBudgets={budget}
          onSuccess={() => setShowAddForm(false)}
          onCancel={() => setShowAddForm(false)}
          activityStartDate={activityStartDate}
          activityEndDate={activityEndDate}
        />
      )}

      {/* Active Filter Notice */}
      {filterType && (
        <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              Filter applied:
            </span>
            <span>
              {filterType}
              {filterStatus ? ` (${filterStatus})` : ''}
            </span>
          </div>
          {onClearFilter && (
            <button
              type="button"
              onClick={onClearFilter}
              className="ml-3 inline-flex items-center justify-center rounded-full p-1 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 transition-colors"
              aria-label="Clear filter"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Summary */}
      {(hasEstimated || hasActual || hasSupport) && (
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4 items-stretch mt-1">
          {hasEstimated && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl px-4 py-3 md:p-4 border border-blue-200 dark:border-blue-800 flex flex-col justify-center text-center shadow-sm">
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">Estimated Total</p>
              <p className="text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-300">{formatCurrency(totalEstimated)}</p>
            </div>
          )}
          {hasActual && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl px-4 py-3 md:p-4 border border-emerald-200 dark:border-emerald-800 flex flex-col justify-center text-center shadow-sm">
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-1">Actual Total</p>
              <p className="text-xl md:text-2xl font-bold text-emerald-700 dark:text-emerald-300">{formatCurrency(totalActual)}</p>
            </div>
          )}
          {hasSupport && (
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl px-4 py-3 md:p-4 border border-purple-200 dark:border-purple-800 flex flex-col justify-center text-center shadow-sm">
              <p className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-1">Support Total</p>
              <p className="text-xl md:text-2xl font-bold text-purple-700 dark:text-purple-300">{formatCurrency(totalSupport)}</p>
            </div>
          )}
        </div>
      )}

      {/* Budget List */}
      {budget.length > 0 ? (
        <div>
          <button
            onClick={() => setIsBudgetItemsExpanded(!isBudgetItemsExpanded)}
            className="w-full flex items-center justify-between mb-3 group"
          >
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <List className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              Budget Items
              <span className="text-xs font-normal text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                {pagination?.total || budget.length}
              </span>
            </h3>
            <ChevronDown 
              className={`w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-transform duration-200 ${
                isBudgetItemsExpanded ? '' : '-rotate-90'
              }`} 
            />
          </button>
          {isBudgetItemsExpanded && (
            <div className="space-y-3 animate-accordion-down">
              {budget.map((item) => (
                <BudgetCard key={item.id} item={item} showCreator={false} onAccept={onAcceptBudget} onDecline={onDeclineBudget} onDelete={onDeleteBudget} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <List className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">No budget items found</p>
        </div>
      )}
    </div>
  );
};

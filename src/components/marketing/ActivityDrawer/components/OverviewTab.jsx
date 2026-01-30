import React, { useState } from 'react';
import { DollarSign, MessageSquare, FileText, Plus, ChevronDown, Loader2, AlertCircle, X } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { BudgetCard } from './BudgetCard';
import { CommentCard } from './CommentCard';
import { AddCommentForm } from './AddCommentForm';
import { AddEvidenceForm } from './AddEvidenceForm';

export const OverviewTab = ({
  data,
  isLoading,
  isError,
  onAcceptBudget,
  onDeleteBudget,
  onDeleteMeta,
  activityId,
  planId,
  companyId,
  filterType,
  filterStatus,
  onClearFilter,
  metaType,
  onClearMetaFilter,
}) => {
  const [showAddCommentForm, setShowAddCommentForm] = useState(false);
  const [showAddEvidenceForm, setShowAddEvidenceForm] = useState(false);
  const [isBudgetExpanded, setIsBudgetExpanded] = useState(false);
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);
  const [isEvidencesExpanded, setIsEvidencesExpanded] = useState(false);
  const { meta = [], budget = [] } = data || {};

  // Filter meta by type
  const comments = meta.filter(item => item.type === 'comment');
  const evidences = meta.filter(item => item.type === 'evidence');

  // Apply same filter logic as Budget tab (client-side) when a filter is active
  const filteredBudget = filterType
    ? budget.filter((item) => {
        const typeMatch = item.type === filterType;
        const statusMatch = !filterStatus
          ? true
          : (item.status || '').toLowerCase() === filterStatus.toLowerCase();
        return typeMatch && statusMatch;
      })
    : budget;

  // Separate costs by type
  const estimatedCosts = filteredBudget.filter(item => item.type === 'estimated cost');
  const actualCosts = filteredBudget.filter(item => item.type === 'actual cost');
  const supportCosts = filteredBudget.filter(item => item.type === 'support cost');
  const invoiceCosts = filteredBudget.filter(item => item.type === 'invoice');

  // Calculate totals
  const totalEstimated = estimatedCosts.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);
  const totalActual = actualCosts.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);
  const totalSupport = supportCosts.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);
  const totalInvoice = invoiceCosts.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);

  const hasEstimated = totalEstimated > 0;
  const hasActual = totalActual > 0;
  const hasSupport = totalSupport > 0;
  const hasInvoice = totalInvoice > 0;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-[#E60012] animate-spin mb-3" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading activity data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400 mb-3" />
        <p className="text-sm text-red-600 dark:text-red-400">Failed to load activity data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Budget Filter Notice */}
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

      {/* Active Meta Type Filter Notice */}
      {metaType && (
        <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 text-xs text-purple-800 dark:text-purple-300">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="font-semibold">
              Filter applied by:
            </span>
            <span className="capitalize">
              {metaType}
            </span>
          </div>
          {onClearMetaFilter && (
            <button
              type="button"
              onClick={onClearMetaFilter}
              className="ml-3 inline-flex items-center justify-center rounded-full p-1 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 transition-colors"
              aria-label="Clear filter"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Summary Cards */}
      <div className={`grid gap-3 md:gap-4 ${metaType === 'evidence' ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {/* Budgets Card */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl px-4 py-3 md:p-4 border border-blue-200 dark:border-blue-800 flex flex-col justify-center text-center shadow-sm">
          <div className="flex items-center justify-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">Budgets</p>
          </div>
          <p className="text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-300">{filteredBudget.length}</p>
        </div>

        {/* Comments Card - Hide when evidence filter is applied */}
        {metaType !== 'evidence' && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl px-4 py-3 md:p-4 border border-emerald-200 dark:border-emerald-800 flex flex-col justify-center text-center shadow-sm">
            <div className="flex items-center justify-center gap-2 mb-1">
              <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Comments</p>
            </div>
            <p className="text-xl md:text-2xl font-bold text-emerald-700 dark:text-emerald-300">{comments.length}</p>
          </div>
        )}

        {/* Evidences Card */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl px-4 py-3 md:p-4 border border-purple-200 dark:border-purple-800 flex flex-col justify-center text-center shadow-sm">
          <div className="flex items-center justify-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <p className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide">Evidences</p>
          </div>
          <p className="text-xl md:text-2xl font-bold text-purple-700 dark:text-purple-300">{evidences.length}</p>
        </div>
      </div>

      {/* Budget Items */}
      {filteredBudget.length > 0 ? (
        <div>
          <button
            onClick={() => setIsBudgetExpanded(!isBudgetExpanded)}
            className="w-full flex items-center justify-between mb-3 group"
          >
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              Budget Entries ({filteredBudget.length})
            </h3>
            <ChevronDown 
              className={`w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-transform duration-200 ${
                isBudgetExpanded ? '' : '-rotate-90'
              }`} 
            />
          </button>
          {isBudgetExpanded && (
            <div className="space-y-3 animate-accordion-down">
              {filteredBudget.map((item) => (
                <BudgetCard key={item.id} item={item} onAccept={onAcceptBudget} onDelete={onDeleteBudget} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <DollarSign className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">No budget entries found</p>
        </div>
      )}

      {/* Comments Section - Hide when evidence filter is applied */}
      {metaType !== 'evidence' && (
        <div>
          <button
            onClick={() => setIsCommentsExpanded(!isCommentsExpanded)}
            className="w-full flex items-center justify-between mb-3 group"
          >
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              Comments ({comments.length})
            </h3>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-transform duration-200 ${
                isCommentsExpanded ? '' : '-rotate-90'
              }`}
            />
          </button>

          {isCommentsExpanded && (
            <>
              {/* Add Comment Button */}
              {!showAddCommentForm && (
                <button
                  onClick={() => setShowAddCommentForm(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-[#E60012] bg-[#E60012]/5 dark:bg-[#E60012]/10 border-2 border-dashed border-[#E60012]/30 dark:border-[#E60012]/50 hover:bg-[#E60012]/10 dark:hover:bg-[#E60012]/20 hover:border-[#E60012]/50 dark:hover:border-[#E60012]/70 transition-all mb-4"
                >
                  <Plus className="w-4 h-4" />
                  Add New Comment
                </button>
              )}

              {/* Add Comment Form */}
              {showAddCommentForm && (
                <div className="mb-4">
                  <AddCommentForm
                    activityId={activityId}
                    planId={planId}
                    companyId={companyId}
                    onSuccess={() => setShowAddCommentForm(false)}
                    onCancel={() => setShowAddCommentForm(false)}
                  />
                </div>
              )}

              {/* Comments List */}
              {comments.length > 0 ? (
                <div className="space-y-3">
                  {comments.map((item, index) => (
                    <CommentCard key={item.id || index} item={item} onDelete={onDeleteMeta} icon={MessageSquare} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <MessageSquare className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No comments yet</p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Evidences Section */}
      <div>
        <button
          onClick={() => setIsEvidencesExpanded(!isEvidencesExpanded)}
          className="w-full flex items-center justify-between mb-3 group"
        >
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            Evidences ({evidences.length})
          </h3>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-transform duration-200 ${
              isEvidencesExpanded ? '' : '-rotate-90'
            }`}
          />
        </button>

        {isEvidencesExpanded && (
          <>
            {/* Add Evidence Button */}
            {!showAddEvidenceForm && (
              <button
                onClick={() => setShowAddEvidenceForm(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-[#E60012] bg-[#E60012]/5 dark:bg-[#E60012]/10 border-2 border-dashed border-[#E60012]/30 dark:border-[#E60012]/50 hover:bg-[#E60012]/10 dark:hover:bg-[#E60012]/20 hover:border-[#E60012]/50 dark:hover:border-[#E60012]/70 transition-all mb-4"
              >
                <Plus className="w-4 h-4" />
                Add New Evidence
              </button>
            )}

            {/* Add Evidence Form */}
            {showAddEvidenceForm && (
              <div className="mb-4">
                <AddEvidenceForm
                  activityId={activityId}
                  planId={planId}
                  companyId={companyId}
                  onSuccess={() => setShowAddEvidenceForm(false)}
                  onCancel={() => setShowAddEvidenceForm(false)}
                />
              </div>
            )}

            {/* Evidences List */}
            {evidences.length > 0 ? (
              <div className="space-y-3">
                {evidences.map((item, index) => (
                  <CommentCard key={item.id || index} item={item} onDelete={onDeleteMeta} icon={FileText} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                <FileText className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No evidences yet</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

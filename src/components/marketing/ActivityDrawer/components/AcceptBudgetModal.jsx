import React from 'react';
import { CheckCircle, Clock, Check, Loader2 } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const AcceptBudgetModal = ({ isOpen, onClose, onConfirm, budget, isLoading }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm z-[10000] transition-opacity duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 dark:from-green-900/20 to-transparent rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Accept Budget</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Confirm budget acceptance</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to accept this budget entry? This action will mark it as approved.
            </p>
            
            {/* Budget Details */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 capitalize">{budget?.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount</span>
                <span className="text-sm font-bold text-green-600 dark:text-green-400">{formatCurrency(budget?.value)}</span>
              </div>
              {budget?.description && (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase block mb-1">Description</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{budget?.description}</p>
                </div>
              )}
            </div>

            {/* Status Change Preview */}
            <div className="mt-4 flex items-center justify-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Pending</span>
              </div>
              <div className="text-gray-400 dark:text-gray-600">→</div>
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">Accepted</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 rounded-b-2xl">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Accepting...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Accept Budget
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

import React from 'react';
import { Send, Users, MapPin } from 'lucide-react';
import { Checkbox } from '@/components/ui/Checkbox';

/**
 * Panel listing all dealers with checkboxes so the admin can pick recipients,
 * then trigger the "Send Reminder" modal.
 */
export const DealerSelectPanel = ({
  dealers,
  isSelected,
  onToggleDealer,
  allSelected,
  onToggleAll,
  selectedCount,
  onSendClick,
}) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-sm p-5 mb-8">
    {/* Header row */}
    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-[#E60012]/10 flex items-center justify-center">
          <Users className="w-5 h-5 text-[#E60012]" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Select dealers
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {selectedCount > 0
              ? `${selectedCount} dealer${selectedCount > 1 ? 's' : ''} selected`
              : 'Check the dealers you want to remind'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer select-none text-sm font-medium text-gray-600 dark:text-gray-300">
          <Checkbox checked={allSelected} onChange={onToggleAll} />
          Select all
        </label>
        <button
          onClick={onSendClick}
          disabled={selectedCount === 0}
          className="flex items-center gap-2 px-6 py-3 bg-[#E60012] text-white rounded-xl text-sm font-semibold hover:bg-[#C00010] transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-[#E60012]"
        >
          <Send className="w-4 h-4" />
          Send Reminder
        </button>
      </div>
    </div>

    {/* Dealer grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {dealers.map((dealer) => {
        const selected = isSelected(dealer.id);
        return (
          <button
            key={dealer.id}
            type="button"
            onClick={() => onToggleDealer(dealer.id)}
            className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
              selected
                ? 'border-[#E60012] bg-[#E60012]/5 shadow-sm'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            {/* Display-only: the whole card handles toggling */}
            <span className="pointer-events-none">
              <Checkbox checked={selected} onChange={() => {}} />
            </span>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E60012] to-[#C00010] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {dealer.label?.charAt(0)?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {dealer.label}
              </div>
              {dealer.location && (
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{dealer.location}</span>
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

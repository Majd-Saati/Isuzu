import React from 'react';
import { Send, MapPin } from 'lucide-react';
import { Checkbox } from '@/components/ui/Checkbox';

/**
 * Panel listing all dealers with checkboxes so the admin can pick recipients,
 * then trigger the "Send Announcement" modal.
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
  <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm mb-6">
    {/* Section header */}
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 px-5 py-4">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#E60012] text-xs font-semibold text-white">
          1
        </span>
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Choose recipients
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {selectedCount > 0
              ? `${selectedCount} dealer${selectedCount > 1 ? 's' : ''} selected`
              : 'Select the dealers who should receive this announcement.'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer select-none text-sm font-medium text-gray-600 dark:text-gray-300">
          <Checkbox checked={allSelected} onChange={onToggleAll} />
          Select all
        </label>
        <button
          onClick={onSendClick}
          disabled={selectedCount === 0}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#E60012] text-white rounded-lg text-sm font-semibold hover:bg-[#C00010] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          Send Announcement
        </button>
      </div>
    </div>

    {/* Dealer grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-5">
      {dealers.map((dealer) => {
        const selected = isSelected(dealer.id);
        return (
          <button
            key={dealer.id}
            type="button"
            onClick={() => onToggleDealer(dealer.id)}
            aria-pressed={selected}
            className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
              selected
                ? 'border-[#E60012] bg-[#E60012]/5'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            {/* Display-only: the whole card handles toggling */}
            <span className="pointer-events-none">
              <Checkbox checked={selected} onChange={() => {}} />
            </span>
            <div className="w-9 h-9 rounded-full bg-[#E60012] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
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
  </section>
);

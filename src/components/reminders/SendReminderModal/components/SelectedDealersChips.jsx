import React from 'react';
import { Building2 } from 'lucide-react';

/**
 * Read-only chips showing which dealers the reminder targets.
 */
export const SelectedDealersChips = ({ dealers = [] }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      Recipients
    </label>
    <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border-2 border-gray-200 dark:border-gray-700">
      {dealers.length === 0 ? (
        <span className="text-sm text-gray-400 dark:text-gray-500">No dealers selected</span>
      ) : (
        dealers.map((dealer) => (
          <span
            key={dealer.id}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E60012]/10 text-[#E60012] text-xs font-medium"
          >
            <Building2 className="w-3.5 h-3.5" />
            {dealer.label}
          </span>
        ))
      )}
    </div>
  </div>
);

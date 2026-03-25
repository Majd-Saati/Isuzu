import React, { useState } from 'react';
import { Building2, Trash2 } from 'lucide-react';
import { formatDate, getCompanyLogoUrl } from '../utils';
import { formatMoneyFromContext } from '@/lib/dashboardMoney';

export const AllocationRow = ({ allocation, onDelete, showDelete = true }) => {
  const [logoError, setLogoError] = useState(false);
  const logoUrl = getCompanyLogoUrl(allocation.company_logo);
  const showLogo = logoUrl && !logoError;
  return (
    <tr className="hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors duration-150">
      <td className="py-3.5 px-4 md:px-6">
        <div className="flex items-center gap-3">
          {showLogo ? (
            <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 border border-gray-200 dark:border-gray-700 ring-1 ring-gray-100 dark:ring-gray-700">
              <img
                src={logoUrl}
                alt=""
                className="w-full h-full object-cover"
                onError={() => setLogoError(true)}
              />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 ring-1 ring-gray-100 dark:ring-gray-700">
              <Building2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
          )}
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[120px] sm:max-w-none">
            {allocation.company_name || '—'}
          </span>
        </div>
      </td>
      <td className="py-3.5 px-4 md:px-6 text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell">
        {allocation.country_name || '—'}
      </td>
      <td className="py-3.5 px-4 md:px-6">
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
          {allocation.currency || '—'}
        </span>
      </td>
      <td className="py-3.5 px-4 md:px-6 text-right tabular-nums">
        <span className="text-sm font-semibold text-[#1F2937] dark:text-gray-200">
          {formatMoneyFromContext(allocation.value)}
        </span>
      </td>
      <td className="py-3.5 px-4 md:px-6 text-right text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell tabular-nums">
        {formatMoneyFromContext(allocation.support_used)}
      </td>
      <td className="py-3.5 px-4 md:px-6 text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
        {formatDate(allocation.creation_date)}
      </td>
      {showDelete && (
        <td className="py-3.5 px-4 md:px-6 text-center">
          <button
            type="button"
            onClick={() => onDelete?.(allocation)}
            disabled={allocation.can_delete === false}
            title={allocation.can_delete === false ? 'Cannot delete this allocation' : 'Delete allocation'}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-gray-400 dark:disabled:hover:text-gray-500 disabled:hover:bg-transparent"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </td>
      )}
    </tr>
  );
};

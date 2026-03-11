import React, { useState } from 'react';
import { Building2 } from 'lucide-react';
import { formatNumber, formatDate, getCompanyLogoUrl } from '../utils';

export const AllocationRow = ({ allocation }) => {
  const [logoError, setLogoError] = useState(false);
  const logoUrl = getCompanyLogoUrl(allocation.company_logo);
  const showLogo = logoUrl && !logoError;
  return (
    <tr className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200">
      <td className="py-4 px-4 md:px-6">
        <div className="flex items-center gap-3">
          {showLogo ? (
            <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 border border-gray-200 dark:border-gray-700 relative">
              <img
                src={logoUrl}
                alt=""
                className="w-full h-full object-cover"
                onError={() => setLogoError(true)}
              />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
          )}
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[120px] sm:max-w-none">
            {allocation.company_name || '—'}
          </span>
        </div>
      </td>
      <td className="py-4 px-4 md:px-6 text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell">
        {allocation.country_name || '—'}
      </td>
      <td className="py-4 px-4 md:px-6">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {allocation.currency || '—'}
        </span>
      </td>
      <td className="py-4 px-4 md:px-6 text-right">
        <span className="text-sm font-semibold text-[#1F2937] dark:text-gray-200">
          {formatNumber(allocation.value)}
        </span>
      </td>
      <td className="py-4 px-4 md:px-6 text-right text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">
        {formatNumber(allocation.support_used)}
      </td>
      <td className="py-4 px-4 md:px-6 text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
        {formatDate(allocation.creation_date)}
      </td>
    </tr>
  );
};

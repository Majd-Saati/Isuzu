import React from 'react';
import { Building2, Globe } from 'lucide-react';

const LOGO_BASE = 'https://marketing.5v.ae/';

export const CalendarCompanyCard = ({ company, currency = 'AED' }) => {
  if (!company) return null;

  return (
    <div className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-900 rounded-2xl border-2 border-green-200 dark:border-green-800 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        {company.logo ? (
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white dark:bg-gray-800 flex items-center justify-center border-2 border-green-200 dark:border-green-800 relative">
            <img
              src={`${LOGO_BASE}${company.logo}`}
              alt={company.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                const fallback = e.target.nextElementSibling;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="w-full h-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center hidden" style={{ position: 'absolute', inset: 0 }}>
              <Building2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
        )}
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Company Information</h3>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between py-2 border-b border-green-100 dark:border-green-900/40">
          <span className="text-sm text-gray-600 dark:text-gray-400">Name</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{company.name}</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-green-100 dark:border-green-900/40">
          <span className="text-sm text-gray-600 dark:text-gray-400">Country</span>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{company.country_name}</span>
          </div>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Currency</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{currency}</span>
        </div>
      </div>
    </div>
  );
};

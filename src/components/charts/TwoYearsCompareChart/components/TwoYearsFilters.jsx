import React from 'react';
import { Calendar, Building2 } from 'lucide-react';
import { YEAR_OPTIONS } from '../constants';

export const TwoYearsFilters = ({
  year1,
  year2,
  companyId,
  companies,
  onYear1Change,
  onYear2Change,
  onCompanyChange,
  isAdmin,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4 p-5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/10 border-2 border-blue-200 dark:border-blue-800 shadow-sm">
      {isAdmin && (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-700">
            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Company</label>
            <select
              value={companyId}
              onChange={(e) => onCompanyChange(e.target.value)}
              className="px-3 py-1.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 min-w-[180px] cursor-pointer"
            >
              <option value="all">All companies</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 border-l-2 border-blue-300 dark:border-blue-700 pl-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-700">
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Year 1</label>
            <select
              value={year1}
              onChange={(e) => onYear1Change(Number(e.target.value))}
              className="px-3 py-1.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 min-w-[120px] cursor-pointer"
            >
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Year 2</label>
          <select
            value={year2}
            onChange={(e) => onYear2Change(Number(e.target.value))}
            className="px-3 py-1.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 min-w-[120px] cursor-pointer"
          >
            {YEAR_OPTIONS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

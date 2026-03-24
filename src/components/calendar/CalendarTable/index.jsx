import React from 'react';
import { Info } from 'lucide-react';
import { CalendarMonthCell } from './CalendarMonthCell';

export const CalendarTable = ({ plans = [], months = [], isAdmin = false, currencyCode = '' }) => {
  if (plans.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-sm p-12 text-center">
        <Info className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No plans found for the selected term and company.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 border-b-2 border-gray-200 dark:border-gray-700">
              <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 sticky left-0 bg-gray-50 dark:bg-gray-800 z-10 uppercase tracking-wide min-w-[180px]">
                Plan
              </th>
              <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 uppercase tracking-wide min-w-[200px]">
                Activity
              </th>
              {months.map((month) => (
                <th
                  key={month.key}
                  className="px-4 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 uppercase tracking-wide min-w-[140px]"
                >
                  <div className="flex flex-col">
                    <span>{month.label}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => {
              const activities = plan.activities || [];
              return activities.map((activity, activityIdx) => {
                const monthData = activity.monthly || {};
                const hasData = (m) => {
                  const d = monthData[m.key] || {};
                  return (parseFloat(d.actual_cost) || 0) > 0 || (parseFloat(d.support_cost) || 0) > 0;
                };
                const cellBg = (m) =>
                  hasData(m) ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50';

                return (
                  <tr
                    key={`${plan.plan_id}-${activity.activity_id}`}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-150"
                  >
                    {activityIdx === 0 && (
                      <td
                        rowSpan={activities.length}
                        className="px-5 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700 align-top sticky left-0 bg-white dark:bg-gray-900 z-5"
                      >
                        <div className="flex flex-col">
                          <span className="text-[#E60012] dark:text-red-400 font-bold">{plan.plan_name}</span>
                          {plan.description && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{plan.description}</span>
                          )}
                          <span
                            className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block w-fit ${
                              plan.status === 1
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                            }`}
                          >
                            {plan.status === 1 ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                    )}
                    <td className="px-5 py-4 text-sm font-medium text-[#D22827] dark:text-red-400 border-r border-gray-200 dark:border-gray-700">
                      {activity.activity_name}
                    </td>
                    {months.map((month) => (
                      <td
                        key={month.key}
                        className={`px-4 py-4 border-r border-gray-200 dark:border-gray-700 ${cellBg(month)}`}
                      >
                        <CalendarMonthCell
                          monthData={monthData[month.key] || {}}
                          isAdmin={isAdmin}
                          currencyCode={currencyCode}
                        />
                      </td>
                    ))}
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Building2 } from 'lucide-react';
import { useCharts } from '@/hooks/api/useCharts';
import { useCompanies } from '@/hooks/api/useCompanies';
import { DealerEfficiencyChart } from '@/components/dashboard/DealerEfficiencyChart';
import { format, parseISO } from 'date-fns';

const DEFAULT_MONTH = '2026-04';
const DEFAULT_TERM_ID = 1;

const buildChartData = (totals, title) => {
  const actual = totals ? Number(totals.actual_cost) || 0 : 0;
  const support = totals ? Number(totals.support_cost) || 0 : 0;
  const percentage = actual > 0 ? Math.min(100, (support / actual) * 100) : 0;
  return {
    title,
    startValue: 0,
    endValue: actual || 1,
    amount: actual || 1,
    percentage,
    support_cost: support,
    color: '#EF5A6F',
    legendLabel: 'Actual Cost',
  };
};

const monthLabel = (monthStr) => {
  try {
    const d = parseISO(`${monthStr}-01`);
    return format(d, 'MMM yyyy');
  } catch {
    return monthStr;
  }
};

export const DealerExpenseSupportSection = () => {
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.is_admin === '1' || user?.is_admin === 1;

  const [companyId, setCompanyId] = useState(isAdmin ? 'all' : String(user?.id|| ''));
  const [month] = useState(DEFAULT_MONTH);

  const { data: companiesData } = useCompanies({ perPage: 100 }, { enabled: isAdmin });
  const companies = companiesData?.companies ?? [];

  useEffect(() => {
    if (!isAdmin && user?.id) setCompanyId(String(user.id));
  }, [isAdmin, user]);

  const paramsByTerm = { company_id: isAdmin ? companyId : user?.id, term_id: DEFAULT_TERM_ID };
  const paramsByMonth = { company_id: isAdmin ? companyId : user?.id, month };

  const { data: dataByTerm, isLoading: loadingTerm } = useCharts(paramsByTerm);
  const { data: dataByMonth, isLoading: loadingMonth } = useCharts(paramsByMonth);

  const chartDataTerm = buildChartData(dataByTerm?.totals, `By Term (Term ${DEFAULT_TERM_ID})`);
  const chartDataMonth = buildChartData(dataByMonth?.totals, `By Month (${monthLabel(month)})`);

  const isLoading = loadingTerm || loadingMonth;

  return (
    <div className="mb-12 space-y-6">
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 bg-gradient-to-b from-[#EF5A6F] to-rose-400 rounded-full" />
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
              Dealer Expense vs Support Amount
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Actual cost (scale) and support cost (fill) by term and month
            </p>
          </div>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#E60012]" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Company</span>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E60012]/50 focus:border-[#E60012] min-w-[180px] cursor-pointer"
            >
              <option value="all">All companies</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            <div className="h-[380px] rounded-none border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 animate-pulse" />
            <div className="h-[380px] rounded-none border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 animate-pulse" />
          </>
        ) : (
          <>
            <DealerEfficiencyChart chartId="by-term" data={chartDataTerm} />
            <DealerEfficiencyChart chartId="by-month" data={chartDataMonth} />
          </>
        )}
      </div>
    </div>
  );
};

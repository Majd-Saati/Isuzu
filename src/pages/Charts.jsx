import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { DealerEfficiencyChart } from '@/components/dashboard/DealerEfficiencyChart';
import { DealerEfficiencyChartSkeleton } from '@/components/dashboard/DealerEfficiencyChartSkeleton';
import { DealerEfficiencyChartEmpty } from '@/components/dashboard/DealerEfficiencyChartEmpty';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { PerformanceChartSkeleton } from '@/components/dashboard/PerformanceChartSkeleton';
import { PerformanceChartEmpty } from '@/components/dashboard/PerformanceChartEmpty';
import { ReportingTable } from '@/components/dashboard/ReportingTable';
import { ReportingTableSkeleton } from '@/components/dashboard/ReportingTableSkeleton';
import { ReportingTableEmpty } from '@/components/dashboard/ReportingTableEmpty';
import { MarketingChartsSection, YearlyExpenseChart, TwoYearsCompareChart } from '@/components/charts';
import { SectionNav } from '@/components/SectionNav';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import { useCharts } from '@/hooks/api/useCharts';
import { useTerms } from '@/hooks/api/useTerms';
import { useCompanies } from '@/hooks/api/useCompanies';
import { format, parseISO } from 'date-fns';
import { Calendar, ClipboardList, Building2 } from 'lucide-react';
import { isAdminUser } from '@/lib/permissions';
import { useCurrency } from '@/contexts/CurrencyContext';

const getDefaultMonth = () => format(new Date(), 'yyyy-MM');

const buildDealerChartData = (totals, title) => {
  if (!totals) return null;
  const actual = Number(totals.actual_cost) || 0;
  const support = Number(totals.support_cost) || 0;
  const percentage = actual > 0 ? Math.min(100, (support / actual) * 100) : 0;
  return {
    title,
    startValue: 0,
    endValue: actual || 1,
    amount: actual || 1,
    percentage,
    support_cost: support,
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

const chartCardClass =
  'bg-white dark:bg-gray-900 rounded-none p-6 md:p-7 w-full border border-gray-100 dark:border-gray-800 shadow-[0px_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0px_6px_24px_rgba(0,0,0,0.3)] hover:shadow-[0px_8px_32px_rgba(0,0,0,0.12)] dark:hover:shadow-[0px_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 animate-fade-in';

const selectClass =
  'px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E60012]/50 focus:border-[#E60012] min-w-[160px] cursor-pointer';

const DealerEfficiencyChartByMonth = () => {
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.is_admin === '1' || user?.is_admin === 1;
  const { currency } = useCurrency();

  const [month, setMonth] = useState('');
  const [companyId, setCompanyId] = useState(isAdmin ? '' : String(user?.id || ''));
  const { data: companiesData } = useCompanies({ perPage: 100 }, { enabled: isAdmin });
  const companies = companiesData?.companies ?? [];

  useEffect(() => {
    if (!isAdmin && user?.id) setCompanyId(String(user.id));
  }, [isAdmin, user]);

  // ref for month input so clicking the container can open the picker
  const monthInputRef = useRef(null);

  const { data, isLoading, isError } = useCharts(
    { company_id: isAdmin ? (companyId || undefined) : user?.id, month: month || undefined },
    { enabled: !!month }
  );
  const chartData = buildDealerChartData(data?.totals, `By Month (${monthLabel(month)})`);

  const monthFilter = (
    <div className="flex flex-row flex-wrap gap-6">
      {isAdmin && (
        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#E60012]" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Company</span>
          </div>
          <select
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            className={selectClass}
          >
            <option value="">Select company</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-white" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Month</span>
        </div>
        <div
          className="w-full"
          onClick={() => {
            if (monthInputRef?.current) {
              const el = monthInputRef.current;
              if (typeof el.showPicker === 'function') el.showPicker();
              else el.focus();
            }
          }}
        >
          <input
            ref={monthInputRef}
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E60012]/50 focus:border-[#E60012] cursor-pointer w-full"
          />
        </div>
      </div>
    </div>
  );

  if (!month) {
    return (
      <div className={`${chartCardClass} max-w-lg`}>
        <p className="text-[#78716c] dark:text-gray-400 text-sm font-semibold mb-3">By Month (—)</p>
        {monthFilter}
        <div className="flex flex-col items-center justify-center py-12 text-center mt-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Select a month to view data.</p>
        </div>
      </div>
    );
  }

  if (isError || (!isLoading && !chartData)) {
    return (
      <div className={`${chartCardClass} max-w-lg`}>
        <p className="text-[#78716c] dark:text-gray-400 text-sm font-semibold mb-3">By Month ({monthLabel(month)})</p>
        {monthFilter}
        <div className="flex flex-col items-center justify-center py-12 text-center mt-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">No data available for this month.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <DealerEfficiencyChart
        chartId="charts-month-api"
        data={chartData ?? { title: `By Month (${monthLabel(month)})` }}
        filter={monthFilter}
        isLoading={isLoading}
        showTitle={false}
        isAdmin={isAdmin}
        currencyCode={currency}
      />
    </div>
  );
};

const DealerEfficiencyChartByTerm = () => {
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.is_admin === '1' || user?.is_admin === 1;
  const { currency } = useCurrency();

  const { data: termsData } = useTerms({ perPage: 100 });
  const { data: companiesData } = useCompanies({ perPage: 100 }, { enabled: isAdmin });
  const terms = termsData?.terms ?? [];
  const companies = companiesData?.companies ?? [];
  const [termId, setTermId] = useState('');
  const [companyId, setCompanyId] = useState(isAdmin ? '' : String(user?.id || ''));

  useEffect(() => {
    if (!isAdmin && user?.id) setCompanyId(String(user.id));
  }, [isAdmin, user]);

  const { data, isLoading, isError } = useCharts(
    { company_id: isAdmin ? (companyId || undefined) : user?.id, term_id: termId || undefined },
    { enabled: !!termId }
  );
  const selectedTerm = terms.find((t) => String(t.id) === String(termId));
  const termLabel = selectedTerm?.name || (termId ? `Term ${termId}` : 'Select term');
  const chartData = buildDealerChartData(data?.totals, `By Term (${termLabel})`);

  const termFilter = (
    <div className="flex flex-row flex-wrap gap-6">
      {isAdmin && (
        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#E60012]" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Company</span>
        </div>
        <select
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          className={selectClass}
        >
          <option value="">Select company</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        </div>
      )}
      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-[#E60012]" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Term</span>
        </div>
        <select
          value={termId}
          onChange={(e) => setTermId(e.target.value)}
          className={selectClass}
        >
          <option value="">Select term</option>
          {terms.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name || `Term ${t.id}`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const cardContent = (
    <>
      <p className="text-[#78716c] dark:text-gray-400 text-sm font-semibold mb-3">
        By Term ({termId ? termLabel : '—'})
      </p>
      {termFilter}
    </>
  );

  if (!termId) {
    return (
      <div className={`${chartCardClass} max-w-lg`}>
        {cardContent}
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Select a term to view data.</p>
        </div>
      </div>
    );
  }

  if (isError || (!isLoading && !chartData)) {
    return (
      <div className={`${chartCardClass} max-w-lg`}>
        {cardContent}
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">No data available for this term.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <DealerEfficiencyChart
        chartId="charts-term-api"
        data={chartData ?? { title: `By Term (${termLabel})` }}
        filter={termFilter}
        isLoading={isLoading}
        showTitle={false}
        isAdmin={isAdmin}
        currencyCode={currency}
      />
    </div>
  );
};

const Charts = () => {
  const user = useSelector((state) => state.auth.user);
  const isAdmin = isAdminUser(user);
  const { currency } = useCurrency();

  const [efficiencyChartsState, setEfficiencyChartsState] = useState('loading'); // 'loading' | 'empty' | 'data'
  const [performanceChartState, setPerformanceChartState] = useState('loading'); // 'loading' | 'empty' | 'data'
  const [reportingState, setReportingState] = useState('loading'); // 'loading' | 'empty' | 'data'

  // Simulate data loading
  useEffect(() => {
    setTimeout(() => {
      setEfficiencyChartsState('data'); // Change to 'empty' to test empty state
      setPerformanceChartState('data'); // Change to 'empty' to test empty state
      setReportingState('data'); // Change to 'empty' to test empty state
    }, 1500);
  }, []);

  const renderEfficiencyCharts = () => {
    switch (efficiencyChartsState) {
      case 'loading':
        return (
          <>
            <DealerEfficiencyChartSkeleton />
            <DealerEfficiencyChartSkeleton />
          </>
        );
      case 'empty':
        return (
          <>
            <DealerEfficiencyChartEmpty title="Expense Dealer Vs Support Amount" />
            <DealerEfficiencyChartEmpty title="Budget Allocation Vs Support Amount" />
          </>
        );
      case 'data':
        return (
          <>
            {/* <DealerEfficiencyChart data={expenseData} />
            <DealerEfficiencyChart data={budgetData} /> */}
          </>
        );
      default:
        return (
          <>
            <DealerEfficiencyChart data={expenseData} isAdmin={isAdmin} currencyCode={currency} />
            <DealerEfficiencyChart data={budgetData} isAdmin={isAdmin} currencyCode={currency} />
          </>
        );
    }
  };

  const renderPerformanceChart = () => {
    switch (performanceChartState) {
      case 'loading':
        return <PerformanceChartSkeleton />;
      case 'empty':
        return <PerformanceChartEmpty />;
      case 'data':
        return <PerformanceChart />;
      default:
        return <PerformanceChart />;
    }
  };

  const renderReportingSection = () => {
    switch (reportingState) {
      case 'loading':
        return <ReportingTableSkeleton />;
      case 'empty':
        return <ReportingTableEmpty />;
      case 'data':
        return <ReportingTable />;
      default:
        return <ReportingTable />;
    }
  };

  const expenseData = {
    title: 'Expense Dealer Vs Support Amount',
    amount: 4200,
    percentage: 60,
    color: '#4A90E2',
    legendLabel: 'Expense'
  };

  const budgetData = {
    title: 'Budget Allocation Vs Support Amount',
    amount: 5950,
    percentage: 70,
    color: '#EF5A6F',
    legendLabel: 'Budget'
  };

  const chartsSections = [
    { id: 'dealer-efficiency', label: 'Dealer Efficiency' },
    { id: 'marketing-charts', label: 'Marketing Charts' },
    { id: 'yearly-expense', label: 'Yearly Expense' },
    { id: 'two-years-compare', label: 'Two Years Compare' },
    { id: 'efficiency-charts', label: 'Efficiency Charts' },
    { id: 'reporting-table', label: 'Reporting Table' },
  ];

  return (
    <>
      <SectionNav sections={chartsSections} />
      <div>
        {/* Page Header */}
        <div className="pt-6 pb-8 mb-8 border-b-2 border-gray-100 dark:border-gray-800">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 pb-4 border-b-4 border-[#E60012] inline-block">
            Charts
          </h1>
        </div>

        {/* Dealer Efficiency - by month and by term, side by side */}
        <section id="dealer-efficiency" className="pb-12 border-b border-gray-200 dark:border-gray-700">
          <SectionHeader title="Dealer Efficiency" />
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DealerEfficiencyChartByMonth />
            <DealerEfficiencyChartByTerm />
          </div>
        </section>

        {/* Marketing API Charts - month or term_id */}
        <section id="marketing-charts" className="py-12 border-b border-gray-200 dark:border-gray-700">
          <MarketingChartsSection />
        </section>

        {/* Yearly Expense Chart - by year */}
        <section id="yearly-expense" className="py-12 border-b border-gray-200 dark:border-gray-700">
          <YearlyExpenseChart />
        </section>

        {/* Two years comparison - Support cost (JPY) */}
        <section id="two-years-compare" className="py-12 border-b border-gray-200 dark:border-gray-700">
          <TwoYearsCompareChart />
        </section>

        {/* First Section - Two Charts Side by Side */}
        <section id="efficiency-charts" className="py-12 border-b border-gray-200 dark:border-gray-700">
          <SectionHeader title="Efficiency Charts" />
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderEfficiencyCharts()}
          </div>
        </section>

      {/* Second Section - Bar Chart */}
      {/* <div className="mb-8">
        {renderPerformanceChart()}
      </div> */}

        {/* Third Section - Reporting Table */}
        <section id="reporting-table" className="pt-12">
          {renderReportingSection()}
        </section>
      </div>
    </>
  );
};
  
  export default Charts;

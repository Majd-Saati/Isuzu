import React, { useState, useEffect } from 'react';
import { DealerEfficiencyChart } from '@/components/dashboard/DealerEfficiencyChart';
import { DealerEfficiencyChartSkeleton } from '@/components/dashboard/DealerEfficiencyChartSkeleton';
import { DealerEfficiencyChartEmpty } from '@/components/dashboard/DealerEfficiencyChartEmpty';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { PerformanceChartSkeleton } from '@/components/dashboard/PerformanceChartSkeleton';
import { PerformanceChartEmpty } from '@/components/dashboard/PerformanceChartEmpty';
import { ReportingTable } from '@/components/dashboard/ReportingTable';
import { ReportingTableSkeleton } from '@/components/dashboard/ReportingTableSkeleton';
import { ReportingTableEmpty } from '@/components/dashboard/ReportingTableEmpty';
import { MarketingChartsSection, YearlyExpenseChart } from '@/components/charts';
import { useCharts } from '@/hooks/api/useCharts';
import { useTerms } from '@/hooks/api/useTerms';
import { useCompanies } from '@/hooks/api/useCompanies';
import { format, parseISO } from 'date-fns';
import { Calendar, ClipboardList, Building2 } from 'lucide-react';

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
  const [month, setMonth] = useState('');
  const [companyId, setCompanyId] = useState('');
  const { data: companiesData } = useCompanies({ perPage: 100 });
  const companies = companiesData?.companies ?? [];
  const { data, isLoading, isError } = useCharts(
    { company_id: companyId || undefined, month: month || undefined },
    { enabled: !!month }
  );
  const chartData = buildDealerChartData(data?.totals, `By Month (${monthLabel(month)})`);

  const monthFilter = (
    <div className="flex flex-row flex-wrap gap-6">
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
      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#E60012]" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Month</span>
        </div>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E60012]/50 focus:border-[#E60012] cursor-pointer"
        />
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
      />
    </div>
  );
};

const DealerEfficiencyChartByTerm = () => {
  const { data: termsData } = useTerms({ perPage: 100 });
  const { data: companiesData } = useCompanies({ perPage: 100 });
  const terms = termsData?.terms ?? [];
  const companies = companiesData?.companies ?? [];
  const [termId, setTermId] = useState('');
  const [companyId, setCompanyId] = useState('');

  const { data, isLoading, isError } = useCharts(
    { company_id: companyId || undefined, term_id: termId || undefined },
    { enabled: !!termId }
  );
  const selectedTerm = terms.find((t) => String(t.id) === String(termId));
  const termLabel = selectedTerm?.name || (termId ? `Term ${termId}` : 'Select term');
  const chartData = buildDealerChartData(data?.totals, `By Term (${termLabel})`);

  const termFilter = (
    <div className="flex flex-row flex-wrap gap-6">
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
      />
    </div>
  );
};

const Charts = () => {
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
            <DealerEfficiencyChart data={expenseData} />
            <DealerEfficiencyChart data={budgetData} />
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

  return (
    <>
      {/* Page Header */}
      <div className="pt-6 pb-8 mb-8 border-b-2 border-gray-100 dark:border-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 pb-4 border-b-4 border-[#E60012] inline-block">
          Charts
        </h1>
      </div>

      {/* Dealer Efficiency - by month and by term, side by side */}
      <section className="pb-12 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-7 w-1 shrink-0 rounded-full bg-gradient-to-b from-[#EF5A6F] to-rose-400" />
          <h2 className="text-[#1F2937] dark:text-gray-100 text-xl font-bold tracking-tight">
            Dealer Efficiency
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DealerEfficiencyChartByMonth />
          <DealerEfficiencyChartByTerm />
        </div>
      </section>

      {/* Marketing API Charts - month or term_id */}
      <section className="py-12 border-b border-gray-200 dark:border-gray-700">
        <MarketingChartsSection />
      </section>

      {/* Yearly Expense Chart - by year */}
      <section className="py-12 border-b border-gray-200 dark:border-gray-700">
        <YearlyExpenseChart />
      </section>

      {/* First Section - Two Charts Side by Side */}
      <section className="py-12 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderEfficiencyCharts()}
        </div>
      </section>

      {/* Second Section - Bar Chart */}
      {/* <div className="mb-8">
        {renderPerformanceChart()}
      </div> */}

      {/* Third Section - Reporting Table */}
      <section className="pt-12">
        {renderReportingSection()}
      </section>
    </>
  );
};
  
  export default Charts;

import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { OverviewTable } from '@/components/dashboard/OverviewTable';
import { OverviewTableSkeleton } from '@/components/dashboard/OverviewTableSkeleton';
import { OverviewTableEmpty } from '@/components/dashboard/OverviewTableEmpty';
import { DealerCard } from '@/components/dashboard/DealerCard';
import { DealerCardSkeleton } from '@/components/dashboard/DealerCardSkeleton';
import { DealerCardsEmpty } from '@/components/dashboard/DealerCardsEmpty';
import { SectionTitle } from '@/components/dashboard/SectionTitle';
import { useOverview } from '@/hooks/api/useOverview';
import { DealerEfficiencyChart } from '@/components/dashboard/DealerEfficiencyChart';
import { DealerEfficiencyChartSkeleton } from '@/components/dashboard/DealerEfficiencyChartSkeleton';
import { DealerEfficiencyChartEmpty } from '@/components/dashboard/DealerEfficiencyChartEmpty';
import { ReportingTable } from '@/components/dashboard/ReportingTable';
import { ReportingTableSkeleton } from '@/components/dashboard/ReportingTableSkeleton';
import { ReportingTableEmpty } from '@/components/dashboard/ReportingTableEmpty';
import { MarketingChartsSection, YearlyExpenseChart } from '@/components/charts';
import { useCharts } from '@/hooks/api/useCharts';
import { useTerms } from '@/hooks/api/useTerms';
import { useCompanies } from '@/hooks/api/useCompanies';
import { format, parseISO } from 'date-fns';
import { Calendar, ClipboardList, Building2 } from 'lucide-react';



const getLogoUrl = (path) => {

  if (!path) return null;

  if (path.startsWith('http')) return path;

  return `https://marketing.5v.ae/${path}`;

};

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
        chartId="dashboard-month-api"
        data={chartData ?? { title: `By Month (${monthLabel(month)})` }}
        filter={monthFilter}
        isLoading={isLoading}
        showTitle={false}
      />
    </div>
  );
};

const DealerEfficiencyChartByTerm = () => {
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.is_admin === '1' || user?.is_admin === 1;
  
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
        chartId="dashboard-term-api"
        data={chartData ?? { title: `By Term (${termLabel})` }}
        filter={termFilter}
        isLoading={isLoading}
        showTitle={false}
      />
    </div>
  );
};



const Index = () => {

  const { data, isLoading, isError } = useOverview();



  const recentItems = data?.recentOperations || [];

  const dealers = data?.dealersSummary || [];



  const renderOverviewSection = () => {

    if (isLoading) {

      return <OverviewTableSkeleton />;

    }



    if (isError) {

      return (

        <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-red-200 dark:border-red-800 shadow-sm p-8 text-center">

          <p className="text-red-600 dark:text-red-400 font-medium">Failed to load overview. Please try again.</p>

        </div>

      );

    }



    if (!recentItems.length) {

      return <OverviewTableEmpty />;

    }



    const mappedItems = recentItems.map((item) => ({

      ...item,

      company_logo: getLogoUrl(item.company_logo),

    }));



    return <OverviewTable items={mappedItems} />;

  };



  const renderDealersSection = () => {

    if (isLoading) {

      return (

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">

          {[...Array(6)].map((_, index) => (

            <DealerCardSkeleton key={index} />

          ))}

        </div>

      );

    }



    if (isError) {

      return (

        <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-red-200 dark:border-red-800 shadow-sm p-8 text-center">

          <p className="text-red-600 dark:text-red-400 font-medium">Failed to load dealers summary. Please try again.</p>

        </div>

      );

    }



    if (!dealers.length) {

      return <DealerCardsEmpty />;

    }



    const mappedDealers = dealers.map((dealer) => {

      const terms = Array.isArray(dealer.terms)

        ? [...dealer.terms].sort((a, b) => {

            if (!a.start_date || !b.start_date) return 0;

            return new Date(b.start_date) - new Date(a.start_date);

          })

        : [];



      const termSummaries = terms.map((term) => ({

        label: term.term_name,

        plans: term.plans_count || 0,

      }));



      const support = dealer.costs?.support_cost_total ?? 0;

      const expense = dealer.costs?.actual_cost_total ?? 0;

      const estimatedCost = dealer.costs?.estimated_cost_total ?? 0;

      const invoiceTotal = dealer.costs?.invoice_total ?? 0;

      const totalCost = dealer.costs?.total_cost ?? 0;



      return {

        name: dealer.company_name,

        avatar: getLogoUrl(dealer.logo),

        flag: getLogoUrl(dealer.logo),

        terms: termSummaries,

        support,

        expense,

        estimatedCost,

        invoiceTotal,

        totalCost,

      };

    });



    return (

      <>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">

          {mappedDealers.map((dealer, index) => (

            <DealerCard key={index} {...dealer} />

          ))}

        </div>



        {/* <div className="hidden md:flex justify-center mt-8">

          <button className="group bg-gradient-to-br from-white to gray-50 shadow-[0px_4px_12px_-3px_rgba(58,77,233,0.2)] flex items-center gap-2 px-6 py-3 rounded-[22px] hover:shadow-[0px_6px_20px_-3px_rgba(58,77,233,0.3)] hover:scale-105 transition-all duration-300 border border-gray-100">

            <span className="text-[#374151] text-sm font-semibold">View More Dealers</span>

            <img

              src="https://api.builder.io/api/v1/image/assets/132ea46dcd5a44718cd3517d9e4e8249/5266b22c25a9e6e94988b2837411a5840c3c688c?placeholderIfAbsent=true"

              className="aspect-[0.5] object-contain w-1.5 group-hover:translate-y-1 transition-transform"

              alt="More options"

            />

          </button>

        </div> */}

      </>

    );

  };



  return (

    <div className="flex w-full flex-col items-stretch mt-[19px] px-5 max-w-full">

      {/* Dealer Efficiency - by month and by term, side by side */}
      <section className="mt-[38px] max-md:mt-8 pb-12 border-b border-gray-200 dark:border-gray-700">
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

      {/* Reporting Table */}
      <section className="py-12 border-b border-gray-200 dark:border-gray-700">
        <ReportingTable />
      </section>

      <div className="mt-[52px] max-md:mt-10">

        <SectionTitle title="Overview Recently" />

      </div>



      <div className="mt-6 md:mt-8">

        {renderOverviewSection()}

      </div>



      <div className="mt-[52px] max-md:mt-10">

        <SectionTitle title="ISUZU Dealers" showButton={true} />

      </div>



      <div className="mt-7 md:mt-9">

        {renderDealersSection()}

      </div>

    </div>

  );

};



export default Index;


import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { OverviewRecentlySection } from '@/components/dashboard/OverviewRecentlySection';
import { DealerCard } from '@/components/dashboard/DealerCard';
import { DealerCardSkeleton } from '@/components/dashboard/DealerCardSkeleton';
import { DealerCardsEmpty } from '@/components/dashboard/DealerCardsEmpty';
import { SectionTitle } from '@/components/dashboard/SectionTitle';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import { useOverview } from '@/hooks/api/useOverview';
import { DealerEfficiencyChart } from '@/components/dashboard/DealerEfficiencyChart';
import { DealerEfficiencyChartSkeleton } from '@/components/dashboard/DealerEfficiencyChartSkeleton';
import { DealerEfficiencyChartEmpty } from '@/components/dashboard/DealerEfficiencyChartEmpty';
import { ReportingTable } from '@/components/dashboard/ReportingTable';
import { ReportingTableSkeleton } from '@/components/dashboard/ReportingTableSkeleton';
import { ReportingTableEmpty } from '@/components/dashboard/ReportingTableEmpty';
import { MarketingChartsSection, TwoYearsCompareChart } from '@/components/charts';
import { SectionNav } from '@/components/SectionNav';
import { useCharts } from '@/hooks/api/useCharts';
import { useTerms } from '@/hooks/api/useTerms';
import { useCompanies } from '@/hooks/api/useCompanies';
import { ClipboardList, Building2, Calendar } from 'lucide-react';
import { isAdminUser } from '@/lib/permissions';
import { useCurrency } from '@/contexts/CurrencyContext';
import { buildMediaUrl } from '@/lib/api/config';

const getLogoUrl = (path) => buildMediaUrl(path);

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

const buildSupportVsAllocationChartData = (totals, allocationSource, title) => {
  if (!totals) return null;
  const allocatedBudget = Number(allocationSource?.allocated_budget_total_jpy) || 0;
  const support = Number(totals.support_cost) || 0;
  const percentage = allocatedBudget > 0 ? Math.min(100, (support / allocatedBudget) * 100) : 0;
  return {
    title,
    startValue: 0,
    endValue: allocatedBudget || 1,
    amount: allocatedBudget || 1,
    percentage,
    support_cost: support,
  };
};

const chartCardClass =
  'bg-white dark:bg-gray-900 rounded-none p-6 md:p-7 w-full border border-gray-100 dark:border-gray-800 shadow-[0px_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0px_6px_24px_rgba(0,0,0,0.3)] hover:shadow-[0px_8px_32px_rgba(0,0,0,0.12)] dark:hover:shadow-[0px_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 animate-fade-in';

const selectClass =
  'px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E60012]/50 focus:border-[#E60012] min-w-[160px] cursor-pointer';

const DealerSupportChartsSection = () => {
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

  const dealerChartData = buildDealerChartData(data?.totals, `By Term (${termLabel})`);
  const supportChartData = buildSupportVsAllocationChartData(
    data?.totals,
    data?.term_budget_vs_support,
    `By Term (${termLabel})`
  );

  // Single shared Company + Term filter toolbar, linked to both charts below
  const filter = (
    <div className="flex flex-wrap items-end gap-4 w-full max-w-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-5 py-4 shadow-[0px_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0px_6px_24px_rgba(0,0,0,0.3)]">
      {isAdmin && (
        <div className="flex flex-col gap-1.5 min-w-[200px] flex-1">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Building2 className="w-4 h-4 text-[#E60012]" />
            Company
          </label>
          <select
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            className={`${selectClass} w-full`}
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
      <div className="flex flex-col gap-1.5 min-w-[200px] flex-1">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <ClipboardList className="w-4 h-4 text-[#E60012]" />
          Term
        </label>
        <select
          value={termId}
          onChange={(e) => setTermId(e.target.value)}
          className={`${selectClass} w-full`}
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

  const renderChart = (chartData, chartId, extraData) => {
    if (!termId) {
      return (
        <div className={`${chartCardClass} w-full`}>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Select a term to view data.</p>
          </div>
        </div>
      );
    }

    if (isError || (!isLoading && !chartData)) {
      return (
        <div className={`${chartCardClass} max-w-lg`}>
          <p className="text-[#78716c] dark:text-gray-400 text-sm font-semibold mb-3">By Term ({termLabel})</p>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">No data available for this term.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full">
        <DealerEfficiencyChart
          chartId={chartId}
          data={chartData ? { ...chartData, ...extraData } : { title: `By Term (${termLabel})` }}
          isLoading={isLoading}
          showTitle={false}
          isAdmin={isAdmin}
          currencyCode={currency}
        />
      </div>
    );
  };

  return (
    <section className="mt-[38px] max-md:mt-8 pb-12 border-b border-gray-200 dark:border-gray-700">
      {/* Shared Company + Term filter toolbar, linked to both charts */}
      <div className="mb-8">
        {filter}
      </div>

      {/* Both charts on the same row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div id="dealer-efficiency">
          <SectionHeader title="Dealer Efficiency" />
          <div className="mt-4">
            {renderChart(dealerChartData, 'dashboard-dealer-term-api')}
          </div>
        </div>

        <div id="support-allocation-efficiency">
          <SectionHeader title="Support Amount vs Budget Allocation" />
          <div className="mt-4">
            {renderChart(supportChartData, 'dashboard-support-allocation-term-api', {
              amountLabel: 'Allocated Budget',
              legendLabel: 'Support Amount',
            })}
          </div>
        </div>
      </div>
    </section>
  );
};


const Index = () => {
  const user = useSelector((state) => state.auth.user);
  const isAdmin = isAdminUser(user);
  const { currency } = useCurrency();
  const [dealersTermId, setDealersTermId] = useState('');
  const [dealersYear, setDealersYear] = useState('');

  const { data: dealersTermsData } = useTerms({ perPage: 100 });
  const dealersTerms = dealersTermsData?.terms ?? [];
  const currentYear = new Date().getFullYear();
  const dealersYearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const { data, isLoading, isError } = useOverview({
    term_id: dealersTermId || undefined,
    year: !dealersTermId && dealersYear ? dealersYear : undefined,
  });



  const dealers = data?.dealersSummary || [];

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

      const totalCost = dealer.costs?.total_cost ?? 0;



      return {

        name: dealer.company_name,

        avatar: getLogoUrl(dealer.logo),

        flag: getLogoUrl(dealer.logo),

        terms: termSummaries,

        support,

        expense,

        estimatedCost,

        totalCost,

      };

    });



    return (

      <>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">

          {mappedDealers.map((dealer, index) => (

            <DealerCard key={index} {...dealer} isAdmin={isAdmin} currencyCode={currency} />

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



  const dashboardSections = [
    { id: 'marketing-charts', label: 'Marketing Expenditure vs Support' },
    { id: 'two-years-compare', label: 'Year-on-Year Support Cost' },
    { id: 'isuzu-dealers', label: 'ISUZU Dealers' },
    { id: 'overview-recently', label: 'Overview of Recent Activities' },
    { id: 'reporting-table', label: 'Reporting' },
  ];

  return (
    <>
      <SectionNav sections={dashboardSections} />
      <div className="flex w-full flex-col items-stretch mt-[19px] px-5 max-w-full">

        {/* 1. Marketing Expenditure vs Support */}
        <section id="marketing-charts" className="py-12 border-b border-gray-200 dark:border-gray-700">
          <MarketingChartsSection />
        </section>

        {/* 2. Year-on-Year Support Cost */}
        <section id="two-years-compare" className="py-12 border-b border-gray-200 dark:border-gray-700">
          <TwoYearsCompareChart />
        </section>

        {/* 3. ISUZU Dealers (scorecards) */}
        <section id="isuzu-dealers" className="py-12 border-b border-gray-200 dark:border-gray-700">
          <SectionTitle title="ISUZU Dealers" showButton={true} />

          <div className="mt-5 flex flex-wrap items-end gap-4 w-full max-w-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-5 py-4 shadow-[0px_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0px_6px_24px_rgba(0,0,0,0.3)]">
            <div className="flex flex-col gap-1.5 min-w-[200px] flex-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <ClipboardList className="w-4 h-4 text-[#E60012]" />
                Term
              </label>
              <select
                value={dealersTermId}
                onChange={(e) => {
                  setDealersTermId(e.target.value);
                  if (e.target.value) setDealersYear('');
                }}
                disabled={!!dealersYear}
                className={`${selectClass} w-full disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <option value="">All terms</option>
                {dealersTerms.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name || `Term ${t.id}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5 min-w-[200px] flex-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Calendar className="w-4 h-4 text-[#E60012]" />
                Year
              </label>
              <select
                value={dealersYear}
                onChange={(e) => {
                  setDealersYear(e.target.value);
                  if (e.target.value) setDealersTermId('');
                }}
                disabled={!!dealersTermId}
                className={`${selectClass} w-full disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <option value="">All years</option>
                {dealersYearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-7 md:mt-9">
            {renderDealersSection()}
          </div>
        </section>

        {/* 4. Overview of Recent Activities */}
        <section id="overview-recently" className="py-12 border-b border-gray-200 dark:border-gray-700">
          <SectionTitle title="Overview of Recent Activities" />
          <div className="mt-6 md:mt-8">
            <OverviewRecentlySection />
          </div>
        </section>

        {/* 5. Reporting */}
        <section id="reporting-table" className="py-12 border-b border-gray-200 dark:border-gray-700">
          <ReportingTable />
        </section>

        {/* Dealer Efficiency + Support vs Allocation (below main dashboard sequence) */}
        <DealerSupportChartsSection />

      </div>
    </>
  );

};



export default Index;


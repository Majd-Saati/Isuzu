import React from 'react';



import { PerformanceChart } from '@/components/dashboard/PerformanceChart';

import { OverviewTable } from '@/components/dashboard/OverviewTable';

import { OverviewTableSkeleton } from '@/components/dashboard/OverviewTableSkeleton';

import { OverviewTableEmpty } from '@/components/dashboard/OverviewTableEmpty';

import { DealerCard } from '@/components/dashboard/DealerCard';

import { DealerCardSkeleton } from '@/components/dashboard/DealerCardSkeleton';

import { DealerCardsEmpty } from '@/components/dashboard/DealerCardsEmpty';

import { DealerEfficiencyChart } from '@/components/dashboard/DealerEfficiencyChart';

import { SectionTitle } from '@/components/dashboard/SectionTitle';

import { useOverview } from '@/hooks/api/useOverview';



const getLogoUrl = (path) => {

  if (!path) return null;

  if (path.startsWith('http')) return path;

  return `https://marketing.5v.ae/${path}`;

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

      <div className="w-full max-w-full overflow-x-hidden">

        <div className="gap-5 flex max-md:flex-col max-md:items-stretch">

          <div className="flex-[0_0_calc(70%-10px)] max-md:flex-auto max-md:w-full">

            {/* <div className="mt-[5px] max-md:mt-[19px]">

              <PerformanceChart />

            </div> */}

          </div>

          {/* <div className="flex-[0_0_calc(30%-10px)] max-md:flex-auto max-md:w-full flex justify-center max-md:mt-3.5">

            <DealerEfficiencyChart />

          </div> */}

        </div>

      </div>



      <div className="mt-[38px] max-md:mt-8">

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


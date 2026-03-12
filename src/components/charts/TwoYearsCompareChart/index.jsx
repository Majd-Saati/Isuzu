import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AlertCircle, CalendarRange } from 'lucide-react';
import { useTwoYearsCharts } from '@/hooks/api/useCharts';
import { useCompanies } from '@/hooks/api/useCompanies';
import { MarketingChartsSkeleton } from '../MarketingChartsSkeleton';
import { TwoYearsFilters } from './components/TwoYearsFilters';
import { YearSupportChart } from './components/YearSupportChart';

const currentYear = () => new Date().getFullYear();

export const TwoYearsCompareChart = () => {
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.is_admin === '1' || user?.is_admin === 1;

  const [year1, setYear1] = useState(currentYear);
  const [year2, setYear2] = useState(currentYear() - 1);
  const [companyId, setCompanyId] = useState(isAdmin ? 'all' : String(user?.id || ''));

  const { data: companiesData } = useCompanies({ perPage: 100 }, { enabled: isAdmin });
  const companies = companiesData?.companies ?? [];

  useEffect(() => {
    if (!isAdmin && user?.id) {
      setCompanyId(String(user.id));
    }
  }, [isAdmin, user]);

  const { data, isLoading, isError, error } = useTwoYearsCharts({
    company_id: isAdmin ? companyId : user?.id,
    year1,
    year2,
  });

  const years = data?.years ?? [];
  const hasData = years.length > 0;
  const showEmpty = !isLoading && !isError && (!hasData || years.every((y) => !y.months?.length));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full" />
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
            Two years comparison – Support cost (JPY)
          </h2>
          {hasData && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {year1} vs {year2}
            </p>
          )}
        </div>
      </div>

      <TwoYearsFilters
        year1={year1}
        year2={year2}
        companyId={companyId}
        companies={companies}
        onYear1Change={setYear1}
        onYear2Change={setYear2}
        onCompanyChange={setCompanyId}
        isAdmin={isAdmin}
      />

      {isLoading && <MarketingChartsSkeleton />}

      {isError && (
        <div className="flex flex-col items-center justify-center py-12 px-6 rounded-xl border-2 border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10">
          <AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400 mb-3" />
          <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">
            Failed to load two-years data
          </p>
          <p className="text-xs text-red-600 dark:text-red-400 max-w-md text-center">
            {error?.message || 'Please try again or change the filters.'}
          </p>
        </div>
      )}

      {showEmpty && (
        <div className="flex flex-col items-center justify-center py-16 px-6 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <CalendarRange className="w-14 h-14 text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
            No data for {year1} vs {year2}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
            There is no support cost data available for the selected years and company.
          </p>
        </div>
      )}

      {!isLoading && !isError && hasData && (
        <div className="flex flex-col gap-6">
          {years.map((yearData) => (
            <YearSupportChart key={yearData.year} yearData={yearData} />
          ))}
        </div>
      )}
    </div>
  );
};

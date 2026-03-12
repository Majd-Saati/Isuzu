import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Calendar, AlertCircle, Building2 } from 'lucide-react';
import { useCharts } from '@/hooks/api/useCharts';
import { useCompanies } from '@/hooks/api/useCompanies';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import {
  SECTION_FILTERS_CLASS,
  SECTION_FILTER_ICON_BOX_CLASS,
  SECTION_FILTER_ICON_CLASS,
  SECTION_FILTER_LABEL_CLASS,
  SECTION_FILTER_SELECT_CLASS,
  SECTION_FILTER_DIVIDER_CLASS,
} from '@/components/dashboard/sectionStyles';
import { MarketingChartsTotals } from './MarketingChartsTotals';
import { MarketingChartsSeriesChart } from './MarketingChartsSeriesChart';
import { MarketingChartsSkeleton } from './MarketingChartsSkeleton';
import { toast } from 'sonner';

const getDefaultYear = () => new Date().getFullYear();

export const YearlyExpenseChart = () => {
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.is_admin === '1' || user?.is_admin === 1;

  const [year, setYear] = useState(getDefaultYear);
  const [companyId, setCompanyId] = useState(isAdmin ? 'all' : String(user?.id || ''));

  const { data: companiesData } = useCompanies({ perPage: 100 }, { enabled: isAdmin });
  const companies = companiesData?.companies ?? [];

  useEffect(() => {
    if (!isAdmin && user?.id) {
      setCompanyId(String(user.id));
    }
  }, [isAdmin, user]);

  const { data, isLoading, isError, error, refetch, isFetching } = useCharts({ 
    company_id: isAdmin ? companyId : user?.id,
    year 
  });

  const hasData = data?.totals != null || (data?.series?.length ?? 0) > 0;
  const showEmpty = !isLoading && !isError && !hasData;

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const handleExport = () => {
    if (!data) return;
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yearly-expense-${year}-${companyId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Chart data exported successfully');
  };

  const selectedCompany = companies.find((c) => c.id === companyId)?.name || 'All companies';

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Yearly expense & term chart"
        subtitle={hasData ? `${selectedCompany} • ${year}` : undefined}
      />

      {/* Filters */}
      <div className={SECTION_FILTERS_CLASS}>
        {isAdmin && (
          <div className="flex items-center gap-3">
            <div className={SECTION_FILTER_ICON_BOX_CLASS}>
              <Building2 className={SECTION_FILTER_ICON_CLASS} />
            </div>
            <div className="flex flex-col">
              <label className={SECTION_FILTER_LABEL_CLASS}>Company</label>
              <select
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className={`${SECTION_FILTER_SELECT_CLASS} min-w-[180px]`}
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

        <div className={`flex items-center gap-3 ${isAdmin ? SECTION_FILTER_DIVIDER_CLASS : ''}`}>
          <div className={SECTION_FILTER_ICON_BOX_CLASS}>
            <Calendar className={SECTION_FILTER_ICON_CLASS} />
          </div>
          <div className="flex flex-col">
            <label className={SECTION_FILTER_LABEL_CLASS}>Year</label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className={SECTION_FILTER_SELECT_CLASS}
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading && <MarketingChartsSkeleton />}

      {isError && (
        <div className="flex flex-col items-center justify-center py-12 px-6 rounded-xl border-2 border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10">
          <AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400 mb-3" />
          <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">
            Failed to load yearly data
          </p>
          <p className="text-xs text-red-600 dark:text-red-400 max-w-md text-center">
            {error?.message || 'Please try again or change the filters.'}
          </p>
        </div>
      )}

      {showEmpty && (
        <div className="flex flex-col items-center justify-center py-16 px-6 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <Calendar className="w-14 h-14 text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
            No data for {year}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
            There is no expense or term data available for the selected year and company.
          </p>
        </div>
      )}

      {!isLoading && !isError && hasData && (
        <div className="space-y-6">
          {/* Totals cards commented out per request
          <MarketingChartsTotals totals={data.totals} />
          */}
          <MarketingChartsSeriesChart 
            series={data.series} 
            totals={data.totals}
            filename={`yearly-expense-${year}-${companyId}`}
          />
        </div>
      )}
    </div>
  );
};

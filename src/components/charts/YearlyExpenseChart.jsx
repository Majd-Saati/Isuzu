import React, { useState } from 'react';
import { Calendar, AlertCircle, Building2, Download, RefreshCw } from 'lucide-react';
import { useCharts } from '@/hooks/api/useCharts';
import { useCompanies } from '@/hooks/api/useCompanies';
import { MarketingChartsTotals } from './MarketingChartsTotals';
import { MarketingChartsSeriesChart } from './MarketingChartsSeriesChart';
import { MarketingChartsSkeleton } from './MarketingChartsSkeleton';
import { toast } from 'sonner';

const getDefaultYear = () => new Date().getFullYear();

export const YearlyExpenseChart = () => {
  const [year, setYear] = useState(getDefaultYear);
  const [companyId, setCompanyId] = useState('all');

  const { data: companiesData } = useCompanies({ perPage: 100 });
  const companies = companiesData?.companies ?? [];

  const { data, isLoading, isError, error, refetch, isFetching } = useCharts({ 
    company_id: companyId, 
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
      {/* Section header with actions */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full" />
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
              Yearly expense & term chart
            </h2>
            {hasData && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {selectedCompany} • {year}
              </p>
            )}
          </div>
        </div>
        
 
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/10 border-2 border-blue-200 dark:border-blue-800 shadow-sm">
        {/* Company filter */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-700">
            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Company
            </label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="px-3 py-1.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 min-w-[180px] cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
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

        {/* Year filter */}
        <div className="flex items-center gap-3 border-l-2 border-blue-300 dark:border-blue-700 pl-4">
          <div className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-700">
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Year
            </label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="px-3 py-1.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 min-w-[140px] cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
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
          <MarketingChartsTotals totals={data.totals} />
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

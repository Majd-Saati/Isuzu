import React, { useState, useMemo } from 'react';
import { Calendar, AlertCircle, Building2, Download, RefreshCw } from 'lucide-react';
import { useCharts } from '@/hooks/api/useCharts';
import { useTerms } from '@/hooks/api/useTerms';
import { useCompanies } from '@/hooks/api/useCompanies';
import { MarketingChartsTotals } from './MarketingChartsTotals';
import { MarketingChartsSeriesChart } from './MarketingChartsSeriesChart';
import { MarketingChartsSkeleton } from './MarketingChartsSkeleton';
import { MarketingChartsEmpty } from './MarketingChartsEmpty';
import { format } from 'date-fns';
import { toast } from 'sonner';

const getDefaultMonth = () => format(new Date(), 'yyyy-MM');

export const MarketingChartsSection = () => {
  const [periodType, setPeriodType] = useState('month');
  const [month, setMonth] = useState(getDefaultMonth);
  const [termId, setTermId] = useState('');
  const [companyId, setCompanyId] = useState('all');

  const { data: termsData } = useTerms({ perPage: 100 });
  const terms = termsData?.terms ?? [];

  const { data: companiesData } = useCompanies({ perPage: 100 });
  const companies = companiesData?.companies ?? [];

  const params = useMemo(() => {
    const base = { company_id: companyId };
    if (periodType === 'month') return { ...base, month };
    if (termId) return { ...base, term_id: termId };
    return base;
  }, [periodType, month, termId, companyId]);

  const { data, isLoading, isError, error, refetch, isFetching } = useCharts(params);

  const hasData = data?.totals != null || (data?.series?.length ?? 0) > 0;
  const showEmpty = !isLoading && !isError && !hasData;

  const handleExport = () => {
    if (!data) return;
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marketing-charts-${companyId}-${periodType === 'month' ? month : `term-${termId}`}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Chart data exported successfully');
  };

  const selectedCompany = companies.find((c) => c.id === companyId)?.name || 'All companies';
  const selectedTerm = terms.find((t) => t.id === termId)?.name || '';
  const periodLabel = periodType === 'month' ? month : selectedTerm;

  return (
    <div className="space-y-6">
      {/* Section header with actions */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 bg-gradient-to-b from-[#E60012] to-rose-600 rounded-full" />
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
              Marketing cost & incentive
            </h2>
            {hasData && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {selectedCompany} • {periodLabel}
              </p>
            )}
          </div>
        </div>
        
        {hasData && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white bg-[#E60012] hover:bg-[#cc0010] transition-all"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-5 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-800/30 border-2 border-gray-200 dark:border-gray-700 shadow-sm">
        {/* Company filter */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <Building2 className="w-4 h-4 text-[#E60012]" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Company
            </label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="px-3 py-1.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E60012]/50 focus:border-[#E60012] min-w-[180px] cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
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

        {/* Period filter */}
        <div className="flex items-center gap-3 border-l-2 border-gray-300 dark:border-gray-600 pl-4">
          <div className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <Calendar className="w-4 h-4 text-[#E60012]" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Period
            </label>
            <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
        <div className="flex rounded-lg border-2 border-gray-300 dark:border-gray-600 overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
            <button
              type="button"
              onClick={() => setPeriodType('month')}
              className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                periodType === 'month'
                  ? 'bg-[#E60012] text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              By month
            </button>
            <button
              type="button"
              onClick={() => setPeriodType('term')}
              className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                periodType === 'term'
                  ? 'bg-[#E60012] text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              By term
            </button>
          </div>
          {periodType === 'month' ? (
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="px-3 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E60012]/50 focus:border-[#E60012] cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
            />
          ) : (
            <select
              value={termId}
              onChange={(e) => setTermId(e.target.value)}
              className="px-3 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E60012]/50 focus:border-[#E60012] min-w-[180px] cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
            >
              <option value="">Select term</option>
              {terms.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name || `Term ${t.id}`}
                </option>
              ))}
            </select>
          )}
        </div>
          </div>
        </div>

      {/* Content */}
      {isLoading && <MarketingChartsSkeleton />}

      {isError && (
        <div className="flex flex-col items-center justify-center py-12 px-6 rounded-xl border-2 border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10">
          <AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400 mb-3" />
          <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">
            Failed to load chart data
          </p>
          <p className="text-xs text-red-600 dark:text-red-400 max-w-md text-center">
            {error?.message || 'Please try again or change the period.'}
          </p>
        </div>
      )}

      {showEmpty && <MarketingChartsEmpty />}

      {!isLoading && !isError && hasData && (
        <div className="space-y-6">
          <MarketingChartsTotals totals={data.totals} />
          <MarketingChartsSeriesChart series={data.series} />
        </div>
      )}
    </div>
    </div>
    </div>
  );
};

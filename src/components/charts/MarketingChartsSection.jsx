import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Calendar, AlertCircle, Building2 } from 'lucide-react';
import { useCharts } from '@/hooks/api/useCharts';
import { useTerms } from '@/hooks/api/useTerms';
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
import { MarketingChartsEmpty } from './MarketingChartsEmpty';
import { useCurrency } from '@/contexts/CurrencyContext';

export const MarketingChartsSection = () => {
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.is_admin === '1' || user?.is_admin === 1;
  const { currency } = useCurrency();

  const [periodType, setPeriodType] = useState('term');
  const [termId, setTermId] = useState('');
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [companyId, setCompanyId] = useState(isAdmin ? 'all' : String(user?.id || ''));

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const { data: termsData } = useTerms({ perPage: 100 });
  const terms = termsData?.terms ?? [];

  const { data: companiesData } = useCompanies({ perPage: 100 }, { enabled: isAdmin });
  const companies = companiesData?.companies ?? [];

  useEffect(() => {
    if (!isAdmin && user?.id) setCompanyId(String(user.id));
  }, [isAdmin, user]);

  const params = useMemo(() => {
    const base = { company_id: companyId };
    if (periodType === 'year') return { ...base, year };
    if (termId) return { ...base, term_id: termId };
    return base;
  }, [periodType, termId, year, companyId]);

  const { data, isLoading, isError, error } = useCharts(params);

  const hasData = data?.totals != null || (data?.series?.length ?? 0) > 0;
  const showEmpty = !isLoading && !isError && !hasData;

  const selectedCompany = companies.find((c) => c.id === companyId)?.name || 'All companies';
  const selectedTerm = terms.find((t) => t.id === termId)?.name || '';
  const periodLabel = periodType === 'year' ? String(year) : selectedTerm;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Marketing Expenditure vs Support"
        subtitle={hasData ? `${selectedCompany} • ${periodLabel}` : undefined}
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

        <div className={`flex flex-wrap items-center gap-3 ${isAdmin ? SECTION_FILTER_DIVIDER_CLASS : ''}`}>
          <div className={SECTION_FILTER_ICON_BOX_CLASS}>
            <Calendar className={SECTION_FILTER_ICON_CLASS} />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Period</span>
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden bg-white dark:bg-gray-900">
            <button
              type="button"
              onClick={() => setPeriodType('term')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                periodType === 'term'
                  ? 'bg-[#E60012] text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              By term
            </button>
            <button
              type="button"
              onClick={() => setPeriodType('year')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                periodType === 'year'
                  ? 'bg-[#E60012] text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              By year
            </button>
          </div>

          {periodType === 'term' && (
            <select
              value={termId}
              onChange={(e) => setTermId(e.target.value)}
              className={`${SECTION_FILTER_SELECT_CLASS} min-w-[180px]`}
            >
              <option value="">Select term</option>
              {terms.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name || `Term ${t.id}`}
                </option>
              ))}
            </select>
          )}
          {periodType === 'year' && (
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
          )}
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
          <MarketingChartsTotals totals={data.totals} isAdmin={isAdmin} currencyCode={currency} />
          <MarketingChartsSeriesChart 
            series={data.series} 
            totals={data.totals}
            filename={`marketing-${companyId}-${
              periodType === 'year' ? `year-${year}` : `term-${termId}`
            }`}
            isAdmin={isAdmin}
            currencyCode={currency}
          />
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { AlertCircle, CalendarRange, Download, FileSpreadsheet, FileText, Image, ChevronDown } from 'lucide-react';
import { useTwoYearsCharts } from '@/hooks/api/useCharts';
import { useCompanies } from '@/hooks/api/useCompanies';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import { MarketingChartsSkeleton } from '../MarketingChartsSkeleton';
import { TwoYearsFilters } from './components/TwoYearsFilters';
import { YearSupportChart } from './components/YearSupportChart';
import { toast } from 'sonner';
import { useCurrency } from '@/contexts/CurrencyContext';
import { getEffectiveCurrencyCode } from '@/lib/dashboardMoney';

let exportUtils = null;
const loadExportUtils = async () => {
  if (!exportUtils) {
    try {
      exportUtils = await import('../chartExportUtils');
    } catch (e) {
      return null;
    }
  }
  return exportUtils;
};

const currentYear = () => new Date().getFullYear();

export const TwoYearsCompareChart = () => {
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.is_admin === '1' || user?.is_admin === 1;
  const { currency } = useCurrency();
  const displayCode = getEffectiveCurrencyCode(isAdmin, currency);
  const supportCostLabel = displayCode ? `Support cost (${displayCode})` : 'Support cost';

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

  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const chartsContainerRef = useRef(null);
  const filename = `two-years-support-cost-${year1}-${year2}-${companyId}`;

  const handleExportJSON = () => {
    if (!data) return;
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Chart data exported successfully');
    setShowExportMenu(false);
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const utils = await loadExportUtils();
      if (!utils?.exportTwoYearsToExcel) {
        toast.error('Export feature unavailable. Please restart the dev server.');
        return;
      }
      const success = utils.exportTwoYearsToExcel(data, filename, isAdmin, currency);
      if (success) toast.success('Excel file exported successfully');
      else toast.error('Failed to export Excel file');
    } catch (err) {
      toast.error('Error exporting to Excel.');
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  };

  const handleExportPDF = async () => {
    if (!chartsContainerRef.current) return;
    setIsExporting(true);
    try {
      const utils = await loadExportUtils();
      if (!utils?.exportToPDF) {
        toast.error('Export feature unavailable. Please restart the dev server.');
        return;
      }
      const success = await utils.exportToPDF(
        chartsContainerRef.current,
        filename,
        `Two years comparison – ${supportCostLabel} (${year1} vs ${year2})`
      );
      if (success) toast.success('PDF exported successfully');
      else toast.error('Failed to export PDF');
    } catch (err) {
      toast.error('Error exporting to PDF.');
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  };

  const handleExportPNG = async () => {
    if (!chartsContainerRef.current) return;
    setIsExporting(true);
    try {
      const utils = await loadExportUtils();
      if (!utils?.exportToPNG) {
        toast.error('Export feature unavailable. Please restart the dev server.');
        return;
      }
      const success = await utils.exportToPNG(chartsContainerRef.current, filename);
      if (success) toast.success('Image exported successfully');
      else toast.error('Failed to export image');
    } catch (err) {
      toast.error('Error exporting to image.');
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title={`Two years comparison – ${supportCostLabel}`}
        subtitle={hasData ? `${year1} vs ${year2}` : undefined}
      >
        {hasData && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <Download className={isExporting ? 'animate-pulse w-3.5 h-3.5' : 'w-3.5 h-3.5'} />
              Export
              <ChevronDown className={`w-3 h-3 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
            </button>
            {showExportMenu && (
              <>
                <div role="button" tabIndex={0} className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} aria-label="Close" />
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-xl z-20 py-1 animate-fade-in">
                  <button type="button" onClick={handleExportJSON} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <FileText className="w-4 h-4 text-amber-600" />
                    <div>
                      <div className="font-medium">JSON (.json)</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Raw data</div>
                    </div>
                  </button>
                  <button type="button" onClick={handleExportExcel} disabled={isExporting} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-medium">Excel (.xlsx)</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">One sheet per year</div>
                    </div>
                  </button>
                  <button type="button" onClick={handleExportPDF} disabled={isExporting} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
                    <FileText className="w-4 h-4 text-red-600" />
                    <div>
                      <div className="font-medium">PDF (.pdf)</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Charts as image</div>
                    </div>
                  </button>
                  <button type="button" onClick={handleExportPNG} disabled={isExporting} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
                    <Image className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-medium">Image (.png)</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">High-resolution</div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </SectionHeader>

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
        <div ref={chartsContainerRef} className="flex flex-col gap-6">
          <YearSupportChart yearsData={years} isAdmin={isAdmin} currencyCode={currency} />
        </div>
      )}
    </div>
  );
};

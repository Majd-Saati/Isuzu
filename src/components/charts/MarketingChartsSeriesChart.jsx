import React, { useState, useRef } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { TrendingUp, Download, FileSpreadsheet, FileText, Image, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

// Dynamic import of export utils to avoid breaking the app during hot reload
let exportUtils = null;
const loadExportUtils = async () => {
  if (!exportUtils) {
    try {
      exportUtils = await import('./chartExportUtils');
    } catch (error) {
      console.warn('Export utilities not available yet. Please restart the dev server.');
      return null;
    }
  }
  return exportUtils;
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const formatCompact = (value) => {
  const num = Number(value) || 0;
  if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
  return formatCurrency(num);
};

const COLORS = {
  actual_cost: '#10b981',
  support_cost: '#3b82f6',
  total_cost: '#f59e0b',
  incentive: '#E60012',
};

const METRICS = [
  { key: 'actual_cost', name: 'Actual cost', color: COLORS.actual_cost },
  { key: 'support_cost', name: 'Support cost', color: COLORS.support_cost },
  { key: 'total_cost', name: 'Total cost', color: COLORS.total_cost },
  { key: 'incentive', name: 'Incentive', color: COLORS.incentive },
];

export const MarketingChartsSeriesChart = ({ series, totals, filename = 'marketing-chart' }) => {
  const [activeMetric, setActiveMetric] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const chartRef = useRef(null);
  const chartExportRef = useRef(null);

  if (!series || !Array.isArray(series) || series.length === 0) return null;

  const chartData = series.map((item) => ({
    label: item.label || item.period,
    actual_cost: Number(item.actual_cost) || 0,
    support_cost: Number(item.support_cost) || 0,
    total_cost: Number(item.total_cost) || 0,
    incentive: Number(item.incentive) || 0,
  }));

  // Calculate stats
  const stats = METRICS.map(({ key, name, color }) => {
    const values = chartData.map((d) => d[key]);
    const total = values.reduce((a, b) => a + b, 0);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const avg = total / values.length;
    return { key, name, color, total, max, min, avg };
  });

  // Export handlers
  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const utils = await loadExportUtils();
      if (!utils) {
        toast.error('Export feature unavailable. Please restart the dev server.');
        return;
      }
      const success = utils.exportToExcel(series, filename, 'Marketing Data');
      if (success) {
        toast.success('Excel file exported successfully');
      } else {
        toast.error('Failed to export Excel file');
      }
    } catch (error) {
      toast.error('Error exporting to Excel. Please restart the dev server.');
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const utils = await loadExportUtils();
      if (!utils) {
        toast.error('Export feature unavailable. Please restart the dev server.');
        return;
      }
      const success = await utils.exportChartWithDataToPDF(
        chartExportRef.current,
        series,
        totals,
        filename,
        'Marketing Cost & Incentive Report'
      );
      if (success) {
        toast.success('PDF exported successfully');
      } else {
        toast.error('Failed to export PDF');
      }
    } catch (error) {
      toast.error('Error exporting to PDF. Please restart the dev server.');
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  };

  const handleExportPNG = async () => {
    setIsExporting(true);
    try {
      const utils = await loadExportUtils();
      if (!utils) {
        toast.error('Export feature unavailable. Please restart the dev server.');
        return;
      }
      const success = await utils.exportToPNG(chartExportRef.current, filename);
      if (success) {
        toast.success('Image exported successfully');
      } else {
        toast.error('Failed to export image');
      }
    } catch (error) {
      toast.error('Error exporting to PNG. Please restart the dev server.');
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);
    
    return (
      <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-4 min-w-[200px] animate-fade-in">
        <p className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-base border-b border-gray-200 dark:border-gray-700 pb-2">
          {label}
        </p>
        <div className="space-y-2">
          {payload
            .sort((a, b) => b.value - a.value)
            .map((entry) => (
              <div key={entry.dataKey} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {entry.name}
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {formatCurrency(entry.value)}
                </span>
              </div>
            ))}
          <div className="flex justify-between gap-4 pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Total</span>
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const CustomLegend = ({ payload }) => (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload?.map((entry) => {
        const isActive = activeMetric === entry.dataKey || activeMetric === null;
        const stat = stats.find((s) => s.key === entry.dataKey);
        
        return (
          <button
            key={entry.dataKey}
            onClick={() => setActiveMetric(activeMetric === entry.dataKey ? null : entry.dataKey)}
            onMouseEnter={() => setActiveMetric(entry.dataKey)}
            onMouseLeave={() => setActiveMetric(null)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all duration-200 ${
              isActive
                ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-md scale-105'
                : 'border-transparent bg-gray-50 dark:bg-gray-800/50 opacity-60 hover:opacity-100'
            }`}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {entry.value}
            </span>
            {stat && (
              <span className="text-xs font-bold text-gray-900 dark:text-gray-100 ml-1">
                {formatCompact(stat.total)}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  const renderBar = (dataKey) => {
    const isActive = activeMetric === dataKey || activeMetric === null;
    return (
      <Bar
        key={dataKey}
        dataKey={dataKey}
        name={METRICS.find((m) => m.key === dataKey)?.name}
        fill={COLORS[dataKey]}
        radius={[8, 8, 0, 0]}
        maxBarSize={60}
        opacity={isActive ? 1 : 0.3}
        onMouseEnter={(data, index) => setHoveredBar({ dataKey, index })}
        onMouseLeave={() => setHoveredBar(null)}
        animationDuration={800}
        animationBegin={0}
      >
        {chartData.map((entry, index) => {
          const isBarHovered = hoveredBar?.dataKey === dataKey && hoveredBar?.index === index;
          return (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[dataKey]}
              opacity={isBarHovered ? 1 : isActive ? 0.85 : 0.3}
            />
          );
        })}
      </Bar>
    );
  };

  return (
    <div 
      ref={chartRef}
      className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 md:p-7 shadow-sm hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100">
          Cost & incentive breakdown
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400">
            <TrendingUp className="w-3 h-3" />
            <span className="font-medium">{chartData.length} periods</span>
          </div>
          
          {/* Export dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <Download className={`w-3.5 h-3.5 ${isExporting ? 'animate-pulse' : ''}`} />
              Export
              <ChevronDown className={`w-3 h-3 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
            </button>
            
            {showExportMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowExportMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-xl z-20 py-1 animate-fade-in">
                  <button
                    onClick={handleExportExcel}
                    disabled={isExporting}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-medium">Excel (.xlsx)</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Spreadsheet format</div>
                    </div>
                  </button>
                  <button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    <FileText className="w-4 h-4 text-red-600" />
                    <div>
                      <div className="font-medium">PDF (.pdf)</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Chart with data table</div>
                    </div>
                  </button>
                  <button
                    onClick={handleExportPNG}
                    disabled={isExporting}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    <Image className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-medium">Image (.png)</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">High-resolution image</div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Export-only area: chart only (no dropdowns, no Avg) */}
      <div ref={chartExportRef} className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
            barGap={8}
            barCategoryGap="20%"
          >
            <defs>
              {Object.entries(COLORS).map(([key, color]) => (
                <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                </linearGradient>
              ))}
            </defs>
            
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              className="dark:stroke-gray-700"
              vertical={false}
            />
            
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 500 }}
              axisLine={{ stroke: '#d1d5db' }}
              tickLine={false}
              height={60}
              angle={chartData.length > 6 ? -45 : 0}
              textAnchor={chartData.length > 6 ? 'end' : 'middle'}
            />
            
            <YAxis
              tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatCompact}
              width={70}
            />
            
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              animationDuration={200}
            />
            
            <Legend content={<CustomLegend />} />
            
            {METRICS.map(({ key }) => renderBar(key))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick stats below chart (excluded from PDF/PNG export) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        {stats.map(({ key, name, color, avg }) => (
          <div key={key} className="text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg {name}</div>
            <div className="text-lg font-bold" style={{ color }}>
              {formatCompact(avg)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

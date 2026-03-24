import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatSupportCost } from '../utils';
import { formatJpyAxisCompact, getEffectiveCurrencyCode } from '@/lib/dashboardMoney';

export const YearSupportChart = ({ yearsData = [], isAdmin = false, currencyCode = '' }) => {
  /** First year (older / left bar): blue. Second year (newer / right bar): green — matches yearly comparison styling. */
  const FIRST_YEAR_COLOR = '#4A84E3';
  const SECOND_YEAR_COLOR = '#1BBF7B';
  const displayCode = getEffectiveCurrencyCode(isAdmin, currencyCode);
  const supportTitle = displayCode ? `Support cost (${displayCode})` : 'Support cost';
  if (!Array.isArray(yearsData) || yearsData.length === 0) return null;

  const normalizedYears = yearsData
    .filter((yearData) => yearData?.year != null)
    .sort((a, b) => Number(a.year) - Number(b.year))
    .slice(-2);

  if (normalizedYears.length === 0) return null;

  const [firstYear, secondYear] = normalizedYears;
  const firstYearKey = String(firstYear.year);
  const secondYearKey = secondYear ? String(secondYear.year) : null;

  const monthIndex = new Map();
  const monthLabel = new Map();

  normalizedYears.forEach((yearData) => {
    (yearData.months || []).forEach((monthData) => {
      const monthNumber = Number(monthData?.month);
      if (!monthNumber || monthNumber < 1 || monthNumber > 12) return;
      monthIndex.set(monthNumber, true);
      const shortLabel = String(monthData?.label || '').trim().split(' ')[0];
      monthLabel.set(monthNumber, shortLabel || `M${monthNumber}`);
    });
  });

  const orderedMonths = Array.from(monthIndex.keys()).sort((a, b) => a - b);
  const chartData = orderedMonths.map((monthNumber) => {
    const row = {
      month: monthLabel.get(monthNumber) || `M${monthNumber}`,
      [firstYearKey]: 0,
    };

    normalizedYears.forEach((yearData) => {
      const matchingMonth = (yearData.months || []).find((m) => Number(m?.month) === monthNumber);
      row[String(yearData.year)] = Number(matchingMonth?.support_cost_jpy) || 0;
    });

    return row;
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl px-4 py-3">
        <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">{label}</p>
        <div className="space-y-1">
          {payload.map((entry) => (
            <p key={entry.dataKey} className="text-sm font-medium" style={{ color: entry.color }}>
              {entry.name}: {formatSupportCost(entry.value, isAdmin, currencyCode)}
            </p>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 md:p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100">
          Two years comparison – {supportTitle}
        </h3>
      </div>
      <div className="w-full h-[280px] md:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 12, right: 12, left: 0, bottom: 8 }}
            barGap={4}
            barCategoryGap="30%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              className="dark:stroke-gray-700"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: 'currentColor' }}
              className="text-gray-600 dark:text-gray-400"
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={(v) => formatJpyAxisCompact(v, isAdmin, currencyCode)}
              tick={{ fontSize: 10, fill: 'currentColor' }}
              className="text-gray-600 dark:text-gray-400"
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
            <Legend />
            <Bar
              dataKey={firstYearKey}
              name={firstYearKey}
              fill={FIRST_YEAR_COLOR}
              radius={[6, 6, 0, 0]}
              maxBarSize={24}
            />
            {secondYearKey && (
              <Bar
                dataKey={secondYearKey}
                name={secondYearKey}
                fill={SECOND_YEAR_COLOR}
                radius={[6, 6, 0, 0]}
                maxBarSize={24}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

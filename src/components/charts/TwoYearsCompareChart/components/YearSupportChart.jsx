import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatSupportCost } from '../utils';
import { SUPPORT_COST_COLOR } from '../constants';

const formatCompact = (value) => {
  const num = Number(value) || 0;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return String(num);
};

export const YearSupportChart = ({ yearData }) => {
  if (!yearData?.months?.length) return null;

  const chartData = yearData.months.map((m) => ({
    label: m.label || `${m.period}`,
    support_cost_jpy: Number(m.support_cost_jpy) || 0,
  }));

  const total = Number(yearData.total_support_cost_jpy) || 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const value = payload[0]?.value;
    return (
      <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl px-4 py-3">
        <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">{label}</p>
        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
          Support cost (JPY): {formatSupportCost(value)}
        </p>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 md:p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100">
          {yearData.year} – Support cost (JPY)
        </h3>
        <div className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
            Total: {formatSupportCost(total)}
          </span>
        </div>
      </div>
      <div className="w-full h-[280px] md:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 12, right: 12, left: 0, bottom: 8 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              className="dark:stroke-gray-700"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: 'currentColor' }}
              className="text-gray-600 dark:text-gray-400"
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={formatCompact}
              tick={{ fontSize: 10, fill: 'currentColor' }}
              className="text-gray-600 dark:text-gray-400"
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
            <Bar
              dataKey="support_cost_jpy"
              name="Support cost (JPY)"
              fill={SUPPORT_COST_COLOR}
              radius={[6, 6, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

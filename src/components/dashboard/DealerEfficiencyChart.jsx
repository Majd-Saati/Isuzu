import React from 'react';

const BUDGET_STYLE = {
  title: 'Budget Vs Support Amount',
  color: '#EF5A6F',
  gradientEnd: '#f5999c',
  legendLabel: 'Support Cost',
};

const DEFAULT_DATA = {
  startValue: 0,
  endValue: 2000,
  amount: 2000,
  percentage: 20,
  ...BUDGET_STYLE,
};

const CHART = {
  radius: 100,
  size: 320,
  strokeWidth: 28,
  labelOffset: 32,
  percentAboveArc: 56,
  valueBelowArc: 28,
};

const formatVal = (v) => Number(v).toLocaleString();

export const DealerEfficiencyChart = ({ data, chartId, filter, isLoading, showTitle = true }) => {
  const uniqueId = chartId ?? React.useId().replace(/:/g, '-');
  const d = { ...DEFAULT_DATA, ...data };
  const { color, gradientEnd, legendLabel } = BUDGET_STYLE;
  const {
    title,
    startValue,
    endValue,
    amount,
    percentage: rawPercent,
    support_cost,
  } = d;

  const percentage = Math.min(100, Math.max(0, Number(rawPercent) ?? 0));
  const cx = CHART.size / 2;
  const cy = CHART.size / 2;
  const semicircleLength = Math.PI * CHART.radius;
  const progressOffset = semicircleLength - (percentage / 100) * semicircleLength;

  const polarToCartesian = (angleDeg) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + CHART.radius * Math.cos(rad), y: cy + CHART.radius * Math.sin(rad) };
  };

  const start = polarToCartesian(270);
  const end = polarToCartesian(90);
  const topArcPath = `M ${start.x} ${start.y} A ${CHART.radius} ${CHART.radius} 0 1 1 ${end.x} ${end.y}`;

  const fillBoundaryAngle = 270 - (percentage / 100) * 180;
  const fillBoundary = polarToCartesian(fillBoundaryAngle);
  const valueAtEnd =
    support_cost != null ? support_cost : Math.round((percentage / 100) * (amount || 0));
  const endVal = endValue ?? amount;
  const startVal = startValue ?? 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-none p-4 md:p-5 w-full border border-gray-100 dark:border-gray-800 shadow-[0px_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0px_6px_24px_rgba(0,0,0,0.3)] hover:shadow-[0px_8px_32px_rgba(0,0,0,0.12)] dark:hover:shadow-[0px_8px_32px_rgba(0,0,0,0.4)] transition-shadow duration-300">
      {showTitle && (
        <div className="flex items-center gap-3 mb-3">
          <div className="h-7 w-1 bg-gradient-to-b from-[#EF5A6F] to-rose-400 rounded-full" />
          <h3 className="text-[#1F2937] dark:text-gray-100 text-lg md:text-xl font-bold">
            Dealer Efficiency
          </h3>
        </div>
      )}
      <p className="text-[#78716c] dark:text-gray-400 text-sm font-semibold mb-3">{title}</p>
      {filter && <div className="mb-4">{filter}</div>}

      <div className="flex justify-center mb-4">
        <div className="relative" style={{ width: CHART.size, height: CHART.size }}>
          {isLoading ? (
            <div
              className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"
              style={{ width: CHART.size, height: CHART.size }}
            />
          ) : (
          <svg
            className="relative z-10 w-full h-full"
            width={CHART.size}
            height={CHART.size}
            viewBox={`0 0 ${CHART.size} ${CHART.size}`}
          >
            <defs>
              <linearGradient id={`gradient-dealer-eff-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={color} />
                <stop offset="100%" stopColor={gradientEnd} />
              </linearGradient>
            </defs>

            <path
              d={topArcPath}
              fill="none"
              stroke="#D1D5DB"
              strokeWidth={CHART.strokeWidth}
              strokeLinecap="butt"
              className="dark:stroke-gray-600"
            />
            <path
              d={topArcPath}
              fill="none"
              stroke={`url(#gradient-dealer-eff-${uniqueId})`}
              strokeWidth={CHART.strokeWidth}
              strokeLinecap="butt"
              strokeDasharray={semicircleLength}
              strokeDashoffset={progressOffset}
              style={{
                transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
              }}
            />

            <text
              x={start.x}
              y={start.y + CHART.labelOffset}
              textAnchor="middle"
              className="text-sm font-medium fill-gray-600 dark:fill-gray-400"
            >
              {formatVal(startVal)}
            </text>
            <text
              x={end.x}
              y={end.y + CHART.labelOffset}
              textAnchor="middle"
              className="text-sm font-medium fill-gray-600 dark:fill-gray-400"
            >
              {formatVal(endVal)}
            </text>
            <text
              x={cx}
              y={cy}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-gray-900 dark:fill-gray-100 font-extrabold tabular-nums"
              style={{ fontSize: 28 }}
            >
              {percentage}%
            </text>
            {/* <text
              x={fillBoundary.x}
              y={fillBoundary.y + CHART.valueBelowArc}
              textAnchor="middle"
              className="text-sm font-semibold fill-gray-900 dark:fill-gray-100"
            >
              {formatVal(valueAtEnd)}
            </text> */}
          </svg>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-6 bg-gray-50/90 dark:bg-gray-800 p-4 rounded-none border border-gray-100/50 dark:border-gray-700/50">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-3.5 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-500" />
          <span className="text-[#4A5568] dark:text-gray-300 text-xs font-semibold">
            Actual Cost: <span className="font-bold text-gray-900 dark:text-gray-100 tabular-nums">{formatVal(amount)}</span>
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-3.5 rounded-full"
            style={{ background: `linear-gradient(135deg, ${color}, ${gradientEnd})` }}
          />
          <span className="text-[#4A5568] dark:text-gray-300 text-xs font-semibold">
            {legendLabel}: <span className="font-bold text-gray-900 dark:text-gray-100 tabular-nums">{formatVal(valueAtEnd)}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

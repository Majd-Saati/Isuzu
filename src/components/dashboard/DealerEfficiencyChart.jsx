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
  radius: 130,
  size: 420,
  strokeWidth: 36,
  labelOffset: 40,
  percentAboveArc: 56,
  valueBelowArc: 28,
};

const formatVal = (v) => {
  const num = Number(v);
  if (isNaN(num)) return '0.00';
  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

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
  const formattedPercentage = percentage.toFixed(2);
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
    support_cost != null ? support_cost : (percentage / 100) * (amount || 0);
  const endVal = endValue ?? amount;
  const startVal = startValue ?? 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-4 md:p-5 w-full border border-gray-200/80 dark:border-gray-700/80 shadow-sm hover:shadow-md dark:shadow-none dark:hover:shadow-none transition-all duration-300">
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

      <div className="flex justify-center mb-5 w-full">
        <div
          className="relative drop-shadow-sm w-full max-w-full"
          style={{ width: CHART.size, maxWidth: '100%', aspectRatio: '1' }}
        >
          {isLoading ? (
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
          ) : (
          <svg
            className="relative z-10 w-full h-full min-w-0"
            viewBox={`0 0 ${CHART.size} ${CHART.size}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id={`gradient-dealer-eff-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={color} />
                <stop offset="100%" stopColor={gradientEnd} />
              </linearGradient>
            </defs>

            {/* Track */}
            <path
              d={topArcPath}
              fill="none"
              stroke="currentColor"
              strokeWidth={CHART.strokeWidth}
              strokeLinecap="butt"
              className="text-gray-200 dark:text-gray-600"
            />

            {/* Progress arc with gradient and soft glow */}
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
                filter: 'drop-shadow(0 2px 8px rgba(239, 90, 111, 0.35))',
              }}
            />

            <text
              x={start.x}
              y={start.y + CHART.labelOffset}
              textAnchor="middle"
              className="text-sm font-semibold fill-gray-500 dark:fill-gray-400 tabular-nums"
            >
              {formatVal(startVal)}
            </text>
            <text
              x={end.x}
              y={end.y + CHART.labelOffset}
              textAnchor="middle"
              className="text-sm font-semibold fill-gray-500 dark:fill-gray-400 tabular-nums"
            >
              {formatVal(endVal)}
            </text>

            {/* Center: soft circle + percentage */}
            <circle cx={cx} cy={cy} r={52} className="fill-gray-100/90 dark:fill-gray-800/90" />
            <text
              x={cx}
              y={cy}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-gray-900 dark:fill-gray-100 font-extrabold tabular-nums"
              style={{ fontSize: 38, letterSpacing: '-0.02em' }}
            >
              {formattedPercentage}%
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

      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 bg-gray-50 dark:bg-gray-800/80 px-5 py-4 rounded-lg border border-gray-100 dark:border-gray-700/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-4 rounded-md bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 shrink-0" />
          <span className="text-[#4A5568] dark:text-gray-300 text-sm font-medium">
            Actual Cost: <span className="font-bold text-gray-900 dark:text-gray-100 tabular-nums">{formatVal(amount)}</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-4 rounded-md shrink-0"
            style={{ background: `linear-gradient(135deg, ${color}, ${gradientEnd})` }}
          />
          <span className="text-[#4A5568] dark:text-gray-300 text-sm font-medium">
            {legendLabel}: <span className="font-bold text-gray-900 dark:text-gray-100 tabular-nums">{formatVal(valueAtEnd)}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

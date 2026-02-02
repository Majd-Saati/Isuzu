import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export const DealerEfficiencyChart = ({ data }) => {
  const [activeView, setActiveView] = useState('budget');

  // Default data with toggle functionality
  const defaultData = {
    budget: {
      title: 'Budget Vs Support Amount',
      amount: 2000,
      percentage: 20,
      color: '#EF5A6F',
      legendLabel: 'Budget'
    },
    expense: {
      title: 'Expense Vs Support Amount',
      amount: 4200,
      percentage: 60,
      color: '#4A90E2',
      legendLabel: 'Expense'
    }
  };

  // If data prop is provided, use it directly; otherwise use toggle mode
  const isToggleMode = !data;
  const currentData = data || defaultData[activeView];

  const toggleView = () => {
    if (isToggleMode) {
      setActiveView(activeView === 'budget' ? 'expense' : 'budget');
    }
  };

  // Half horizontal circle: top semicircle arc (left 0% → right 100%) — enlarged
  const radius = 100;
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const semicircleLength = Math.PI * radius;
  const progressOffset = semicircleLength - (currentData.percentage / 100) * semicircleLength;
  const strokeWidth = 28;

  const polarToCartesian = (angleDeg) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };
  // Arc on TOP (rainbow / inverted U): flat at bottom, curved at top. Sweep 1 = clockwise = top arc.
  const start = polarToCartesian(270);
  const end = polarToCartesian(90);
  const topArcPath = `M ${start.x} ${start.y} A ${radius} ${radius} 0 1 1 ${end.x} ${end.y}`;

  // Scale: start 0 → end amount. Value at fill boundary = percentage of amount.
  const startValue = 0;
  const endValue = currentData.amount;
  const valueAtEnd = Math.round((currentData.percentage / 100) * currentData.amount);
  // End of red (filled) area: angle and point on arc where fill meets gray
  const fillBoundaryAngle = 270 - (currentData.percentage / 100) * 180;
  const fillBoundary = polarToCartesian(fillBoundaryAngle);
  const formatVal = (v) => v.toLocaleString();
  const labelOffset = 32;
  const valueAboveArcOffset = 36;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-none p-6 md:p-7 shadow-[0px_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0px_6px_24px_rgba(0,0,0,0.3)] w-full border border-gray-100 dark:border-gray-800 animate-fade-in hover:shadow-[0px_8px_32px_rgba(0,0,0,0.12)] dark:hover:shadow-[0px_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 backdrop-blur-sm bg-white/98 dark:bg-gray-900">
      {/* Header */}
      {isToggleMode ? (
        <>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-7 w-1 bg-gradient-to-b from-[#EF5A6F] to-[#4A90E2] rounded-full"></div>
            <h3 className="text-[#1F2937] dark:text-gray-100 text-lg md:text-xl font-bold">Dealer Efficiency</h3>
          </div>

          {/* Toggle Button */}
          <button
            onClick={toggleView}
            className="flex items-center justify-between w-full mb-8 group"
          >
            <span className="text-[#78716c] dark:text-gray-400 text-sm font-semibold">
              {currentData.title}
            </span>
            <svg width="8" height="13" viewBox="0 0 8 13" fill="none" className="group-hover:translate-x-1 transition-transform duration-300">
              <path d="M1 1L6.5 6.5L1 12" stroke={currentData.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      ) : (
        <div className="mb-6">
          <h3 className="text-[#4A5568] dark:text-gray-300 text-base font-semibold">{currentData.title}</h3>
        </div>
      )}

      {/* Half horizontal circle (semicircle) progress chart — enlarged */}
      <div className="flex items-center justify-center mb-8">
        <div className="relative animate-scale-in" style={{ width: size, height: size }}>
          <svg className="relative z-10 w-full h-full" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <defs>
              <linearGradient id={`gradient-${activeView}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={currentData.color} />
                <stop offset="100%" stopColor={activeView === 'budget' ? '#f5999c' : '#6bb4f7'} />
              </linearGradient>
            </defs>
            {/* Background semicircle (gray) — straight edges */}
            <path
              d={topArcPath}
              fill="none"
              stroke="#D1D5DB"
              strokeWidth={strokeWidth}
              strokeLinecap="butt"
              className="dark:stroke-gray-600"
            />
            {/* Progress semicircle (filled left → right) — straight edges */}
            <path
              d={topArcPath}
              fill="none"
              stroke={isToggleMode ? `url(#gradient-${activeView})` : currentData.color}
              strokeWidth={strokeWidth}
              strokeLinecap="butt"
              strokeDasharray={semicircleLength}
              strokeDashoffset={progressOffset}
              style={{
                transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
              }}
            />
            {/* Starting value (left end) — position from arc start */}
            <text
              x={start.x}
              y={start.y + labelOffset}
              textAnchor="middle"
              className="text-sm font-medium fill-gray-600 dark:fill-gray-400"
            >
              {formatVal(startValue)}
            </text>
            {/* Ending value (right end) — position from arc end */}
            <text
              x={end.x}
              y={end.y + labelOffset}
              textAnchor="middle"
              className="text-sm font-medium fill-gray-600 dark:fill-gray-400"
            >
              {formatVal(endValue)}
            </text>
            {/* Current value above the arc (just above the fill boundary point on the arc) */}
            <text
              x={fillBoundary.x}
              y={fillBoundary.y - 190}
              textAnchor="middle"
              className="text-sm font-semibold fill-gray-900 dark:fill-gray-100"
            >
              {formatVal(valueAtEnd)}
            </text>
          </svg>

          {/* Percentage in the middle of the semicircle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[#1F2937] dark:text-gray-100 text-3xl md:text-4xl font-extrabold animate-scale-in tabular-nums">
              {currentData.percentage}%
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 bg-gray-50/90 dark:bg-gray-800 p-4 rounded-none border border-gray-100/50 dark:border-gray-700/50 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-3.5 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-500 shadow-sm"></div>
          <span className="text-[#4A5568] dark:text-gray-300 text-xs font-semibold">Support Amt</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-3.5 rounded-full shadow-sm"
            style={{
              background: isToggleMode
                ? `linear-gradient(135deg, ${currentData.color}, ${activeView === 'budget' ? '#f5999c' : '#6bb4f7'})`
                : currentData.color
            }}
          ></div>
          <span className="text-[#4A5568] dark:text-gray-300 text-xs font-semibold">{currentData.legendLabel}</span>
        </div>
      </div>
    </div>
  );
};

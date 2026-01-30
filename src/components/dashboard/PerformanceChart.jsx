import React, { useState, useEffect, useMemo } from 'react';

export const PerformanceChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('yearly');
  const [selectedTerm, setSelectedTerm] = useState('Term_I_2025');

  // Two datasets: yearly (monthly data) and monthly (weekly data)
  const yearlyData = [
    { label: 'Jan', budget: 70, expense: 70 },
    { label: 'Feb', budget: 120, expense: 40 },
    { label: 'Mar', budget: 120, expense: 50 },
    { label: 'Apr', budget: 520, expense: 120 },
    { label: 'May', budget: 530, expense: 140 },
    { label: 'Jun', budget: 80, expense: 60 },
    { label: 'Jul', budget: 80, expense: 70 }
  ];

  const monthlyData = [
    { label: 'First Week', budget: 80, expense: 60 },
    { label: 'Second Week', budget: 130, expense: 90 },
    { label: 'Third Week', budget: 140, expense: 80 },
    { label: 'Forth Week', budget: 110, expense: 85 }
  ];

  const [mounted, setMounted] = useState(false);

  // Trigger animation on mount
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const activeData = selectedPeriod === 'yearly' ? yearlyData : monthlyData;

  // Use fixed axis ticks to match reference: 500, 100, 50, 0
  const fixedMax = 500;
  const maxPixelHeight = 220; // px for the tallest bar drawn
  const gridTicks = [500, 100, 50, 0];
  const gridTickLabels = gridTicks.map((v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`));

  // helper to convert data value to a scaled pixel height relative to fixedMax
  const scaled = (value) => (fixedMax === 0 ? 0 : Math.round((value / fixedMax) * maxPixelHeight));

  return (
    <div className="bg-white dark:bg-gray-900 shadow-[0px_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0px_6px_24px_rgba(0,0,0,0.3)] flex w-full flex-col items-stretch px-6 md:px-8 py-6 md:py-8 rounded-[28px] border border-gray-100 dark:border-gray-800 animate-fade-in hover:shadow-[0px_8px_32px_rgba(0,0,0,0.12)] dark:hover:shadow-[0px_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 backdrop-blur-sm bg-white/98 dark:bg-gray-900">
      {/* Header Section */}
      <div className="flex items-start justify-between gap-5 flex-wrap">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 bg-gradient-to-b from-[#EC7B79] to-[#e8566e] rounded-full"></div>
          <div className="text-[#1F2937] dark:text-gray-100 text-xl md:text-[22px] font-bold leading-tight">
            Dealer Performance
          </div>
        </div>
        
        {/* Right Controls */}
        <div className="flex flex-col items-end gap-4">
          {/* Period Toggle */}
          <div className="flex items-center gap-6 bg-gray-50/90 dark:bg-gray-800 rounded-2xl p-1.5 shadow-inner border border-gray-100/50 dark:border-gray-700/50">
            <button
              onClick={() => setSelectedPeriod('yearly')}
              className={`relative px-4 py-2 rounded-xl transition-all duration-300 ${
                selectedPeriod === 'yearly' 
                  ? 'bg-white dark:bg-gray-700 shadow-md text-[#1F2937] dark:text-gray-100 font-bold' 
                  : 'text-[#9CA3AF] dark:text-gray-400 font-medium hover:text-[#6B7280] dark:hover:text-gray-300'
              }`}
            >
              Yearly
            </button>
            <button
              onClick={() => setSelectedPeriod('monthly')}
              className={`relative px-4 py-2 rounded-xl transition-all duration-300 ${
                selectedPeriod === 'monthly'
                  ? 'bg-white dark:bg-gray-700 shadow-md text-[#1F2937] dark:text-gray-100 font-bold'
                  : 'text-[#9CA3AF] dark:text-gray-400 font-medium hover:text-[#6B7280] dark:hover:text-gray-300'
              }`}
            >
              Monthly
            </button>
          </div>
          
          {/* Term Selector */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-amber-50/90 dark:from-amber-900/20 via-amber-50/70 dark:via-amber-900/20 to-yellow-50/90 dark:to-yellow-900/20 text-[#78716c] dark:text-amber-300 text-sm font-bold px-5 py-2.5 rounded-xl border border-amber-100/80 dark:border-amber-800 shadow-sm">
              Term_I_2025
            </div>
            <button className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg hover:scale-110 transition-all duration-200 flex items-center justify-center w-9 h-9 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600">
              <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
                <path d="M1 1L4 4L7 1" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="flex w-full max-w-full items-stretch gap-4 flex-wrap mt-10">
        {/* Y-axis labels */}
        <div className="text-[#9CA3AF] dark:text-gray-400 text-right text-sm font-semibold leading-[46px] w-[50px] pt-2">
          {gridTickLabels.map((label, i) => (
            <div key={i} className="hover:text-[#6B7280] dark:hover:text-gray-300 transition-colors">{label}</div>
          ))}
        </div>

        {/* Chart area */}
        <div className="flex-1">
            <div className="relative bg-gradient-to-b from-gray-50/40 dark:from-gray-800/30 via-gray-50/20 dark:via-gray-800/20 to-transparent rounded-2xl p-4 border border-gray-100/30 dark:border-gray-700/30">
            {/* horizontal grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none px-4">
              {gridTicks.map((_, i) => (
                <div key={i} className="border-t border-gray-200/60 dark:border-gray-700/60" />
              ))}
            </div>

            {/* Bars */}
            <div className="relative z-10 flex justify-center">
              <div className={`flex items-end ${selectedPeriod === 'yearly' ? 'gap-7' : 'gap-12'} py-6`}> 
                {activeData.map((d, idx) => (
                  <div key={idx} className="flex flex-col items-center group">
                    <div className={`flex items-end ${selectedPeriod === 'yearly' ? 'gap-2' : 'gap-4'}`}>
                      {/* Budget bar (red/coral) */}
                      <div
                        className="bg-gradient-to-t from-[#EC7B79] to-[#f5999c] rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer relative overflow-hidden"
                        style={{
                          width: selectedPeriod === 'yearly' ? 18 : 52,
                          height: mounted ? `${scaled(d.budget)}px` : '0px',
                          transformOrigin: 'bottom',
                          transition: `height 700ms cubic-bezier(.2,.8,.2,1) ${idx * 90}ms, transform 200ms ease, box-shadow 200ms ease`
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scaleY(1.03) scaleX(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scaleY(1) scaleX(1)'}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20"></div>
                      </div>

                      {/* Expense bar (gray) */}
                      <div
                        className="bg-gradient-to-t from-[#CBD5E0] to-[#E2E8F0] rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer relative overflow-hidden"
                        style={{
                          width: selectedPeriod === 'yearly' ? 16 : 44,
                          height: mounted ? `${scaled(d.expense)}px` : '0px',
                          transformOrigin: 'bottom',
                          transition: `height 700ms cubic-bezier(.2,.8,.2,1) ${idx * 90 + 40}ms, transform 200ms ease, box-shadow 200ms ease`
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scaleY(1.03) scaleX(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scaleY(1) scaleX(1)'}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/30"></div>
                      </div>
                    </div>
                    <div className="text-[#9CA3AF] dark:text-gray-400 text-[13px] font-semibold mt-4 text-center min-w-[60px] group-hover:text-[#6B7280] dark:group-hover:text-gray-300 transition-colors">{d.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="self-center flex items-center gap-8 mt-8 bg-gray-50/90 dark:bg-gray-800 px-6 py-3 rounded-2xl border border-gray-100/50 dark:border-gray-700/50 shadow-sm">
        <div className="flex items-center gap-3 hover-scale cursor-pointer">
          <div className="w-8 h-3.5 bg-gradient-to-r from-[#CBD5E0] to-[#E2E8F0] dark:from-gray-600 dark:to-gray-500 rounded-full shadow-sm" />
          <span className="text-[#4A5568] dark:text-gray-300 text-sm font-semibold">Expense</span>
        </div>
        <div className="flex items-center gap-3 hover-scale cursor-pointer">
          <div className="w-8 h-3.5 bg-gradient-to-r from-[#EC7B79] to-[#f5999c] rounded-full shadow-sm" />
          <span className="text-[#4A5568] dark:text-gray-300 text-sm font-semibold">Budget</span>
        </div>
      </div>
    </div>
  );
};

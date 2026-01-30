import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export const DealerEfficiencyChart = ({ data }) => {
  const [activeView, setActiveView] = useState('budget');

  // Default data with toggle functionality
  const defaultData = {
    budget: {
      title: 'Budget Vs Support Amount',
      amount: 5950,
      percentage: 70,
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
  
  // Calculate the circle progress
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (currentData.percentage / 100) * circumference;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-[28px] p-6 md:p-7 shadow-[0px_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0px_6px_24px_rgba(0,0,0,0.3)] w-full border border-gray-100 dark:border-gray-800 animate-fade-in hover:shadow-[0px_8px_32px_rgba(0,0,0,0.12)] dark:hover:shadow-[0px_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 backdrop-blur-sm bg-white/98 dark:bg-gray-900">
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
              <path d="M1 1L6.5 6.5L1 12" stroke={currentData.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </>
      ) : (
        <div className="mb-6">
          <h3 className="text-[#4A5568] dark:text-gray-300 text-base font-semibold">{currentData.title}</h3>
        </div>
      )}

      {/* Circular Progress Chart */}
      <div className="flex items-center justify-center mb-8">
        <div className="relative animate-scale-in" style={{ width: '220px', height: '220px' }}>
          {/* Glow Effect */}
          <div 
            className="absolute inset-0 rounded-full blur-2xl opacity-20 animate-pulse"
            style={{ backgroundColor: currentData.color }}
          ></div>
          
          <svg className="transform -rotate-90 relative z-10" width="220" height="220">
            {/* Background Circle */}
            <circle
              cx="110"
              cy="110"
              r={radius}
              stroke="#D1D5DB"
              strokeWidth="22"
              fill="none"
            />
            {/* Progress Circle with gradient */}
            <defs>
              <linearGradient id={`gradient-${activeView}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={currentData.color} />
                <stop offset="100%" stopColor={activeView === 'budget' ? '#f5999c' : '#6bb4f7'} />
              </linearGradient>
            </defs>
            <circle
              cx="110"
              cy="110"
              r={radius}
              stroke={isToggleMode ? `url(#gradient-${activeView})` : currentData.color}
              strokeWidth="22"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ 
                transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
              }}
            />
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-[#1F2937] dark:text-gray-100 text-3xl font-extrabold animate-scale-in">
              ${currentData.amount.toLocaleString()}
            </div>
            <div 
              className="mt-3 px-4 py-2 rounded-full text-white text-sm font-bold shadow-lg animate-fade-in"
              style={{ 
                background: isToggleMode 
                  ? `linear-gradient(135deg, ${currentData.color}, ${activeView === 'budget' ? '#f5999c' : '#6bb4f7'})`
                  : currentData.color
              }}
            >
              {currentData.percentage}%
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 bg-gray-50/90 dark:bg-gray-800 p-4 rounded-2xl border border-gray-100/50 dark:border-gray-700/50 shadow-sm">
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

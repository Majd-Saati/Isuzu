import React, { useState } from 'react';
import { DollarSign, TrendingUp, Award, Wallet, TrendingDown } from 'lucide-react';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const formatCompact = (value) => {
  const num = Number(value) || 0;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const cards = [
  {
    key: 'actual_cost',
    label: 'Actual cost',
    icon: DollarSign,
    gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-700 dark:text-emerald-300',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
  },
  {
    key: 'support_cost',
    label: 'Support cost',
    icon: TrendingUp,
    gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-700 dark:text-blue-300',
    iconBg: 'bg-blue-100 dark:bg-blue-900/40',
  },
  {
    key: 'total_cost',
    label: 'Total cost',
    icon: Wallet,
    gradient: 'bg-gradient-to-br from-amber-500 to-orange-600',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-700 dark:text-amber-300',
    iconBg: 'bg-amber-100 dark:bg-amber-900/40',
  },
  {
    key: 'incentive',
    label: 'Incentive',
    icon: Award,
    gradient: 'bg-gradient-to-br from-[#E60012] to-rose-600',
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-700 dark:text-red-300',
    iconBg: 'bg-red-100 dark:bg-red-900/40',
  },
];

export const MarketingChartsTotals = ({ totals }) => {
  const [hoveredCard, setHoveredCard] = useState(null);

  if (!totals || typeof totals !== 'object') return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ key, label, icon: Icon, gradient, bg, border, text, iconBg }, index) => {
        const value = totals[key];
        const isHovered = hoveredCard === key;
        
        return (
          <div
            key={key}
            onMouseEnter={() => setHoveredCard(key)}
            onMouseLeave={() => setHoveredCard(null)}
            className={`group relative rounded-2xl border-2 ${border} ${bg} p-5 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-1 cursor-pointer overflow-hidden animate-fade-in`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${iconBg} transition-transform duration-300 ${isHovered ? 'scale-110 rotate-6' : ''}`}>
                  <Icon className={`w-5 h-5 ${text}`} />
                </div>
                <div className="text-right">
                  <div className={`text-xs font-semibold uppercase tracking-wider ${text} opacity-70`}>
                    {label}
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 transition-all duration-300">
                  {formatCurrency(value)}
                </p>
                <p className={`text-xs font-medium ${text} opacity-60`}>
                  {formatCompact(value)} total
                </p>
              </div>
            </div>

            {/* Animated shine effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        );
      })}
    </div>
  );
};

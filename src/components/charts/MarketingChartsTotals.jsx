import React from 'react';
import { DollarSign, TrendingUp, Award, Wallet, TrendingDown } from 'lucide-react';
import { MoneyGlyph } from '@/components/dashboard/MoneyGlyph';
import { formatChartsCurrency } from '@/lib/dashboardMoney';

const formatCompact = (value) => {
  const num = Number(value) || 0;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const cards = [
  {
    key: 'actual_cost',
    label: 'Actual Cost',
    icon: DollarSign,
    useMoneyGlyph: true,
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
    key: 'allocated_budget',
    label: 'Budget',
    icon: Wallet,
    gradient: 'bg-gradient-to-br from-purple-500 to-violet-600',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-200 dark:border-purple-800',
    text: 'text-purple-700 dark:text-purple-300',
    iconBg: 'bg-purple-100 dark:bg-purple-900/40',
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

export const MarketingChartsTotals = ({
  totals,
  budgetAllocation,
  isAdmin = false,
  currencyCode = '',
}) => {
  if (!totals || typeof totals !== 'object') return null;

  const visibleCards = cards.filter((c) => {
    if (c.key === 'actual_cost' || c.key === 'support_cost') return true;
    if (c.key === 'allocated_budget') {
      return budgetAllocation?.allocated_budget_total_jpy != null;
    }
    return false;
  });

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${visibleCards.length >= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
      {visibleCards.map(({ key, label, icon: Icon, useMoneyGlyph, bg, border, text, iconBg }, index) => {
        const value =
          key === 'allocated_budget'
            ? budgetAllocation?.allocated_budget_total_jpy
            : totals[key];
        
        return (
          <div
            key={key}
            className={`relative rounded-2xl border-2 ${border} ${bg} p-5 overflow-hidden animate-fade-in`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${iconBg}`}>
                  {useMoneyGlyph ? (
                    <MoneyGlyph isAdmin={isAdmin} currencyCode={currencyCode} className={`w-5 h-5 ${text}`} />
                  ) : (
                    <Icon className={`w-5 h-5 ${text}`} />
                  )}
                </div>
                <div className="text-right">
                  <div className={`text-xs font-semibold uppercase tracking-wider ${text} opacity-70`}>
                    {label}
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {formatChartsCurrency(value, isAdmin, currencyCode)}
                </p>
                <p className={`text-xs font-medium ${text} opacity-60`}>
                  {formatCompact(value)} total
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

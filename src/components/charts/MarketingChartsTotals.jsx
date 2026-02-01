import React from 'react';
import { DollarSign, TrendingUp, Award, Wallet } from 'lucide-react';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const cards = [
  {
    key: 'actual_cost',
    label: 'Actual cost',
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-700 dark:text-emerald-300',
  },
  {
    key: 'support_cost',
    label: 'Support cost',
    icon: TrendingUp,
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-700 dark:text-blue-300',
  },
  {
    key: 'total_cost',
    label: 'Total cost',
    icon: Wallet,
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-700 dark:text-amber-300',
  },
  {
    key: 'incentive',
    label: 'Incentive',
    icon: Award,
    color: 'from-[#E60012] to-rose-600',
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-700 dark:text-red-300',
  },
];

export const MarketingChartsTotals = ({ totals }) => {
  if (!totals || typeof totals !== 'object') return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ key, label, icon: Icon, bg, border, text }) => {
        const value = totals[key];
        return (
          <div
            key={key}
            className={`rounded-xl border-2 ${border} ${bg} p-4 transition-shadow hover:shadow-md`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-4 h-4 ${text}`} />
              <span className={`text-xs font-medium uppercase tracking-wide ${text}`}>
                {label}
              </span>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {formatCurrency(value)}
            </p>
          </div>
        );
      })}
    </div>
  );
};

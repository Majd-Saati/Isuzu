import React from 'react';
import { formatDealerCardMoney } from '@/lib/dashboardMoney';

export const SummaryCards = ({
  totalActualCost,
  totalSupportCost,
  allocatedBudget,
  isAdmin = false,
  currencyCode = '',
}) => {
  const cards = [
    {
      label: 'Actual Cost',
      value: totalActualCost,
      gradient: 'from-green-50 to-white',
      darkGradient: 'dark:from-gray-800 dark:to-gray-900',
      border: 'border-green-100',
      darkBorder: 'dark:border-gray-700',
      textColor: 'text-[#10B981]',
      darkTextColor: 'dark:text-emerald-400',
      bgColor: 'bg-green-100',
      darkBgColor: 'dark:bg-gray-700',
      dotColor: 'bg-[#10B981]',
      darkDotColor: 'dark:bg-emerald-400',
    },
    {
      label: 'Support Cost',
      value: totalSupportCost,
      gradient: 'from-blue-50 to-white',
      darkGradient: 'dark:from-gray-800 dark:to-gray-900',
      border: 'border-blue-100',
      darkBorder: 'dark:border-gray-700',
      textColor: 'text-[#3b82f6]',
      darkTextColor: 'dark:text-blue-300',
      bgColor: 'bg-blue-100',
      darkBgColor: 'dark:bg-gray-700',
      dotColor: 'bg-[#3b82f6]',
      darkDotColor: 'dark:bg-blue-400',
    },
    {
      label: 'Allocated Budget',
      value: allocatedBudget,
      gradient: 'from-purple-50 to-white',
      darkGradient: 'dark:from-gray-800 dark:to-gray-900',
      border: 'border-purple-100',
      darkBorder: 'dark:border-gray-700',
      textColor: 'text-[#9333ea]',
      darkTextColor: 'dark:text-purple-300',
      bgColor: 'bg-purple-100',
      darkBgColor: 'dark:bg-gray-700',
      dotColor: 'bg-[#9333ea]',
      darkDotColor: 'dark:bg-purple-400',
    },
  ].filter((card) => card.label !== 'Allocated Budget' || allocatedBudget != null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-gradient-to-br ${card.gradient} ${card.darkGradient} rounded-xl border-2 ${card.border} ${card.darkBorder} p-5`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{card.label}</p>
              <p className={`text-2xl font-bold ${card.textColor} ${card.darkTextColor}`}>
                {formatDealerCardMoney(card.value, isAdmin, currencyCode)}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-full ${card.bgColor} ${card.darkBgColor} flex items-center justify-center`}>
              <div className={`w-6 h-6 rounded-full ${card.dotColor} ${card.darkDotColor}`}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

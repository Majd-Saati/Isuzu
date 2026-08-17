import React from 'react';
import { formatDealerCardMoney } from '@/lib/dashboardMoney';
import { BUDGET_TYPE_COLORS } from './budgetTypeColors';

export const SummaryCards = ({
  totalEstimatedCost,
  totalActualCost,
  totalSupportCost,
  allocatedBudget,
  isAdmin = false,
  currencyCode = '',
}) => {
  const cards = [
    { label: 'Estimated Cost', value: totalEstimatedCost, ...BUDGET_TYPE_COLORS.estimated },
    { label: 'Actual Cost', value: totalActualCost, ...BUDGET_TYPE_COLORS.actual },
    { label: 'Support Cost', value: totalSupportCost, ...BUDGET_TYPE_COLORS.support },
    { label: 'Allocated Budget', value: allocatedBudget, ...BUDGET_TYPE_COLORS.allocated },
  ].filter((card) => card.label !== 'Allocated Budget' || allocatedBudget != null);

  const gridColsClass =
    cards.length >= 4
      ? 'lg:grid-cols-4'
      : cards.length === 3
        ? 'lg:grid-cols-3'
        : 'lg:grid-cols-2';

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${gridColsClass}`}>
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

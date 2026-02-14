import React from 'react';

export const SummaryCards = ({ totalActualCost, totalSupportCost }) => {
  // Only show Actual and Support cards per request. Other cards kept commented for reference.
  const cards = [
    {
      label: 'Actual cost',
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
      darkDotColor: 'dark:bg-emerald-400'
    },
    {
      label: 'Support cost',
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
      darkDotColor: 'dark:bg-blue-400'
    },
    // Original cards (commented):
    // { label: 'Total Budget', value: totalBudget, ... }
    // { label: 'Total Expenditure', value: totalExpenditure, ... }
    // { label: 'Total Incentive', value: totalIncentive, ... }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <div 
          key={index}
          className={`bg-gradient-to-br ${card.gradient} ${card.darkGradient} rounded-xl border-2 ${card.border} ${card.darkBorder} p-5 hover:shadow-md dark:hover:shadow-lg transition-all duration-300`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{card.label}</p>
              <p className={`text-2xl font-bold ${card.textColor} ${card.darkTextColor}`}>
                {card.value.toLocaleString()}
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

import React from 'react';

export const SummaryCards = ({ totalBudget, totalExpenditure, totalIncentive }) => {
  const cards = [
    {
      label: 'Total Budget',
      value: totalBudget,
      gradient: 'from-red-50 to-white',
      darkGradient: 'dark:from-gray-800 dark:to-gray-900',
      border: 'border-red-100',
      darkBorder: 'dark:border-gray-700',
      textColor: 'text-[#D22827]',
      darkTextColor: 'dark:text-red-400',
      bgColor: 'bg-red-100',
      darkBgColor: 'dark:bg-gray-700',
      dotColor: 'bg-[#D22827]',
      darkDotColor: 'dark:bg-red-400'
    },
    {
      label: 'Total Expenditure',
      value: totalExpenditure,
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
      label: 'Total Incentive',
      value: totalIncentive,
      gradient: 'from-gray-50 to-white',
      darkGradient: 'dark:from-gray-800 dark:to-gray-900',
      border: 'border-gray-200',
      darkBorder: 'dark:border-gray-700',
      textColor: 'text-[#6B7280]',
      darkTextColor: 'dark:text-gray-300',
      bgColor: 'bg-gray-100',
      darkBgColor: 'dark:bg-gray-700',
      dotColor: 'bg-[#6B7280]',
      darkDotColor: 'dark:bg-gray-400'
    }
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

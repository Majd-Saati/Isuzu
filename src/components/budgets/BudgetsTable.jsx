import React from 'react';

const budgetsData = [
  {
    id: '1',
    dealer: {
      name: '5V',
      icon: 'https://api.builder.io/api/v1/image/assets/132ea46dcd5a44718cd3517d9e4e8249/a65f9c4712b0fadbb1d8e2cbd2f10d262763d56d?placeholderIfAbsent=true'
    },
    q1: '30,000.00',
    q2: '20,000.00',
    q3: '20,000.00',
    total: '70,000.00'
  },
  {
    id: '2',
    dealer: {
      name: 'QTA',
      icon: 'https://api.builder.io/api/v1/image/assets/132ea46dcd5a44718cd3517d9e4e8249/2fae993f08dfceafd0ea7c720d1d39f4bb06d032?placeholderIfAbsent=true'
    },
    q1: '30,000.00',
    q2: '30,000.00',
    q3: '20,000.00',
    total: '80,000.00'
  },
  {
    id: '3',
    dealer: {
      name: 'JMTC',
      icon: 'https://api.builder.io/api/v1/image/assets/132ea46dcd5a44718cd3517d9e4e8249/9efd6052562995a71194bd2ad9bed939ea317ed4?placeholderIfAbsent=true'
    },
    q1: '20,000.00',
    q2: '20,000.00',
    q3: '10,000.00',
    total: '50,000.00'
  }
];

export const BudgetsTable = () => {
  return (
    <div className="bg-white dark:bg-gray-900 overflow-hidden rounded-[20px] shadow-[0px_4px_16px_rgba(0,0,0,0.06)] border-2 border-gray-100 dark:border-gray-800">
      {/* Table Header */}
      <div className="grid grid-cols-5 border-b-2 border-gray-200 dark:border-gray-700 bg-gradient-to-b from-gray-50 dark:from-gray-800 to-white dark:to-gray-900">
        <div className="px-8 py-5 text-sm font-semibold text-[#6B7280] dark:text-gray-300 uppercase tracking-wide">Dealer</div>
        <div className="px-8 py-5 text-sm font-semibold text-[#6B7280] dark:text-gray-300 uppercase tracking-wide">Q1</div>
        <div className="px-8 py-5 text-sm font-semibold text-[#6B7280] dark:text-gray-300 uppercase tracking-wide">Q2</div>
        <div className="px-8 py-5 text-sm font-semibold text-[#6B7280] dark:text-gray-300 uppercase tracking-wide">Q3</div>
        <div className="px-8 py-5 text-sm font-semibold text-[#6B7280] dark:text-gray-300 uppercase tracking-wide">Total</div>
      </div>

      {/* Table Body */}
      <div>
        {budgetsData.map((row, index) => (
          <div 
            key={row.id}
            className={`grid grid-cols-5 transition-all duration-200 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 ${index < budgetsData.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}
          >
            {/* Dealer Column */}
            <div className="px-8 py-10 flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-sm transition-transform duration-200 hover:scale-110">
                <img
                  src={row.dealer.icon}
                  className="w-4 h-4 object-contain"
                  alt={row.dealer.name}
                />
              </div>
              <span className="text-sm text-[#374151] dark:text-gray-200 font-medium">{row.dealer.name}</span>
            </div>

            {/* Q1 Column */}
            <div className="px-8 py-10 flex items-center">
              <span className="text-sm text-[#6B7280] dark:text-gray-300 font-medium">{row.q1}</span>
            </div>

            {/* Q2 Column */}
            <div className="px-8 py-10 flex items-center">
              <span className="text-sm text-[#6B7280] dark:text-gray-300 font-medium">{row.q2}</span>
            </div>

            {/* Q3 Column */}
            <div className="px-8 py-10 flex items-center">
              <span className="text-sm text-[#6B7280] dark:text-gray-300 font-medium">{row.q3}</span>
            </div>

            {/* Total Column */}
            <div className="px-8 py-10 bg-gradient-to-r from-[#FFF9E6] dark:from-amber-900/20 to-[#FFFDF5] dark:to-amber-900/10 flex items-center border-l-2 border-[#FFE49E] dark:border-amber-700">
              <span className="text-sm text-[#374151] dark:text-gray-200 font-bold">{row.total}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

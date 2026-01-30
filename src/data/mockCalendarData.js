export const dealersList = [
  { id: 'mr-shelin', name: 'Mr. Shelin' },
  { id: 'dta', name: 'DTA' },
  { id: 'alm', name: 'ALM' },
];

export const marketingData = [
  {
    dealer: 'Mr. Shelin',
    plan: 'FY 2025 Marketing Term 1 (Apr-Sept)',
    exercises: [
      {
        name: 'May 2025',
        months: { apr: null, may: { budget: 1, expenditure: 2013 }, jun: null, jul: null, aug: null, sept: null },
        totalCost: 2013,
        incentive: 0
      },
      {
        name: 'June 2025',
        months: { apr: null, may: null, jun: { budget: 1, expenditure: 0 }, jul: null, aug: null, sept: null },
        totalCost: 0,
        incentive: 0
      },
      {
        name: 'July 2025',
        months: { apr: null, may: null, jun: null, jul: { budget: 1, expenditure: 0 }, aug: null, sept: null },
        totalCost: 0,
        incentive: 0
      },
      {
        name: 'August 2025',
        months: { apr: null, may: null, jun: null, jul: null, aug: { budget: 1, expenditure: 0 }, sept: null },
        totalCost: 0,
        incentive: 0
      },
    ]
  }
];

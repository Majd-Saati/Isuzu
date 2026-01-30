export const dealerNames = {
  'dta': 'DTA',
  'alm': 'ALM',
  'sv': 'SV',
  'zewed': 'Zewed',
  'jmtc': 'JMTC',
  'yemeco': 'Yemeco'
};

export const mockPlansData = [
  {
    id: 1,
    quarter: 'Q1',
    name: 'Name of Plan',
    description: 'plan description, goal and key message',
    activities: [
      {
        id: 1,
        name: 'Online Media Coverage',
        hasComment: true,
        commentCount: 2,
        hasAddIcon: false,
        duration: { start: '2024-04-01', end: '2024-09-30' },
        teamMember: { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', badge: '+3' },
        estimatedCost: 2800,
        actualCost: 2800,
        isOverBudget: false
      },
      {
        id: 2,
        name: 'Social Media Platforms',
        hasComment: false,
        commentCount: 0,
        hasAddIcon: true,
        duration: { start: '2024-04-01', end: '2024-09-30' },
        teamMember: { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', badge: null },
        estimatedCost: 3400,
        actualCost: 3400,
        isOverBudget: false
      },
      {
        id: 3,
        name: 'Design new landing page',
        hasComment: true,
        commentCount: 1,
        hasAddIcon: false,
        duration: { start: '2024-04-01', end: '2024-09-30' },
        teamMember: { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', badge: null },
        estimatedCost: 3900,
        actualCost: 3900,
        isOverBudget: false
      }
    ]
  },
  {
    id: 2,
    quarter: 'Q1',
    name: 'Name of Plan',
    description: 'plan description, goal and key message',
    activities: [
      {
        id: 4,
        name: 'Online Media Coverage',
        hasComment: true,
        commentCount: 2,
        hasAddIcon: false,
        duration: { start: '2024-04-01', end: '2024-09-30' },
        teamMember: { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4', badge: '+3' },
        estimatedCost: 2800,
        actualCost: 2800,
        isOverBudget: false
      },
      {
        id: 5,
        name: 'Social Media Platforms',
        hasComment: false,
        commentCount: 0,
        hasAddIcon: true,
        duration: { start: '2024-04-01', end: '2024-09-30' },
        teamMember: { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5', badge: null },
        estimatedCost: 3400,
        actualCost: 3400,
        isOverBudget: false
      },
      {
        id: 6,
        name: 'Design new landing page',
        hasComment: true,
        commentCount: 1,
        hasAddIcon: false,
        duration: { start: '2024-04-01', end: '2024-09-30' },
        teamMember: { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6', badge: null },
        estimatedCost: 3900,
        actualCost: 3900,
        isOverBudget: false
      }
    ]
  },
  {
    id: 3,
    quarter: 'Q1',
    name: 'Name of Plan',
    description: 'plan description, goal and key message',
    activities: [
      {
        id: 7,
        name: 'Online Media Coverage',
        hasComment: true,
        commentCount: 2,
        hasAddIcon: false,
        duration: { start: '2024-04-01', end: '2024-09-30' },
        teamMember: { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=7', badge: '+3' },
        estimatedCost: 2800,
        actualCost: 2800,
        isOverBudget: false
      },
      {
        id: 8,
        name: 'Social Media Platforms',
        hasComment: false,
        commentCount: 0,
        hasAddIcon: true,
        duration: { start: '2024-04-01', end: '2024-09-30' },
        teamMember: { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=8', badge: null },
        estimatedCost: 3400,
        actualCost: 3400,
        isOverBudget: false
      }
    ]
  }
];

export const mainNavigation = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'https://api.builder.io/api/v1/image/assets/132ea46dcd5a44718cd3517d9e4e8249/306777104bdeddf104ebd223cc9d72f9401a477a?placeholderIfAbsent=true'
  },
  {
    id: 'marketing-plans',
    label: 'Marketing Plans',
    path: '/marketing-plans',
    icon: 'https://api.builder.io/api/v1/image/assets/132ea46dcd5a44718cd3517d9e4e8249/88e9f980e003b1b85ae32ee2ea48585207ef1fca?placeholderIfAbsent=true'
  },
  {
    id: 'budgets-allocation',
    label: 'Budgets Allocation',
    path: '/budgets-allocation',
    icon: 'https://api.builder.io/api/v1/image/assets/132ea46dcd5a44718cd3517d9e4e8249/3cfd2b331b1afb96a08113cad2433d1e3d137c19?placeholderIfAbsent=true'
  },
  {
    id: 'charts',
    label: 'Charts',
    path: '/charts',
    icon: 'https://api.builder.io/api/v1/image/assets/132ea46dcd5a44718cd3517d9e4e8249/c491fe67f6552c296f95c36a207ae8a66a0d22b0?placeholderIfAbsent=true'
  }
];

export const otherNavigation = [
  {
    id: 'terms',
    label: 'Terms',
    path: '/terms',
    icon: 'https://api.builder.io/api/v1/image/assets/132ea46dcd5a44718cd3517d9e4e8249/776f48d8d283b3a0a1917e4791cc021387617f71?placeholderIfAbsent=true'
  },
  {
    id: 'calendar',
    label: 'Calendar',
    path: '/calendar',
    icon: 'https://api.builder.io/api/v1/image/assets/132ea46dcd5a44718cd3517d9e4e8249/776f48d8d283b3a0a1917e4791cc021387617f71?placeholderIfAbsent=true'
  },
  {
    id: 'countries',
    label: 'Countries',
    path: '/countries',
    icon: 'https://api.builder.io/api/v1/image/assets/132ea46dcd5a44718cd3517d9e4e8249/3f9b429e5d5f060d1c9b1f52786d8211f0949677?placeholderIfAbsent=true'
  },
  {
    id: 'companies',
    label: 'Companies',
    path: '/companies',
    icon: 'https://api.builder.io/api/v1/image/assets/132ea46dcd5a44718cd3517d9e4e8249/62dba4bfeeaa3bebdf505fd7a8dd415839b34d4b?placeholderIfAbsent=true'
  },
  {
    id: 'users',
    label: 'Users',
    path: '/users',
    icon: 'https://api.builder.io/api/v1/image/assets/132ea46dcd5a44718cd3517d9e4e8249/62dba4bfeeaa3bebdf505fd7a8dd415839b34d4b?placeholderIfAbsent=true'
  },
  {
    id: 'administrators',
    label: 'Administrators',
    path: '/administrators',
    icon: 'https://api.builder.io/api/v1/image/assets/132ea46dcd5a44718cd3517d9e4e8249/7bdd6dcc9f3393c7705099278ac25e23aecf4b22?placeholderIfAbsent=true'
  }
];

// dealersNavigation is now dynamic - fetched from companies API
// See useDealers hook in src/hooks/api/useCompanies.js

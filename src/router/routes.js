/**
 * Route path constants
 * Centralized route definitions for easy maintenance and refactoring
 */
export const ROUTES = {
  // Public routes
  LOGIN: '/login',
  ROOT: '/',
  
  // Protected routes
  DASHBOARD: '/dashboard',
  MARKETING_PLANS: '/marketing-plans',
  BUDGETS_ALLOCATION: '/budgets-allocation',
  ADMINISTRATORS: '/administrators',
  COMPANIES: '/companies',
  USERS: '/users',
  CHARTS: '/charts',
  COUNTRIES: '/countries',
  CALENDAR: '/calendar',
  TERMS: '/terms',
  
  // Fallback
  NOT_FOUND: '*',
};

/**
 * Route metadata for navigation and breadcrumbs
 */
export const ROUTE_METADATA = {
  [ROUTES.DASHBOARD]: {
    title: 'Dashboard',
    requiresAuth: true,
  },
  [ROUTES.MARKETING_PLANS]: {
    title: 'Marketing Plans',
    requiresAuth: true,
  },
  [ROUTES.BUDGETS_ALLOCATION]: {
    title: 'Budgets Allocation',
    requiresAuth: true,
  },
  [ROUTES.ADMINISTRATORS]: {
    title: 'Administrators',
    requiresAuth: true,
  },
  [ROUTES.COMPANIES]: {
    title: 'Companies',
    requiresAuth: true,
  },
  [ROUTES.USERS]: {
    title: 'Users',
    requiresAuth: true,
  },
  [ROUTES.CHARTS]: {
    title: 'Charts',
    requiresAuth: true,
  },
  [ROUTES.COUNTRIES]: {
    title: 'Countries',
    requiresAuth: true,
  },
  [ROUTES.CALENDAR]: {
    title: 'Calendar',
    requiresAuth: true,
  },
  [ROUTES.TERMS]: {
    title: 'Terms',
    requiresAuth: true,
  },
};


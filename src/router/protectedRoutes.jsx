import { ROUTES } from './routes';
import {
  Index,
  MarketingPlans,
  BudgetsAllocation,
  Administrators,
  Companies,
  UsersPage,
  Charts,
  Countries,
  Calendar,
  Terms,
} from './lazyComponents';

/**
 * Protected routes configuration
 * Routes that require authentication (wrapped with WithGuard in AppRouter)
 * 
 * Note: These routes are currently inlined in AppRouter.jsx
 * This file serves as documentation and can be used with useRoutes hook if needed
 */
export const protectedRoutesConfig = [
  { path: ROUTES.DASHBOARD, element: <Index /> },
  { path: ROUTES.MARKETING_PLANS, element: <MarketingPlans /> },
  { path: ROUTES.BUDGETS_ALLOCATION, element: <BudgetsAllocation /> },
  { path: ROUTES.ADMINISTRATORS, element: <Administrators /> },
  { path: ROUTES.COMPANIES, element: <Companies /> },
  { path: ROUTES.USERS, element: <UsersPage /> },
  { path: ROUTES.CHARTS, element: <Charts /> },
  { path: ROUTES.COUNTRIES, element: <Countries /> },
  { path: ROUTES.CALENDAR, element: <Calendar /> },
  { path: ROUTES.TERMS, element: <Terms /> },
];


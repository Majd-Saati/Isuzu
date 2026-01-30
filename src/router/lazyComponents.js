import { lazy } from 'react';

/**
 * Lazy-loaded components for code splitting
 * Components are loaded only when their routes are accessed
 */

// Layout
export const Layout = lazy(() => 
  import('../components/Layout').then(m => ({ default: m.Layout }))
);

// Public pages
export const Login = lazy(() => import('../pages/Login'));

// Protected pages
export const Index = lazy(() => import('../pages/Index'));
export const MarketingPlans = lazy(() => import('../pages/MarketingPlans'));
export const BudgetsAllocation = lazy(() => import('../pages/BudgetsAllocation'));
export const Administrators = lazy(() => import('../pages/Administrators'));
export const Companies = lazy(() => import('../pages/Users')); // Companies page (formerly Users)
export const UsersPage = lazy(() => import('../pages/UsersPage')); // New Users page
export const Charts = lazy(() => import('../pages/Charts'));
export const Countries = lazy(() => import('../pages/Countries'));
export const Calendar = lazy(() => import('../pages/Calendar'));
export const Terms = lazy(() => import('../pages/Terms'));
export const NotFound = lazy(() => import('../pages/NotFound'));


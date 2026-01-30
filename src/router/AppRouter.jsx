import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { WithGuard } from '@/components/WithGuard';
import { AdminGuard } from '@/components/AdminGuard';
import { PermissionGuard } from '@/components/PermissionGuard';
import { Layout, NotFound, Login } from './lazyComponents';
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
import { ROUTES } from './routes';

/**
 * Main application router
 * Organizes all routes with proper guards and layout
 */
export const AppRouter = () => (
  <Suspense fallback={null}>
    <Routes>
      {/* Public routes */}
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.ROOT} element={<Login />} />

      {/* Protected routes with layout */}
      <Route element={<WithGuard><Layout /></WithGuard>}>
        <Route path={ROUTES.DASHBOARD} element={<PermissionGuard><Index /></PermissionGuard>} />
        <Route path={ROUTES.MARKETING_PLANS} element={<PermissionGuard><MarketingPlans /></PermissionGuard>} />
        <Route path={ROUTES.BUDGETS_ALLOCATION} element={<PermissionGuard><BudgetsAllocation /></PermissionGuard>} />
        <Route path={ROUTES.ADMINISTRATORS} element={<AdminGuard><Administrators /></AdminGuard>} />
        {/* Admin-only routes */}
        <Route path={ROUTES.COMPANIES} element={<AdminGuard><Companies /></AdminGuard>} />
        <Route path={ROUTES.COUNTRIES} element={<AdminGuard><Countries /></AdminGuard>} />
        <Route path={ROUTES.USERS} element={<AdminGuard><UsersPage /></AdminGuard>} />
        <Route path={ROUTES.CHARTS} element={<PermissionGuard><Charts /></PermissionGuard>} />
        <Route path={ROUTES.CALENDAR} element={<PermissionGuard><Calendar /></PermissionGuard>} />
        <Route path={ROUTES.TERMS} element={<PermissionGuard><Terms /></PermissionGuard>} />
      </Route>

      {/* 404 Not Found */}
      <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
    </Routes>
  </Suspense>
);


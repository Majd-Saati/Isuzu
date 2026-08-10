import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Login from './Login';
import { authService } from '@/lib/api/services/authService';
import { ROUTES } from '@/router/routes';
import {
  hasMarketingPlansDeepLink,
  buildMarketingPlansDeepLinkPath,
} from '@/lib/marketingPlansDeepLink';

/**
 * Entry for `/`.
 * Deep links (`plan_id` / `activity_id` / `budget_id` / `meta_id`) go to Marketing Plans
 * when authenticated; otherwise Login keeps the query so post-login can continue.
 */
const RootEntry = () => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const deepLink = hasMarketingPlansDeepLink(location.search);

  if (isAuthenticated && deepLink) {
    return <Navigate to={buildMarketingPlansDeepLinkPath(location.search)} replace />;
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Login />;
};

export default RootEntry;

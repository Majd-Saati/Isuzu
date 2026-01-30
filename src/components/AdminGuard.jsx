import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES } from '@/router/routes';

/**
 * AdminGuard component - Protects routes that require admin privileges
 * Redirects non-admin users to dashboard if they try to access admin-only routes
 */
export const AdminGuard = ({ children }) => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  
  // Check if user is admin
  // is_admin can be '1', 1, or true
  const isAdmin = user?.is_admin === '1' || user?.is_admin === 1 || user?.is_admin === true;

  if (!isAdmin) {
    // Redirect non-admin users to dashboard
    return <Navigate to={ROUTES.DASHBOARD} state={{ from: location }} replace />;
  }

  return children;
};

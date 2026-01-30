import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { canAccessRoute } from '@/lib/permissions';
import { ROUTES } from '@/router/routes';

/**
 * Route guard component that checks permissions before allowing access
 * Redirects to dashboard if user doesn't have permission
 */
export const PermissionGuard = ({ children, requiredRoute }) => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  
  // Use provided route or current location path
  const routeToCheck = requiredRoute || location.pathname;
  
  // Check if user can access the route
  if (!canAccessRoute(user, routeToCheck)) {
    // Redirect to dashboard if no permission
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }
  
  return children;
};


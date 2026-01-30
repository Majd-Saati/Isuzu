import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '@/lib/api/services/authService';
import { ROUTES } from '@/router/routes';

export const WithGuard = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    // Redirect to login page, preserving the intended destination
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return children;
};


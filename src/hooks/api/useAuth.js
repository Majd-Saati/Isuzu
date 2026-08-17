import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/lib/api/services/authService';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, logout as logoutAction } from '@/store/slices/authSlice';
import { ROUTES } from '@/router/routes';
import {
  hasMarketingPlansDeepLink,
  buildMarketingPlansDeepLinkPath,
} from '@/lib/marketingPlansDeepLink';

export const useLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (response) => {
      // API returns: { code, message, status, body: { user: { ...user, token } } }
      const { user } = response.body;
      const { token, ...userData } = user;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
      queryClient.setQueryData(['currentUser'], userData);
      
      // Store user data in Redux store
      dispatch(setUser(userData));

      const from = location.state?.from;
      if (from?.pathname === ROUTES.MARKETING_PLANS) {
        navigate(`${from.pathname}${from.search || ''}`, { replace: true });
        return;
      }
      if (hasMarketingPlansDeepLink(location.search)) {
        navigate(buildMarketingPlansDeepLinkPath(location.search), { replace: true });
        return;
      }
      if (from?.pathname && from.pathname !== ROUTES.LOGIN && from.pathname !== ROUTES.ROOT) {
        navigate(`${from.pathname}${from.search || ''}`, { replace: true });
        return;
      }

      navigate(ROUTES.DASHBOARD, { replace: true });
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear();
      dispatch(logoutAction());
      navigate('/login');
    },
  });
};

export const useCurrentUser = () => {
  return authService.getCurrentUser();
};

export const useIsAuthenticated = () => {
  return authService.isAuthenticated();
};

// Non-hook utility functions (for use outside React components)
export const getCurrentUser = () => authService.getCurrentUser();
export const isAuthenticated = () => authService.isAuthenticated();
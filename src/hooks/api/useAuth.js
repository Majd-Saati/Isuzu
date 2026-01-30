import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/lib/api/services/authService';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, logout as logoutAction } from '@/store/slices/authSlice';

export const useLogin = () => {
  const navigate = useNavigate();
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
      
      navigate('/dashboard');
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
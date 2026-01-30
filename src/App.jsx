import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import { Provider, useSelector } from 'react-redux';
import { Toaster } from 'sonner';
import { store } from './store/store';
import { queryClient } from './lib/queryClient';
import { prefetchDealers } from '@/hooks/api/useCompanies';
import { isAuthenticated } from '@/hooks/api/useAuth';
import { AppRouter } from './router/AppRouter';
import { ThemeProvider } from './contexts/ThemeContext';

// Component to prefetch dealers when authenticated and user is admin
const DealersPrefetcher = () => {
  const qc = useQueryClient();
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.is_admin === '1' || user?.is_admin === 1;

  useEffect(() => {
    // Only prefetch if user is authenticated AND admin
    if (isAuthenticated() && isAdmin) {
      prefetchDealers(qc);
    }
  }, [qc, isAdmin]);

  return null;
};

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <DealersPrefetcher />
        <Toaster
          position="top-right"
          richColors
          closeButton
          expand={false}
          duration={4000}
          toastOptions={{
            style: {
              padding: '16px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12)',
            },
            classNames: {
              toast: 'group',
              success: 'bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 shadow-lg dark:shadow-emerald-900/20',
              error: 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 shadow-lg dark:shadow-red-900/20',
              warning: 'bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 shadow-lg dark:shadow-amber-900/20',
              info: 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 shadow-lg dark:shadow-blue-900/20',
              closeButton: 'bg-transparent hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
              actionButton: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600',
              cancelButton: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600',
            },
          }}
        />
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;

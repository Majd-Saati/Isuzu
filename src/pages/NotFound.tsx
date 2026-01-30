import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useCallback } from 'react';
import {
  BackgroundDecorations,
  IconSection,
  TitleSection,
  MessageSection,
  ActionButtons,
  QuickLinks,
} from '@/components/notfound';
import { ROUTES } from '@/router/routes';

/**
 * 404 Not Found page component
 */
const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  const handleGoHome = useCallback(() => {
    navigate(ROUTES.DASHBOARD);
  }, [navigate]);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 dark:from-gray-950 via-white dark:via-gray-900 to-gray-100 dark:to-gray-950 flex items-center justify-center p-4 overflow-hidden relative">
      <BackgroundDecorations />

      <div className="relative max-w-3xl w-full">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border-2 border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-10">
            <IconSection />
            <TitleSection />
            <MessageSection pathname={location.pathname} />
            <ActionButtons onHome={handleGoHome} onBack={handleGoBack} />
            <QuickLinks navigate={navigate} />
          </div>

          <div className="h-2 bg-gradient-to-r from-[#E60012] via-[#F38088] to-[#14B8A6]" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;

import { ROUTES } from './routes';
import { Login } from './lazyComponents';

/**
 * Public routes configuration
 * Routes accessible without authentication
 * 
 * Note: These routes are currently inlined in AppRouter.jsx
 * This file serves as documentation and can be used with useRoutes hook if needed
 */
export const publicRoutesConfig = [
  { path: ROUTES.LOGIN, element: <Login /> },
  { path: ROUTES.ROOT, element: <Login /> },
];


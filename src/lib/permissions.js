/**
 * Permissions utility for role-based access control
 * 
 * Admin users can access everything
 * Normal users have limited permissions based on allowed endpoints
 */

// Allowed endpoints/features for normal users
const NORMAL_USER_PERMISSIONS = [
  // Terms
  'terms_list',
  
  // Plans
  'plans_list',
  'plan_create',
  'plan_details',
  'plan_update',
  'delete_plan',
  
  // Activities
  'activities_list',
  'activity_create',
  'activity_update_status',
  'delete_activity',
  'activity_update',
  'activity_budget_add',
  'activity_budget_list',
  'delete_activity_budget_allocation',
  'activity_meta_add',
  'activity_meta_list',
  'delete_activity_meta',
  
  // Other
  'overview',
  'calendar_view',
];

// Map routes/pages to required permissions
const ROUTE_PERMISSIONS = {
  '/dashboard': 'overview',
  '/marketing-plans': 'plans_list',
  '/budgets-allocation': 'plans_list',
  '/terms': 'terms_list',
  '/calendar': 'calendar_view',
  '/charts': 'overview', // Charts might need overview
  '/countries': null, // Admin only
  '/companies': null, // Admin only
  '/users': null, // Admin only
  '/administrators': null, // Admin only
};

/**
 * Check if user has permission for a specific endpoint/feature
 * @param {Object} user - User object from Redux store
 * @param {string} permission - Permission/endpoint name to check
 * @returns {boolean} - True if user has permission
 */
export const hasPermission = (user, permission) => {
  if (!user) return false;
  
  // Admin users have all permissions
  const isAdmin = user?.is_admin === '1' || user?.is_admin === 1 || user?.is_admin === true;
  if (isAdmin) return true;
  
  // Check if permission is in normal user allowed list
  return NORMAL_USER_PERMISSIONS.includes(permission);
};

/**
 * Check if user can access a specific route/page
 * @param {Object} user - User object from Redux store
 * @param {string} route - Route path to check
 * @returns {boolean} - True if user can access the route
 */
export const canAccessRoute = (user, route) => {
  if (!user) return false;
  
  // Admin users can access everything
  const isAdmin = user?.is_admin === '1' || user?.is_admin === 1 || user?.is_admin === true;
  if (isAdmin) return true;
  
  // Check route permissions
  const requiredPermission = ROUTE_PERMISSIONS[route];
  
  // If route requires no permission (null), it's admin-only
  if (requiredPermission === null) return false;
  
  // If route has a permission requirement, check it
  if (requiredPermission) {
    return hasPermission(user, requiredPermission);
  }
  
  // Default to false for unknown routes
  return false;
};

/**
 * Get user's role (admin or user)
 * @param {Object} user - User object from Redux store
 * @returns {string} - 'admin' or 'user'
 */
export const getUserRole = (user) => {
  if (!user) return 'user';
  
  const isAdmin = user?.is_admin === '1' || user?.is_admin === 1 || user?.is_admin === true;
  return isAdmin ? 'admin' : 'user';
};

/**
 * Check if user is admin
 * @param {Object} user - User object from Redux store
 * @returns {boolean} - True if user is admin
 */
export const isAdminUser = (user) => {
  if (!user) return false;
  return user?.is_admin === '1' || user?.is_admin === 1 || user?.is_admin === true;
};


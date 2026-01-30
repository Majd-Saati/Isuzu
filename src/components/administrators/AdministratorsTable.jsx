import React from 'react';
import { Edit2, Bell, Trash2 } from 'lucide-react';
import { CustomPagination } from '@/components/ui/CustomPagination';

/**
 * Format administrator data for display
 */
const formatAdministrator = (admin) => ({
  id: admin.id,
  name: admin.name || 'N/A',
  avatar: admin.avatar || admin.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name || 'Admin')}&background=E60012&color=fff`,
  role: admin.role || admin.role_name || 'Administrator',
  assigned: admin.assigned || admin.campaigns_count ? `${admin.campaigns_count} Campaigns` : '0 Campaigns',
  status: admin.status === '1' || admin.status === 1 || admin.status === 'active' ? 'active' : 'inactive',
  hasNotification: admin.hasNotification || admin.has_notification || false,
});

export const AdministratorsTable = ({ 
  administrators = [], 
  pagination,
  onEdit, 
  onDelete,
  onPageChange,
  onItemsPerPageChange,
  currentUserId
}) => {
  const formattedAdmins = administrators.map(formatAdministrator);
  
  const currentPage = pagination?.page || 1;
  const totalPages = pagination?.total_pages || 1;
  const totalItems = pagination?.total || administrators.length;
  const itemsPerPage = pagination?.per_page || 20;

  return (
    <div className="bg-white dark:bg-gray-900 overflow-hidden rounded-3xl shadow-[0px_4px_16px_rgba(0,0,0,0.06)] border-2 border-gray-100 dark:border-gray-800">
      {/* Table Header - Desktop Only */}
      <div className="hidden lg:grid grid-cols-5 bg-gradient-to-b from-gray-50 dark:from-gray-800 to-white dark:to-gray-900 border-b-2 border-gray-200 dark:border-gray-700">
        <div className="px-8 py-5 text-sm font-semibold text-[#6B7280] dark:text-gray-300 uppercase tracking-wide first:border-l-0 border-l border-gray-200 dark:border-gray-700">Administrators</div>
        <div className="px-8 py-5 text-sm font-semibold text-[#6B7280] dark:text-gray-300 uppercase tracking-wide first:border-l-0 border-l border-gray-200 dark:border-gray-700">Role</div>
        <div className="px-8 py-5 text-sm font-semibold text-[#6B7280] dark:text-gray-300 uppercase tracking-wide first:border-l-0 border-l border-gray-200 dark:border-gray-700">Assigned</div>
        <div className="px-8 py-5 text-sm font-semibold text-[#6B7280] dark:text-gray-300 uppercase tracking-wide first:border-l-0 border-l border-gray-200 dark:border-gray-700">Status</div>
        <div className="px-8 py-5 text-sm font-semibold text-[#6B7280] dark:text-gray-300 uppercase tracking-wide first:border-l-0 border-l border-gray-200 dark:border-gray-700">Permissions</div>
      </div>

      {/* Table Body */}
      <div>
        {formattedAdmins.map((admin, index) => (
          <div key={admin.id}>
            {/* Desktop View */}
            <div 
              className={`hidden lg:grid grid-cols-5 transition-all duration-200 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 ${index < formattedAdmins.length - 1 ? 'border-t border-gray-200 dark:border-gray-700' : ''}`}
            >
              {/* Administrator Column */}
              <div className="px-8 py-8 flex items-center gap-4 first:border-l-0 border-l border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <img
                    src={admin.avatar}
                    className="w-11 h-11 rounded-full object-cover shadow-md ring-2 ring-gray-100 dark:ring-gray-700"
                    alt={admin.name}
                  />
                  {admin.hasNotification && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
                  )}
                </div>
                <span className="text-base text-[#374151] dark:text-gray-200 font-medium">{admin.name}</span>
              </div>

              {/* Role Column */}
              <div className="px-8 py-8 flex items-center first:border-l-0 border-l border-gray-200 dark:border-gray-700">
                <span className="text-sm text-[#6B7280] dark:text-gray-300 font-medium">{admin.role}</span>
              </div>

              {/* Assigned Column */}
              <div className="px-8 py-8 flex items-center first:border-l-0 border-l border-gray-200 dark:border-gray-700">
                <span className="text-sm text-[#6B7280] dark:text-gray-300 font-medium">{admin.assigned}</span>
              </div>

              {/* Status Column */}
              <div className="px-8 py-8 flex items-center first:border-l-0 border-l border-gray-200">
                <span 
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide shadow-sm ${
                    admin.status === 'active' 
                      ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200' 
                      : 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200'
                  }`}
                >
                  {admin.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Permissions Column */}
              <div className="px-8 py-8 flex items-center justify-start gap-3 first:border-l-0 border-l border-gray-200 dark:border-gray-700">
                <button 
                  onClick={() => onEdit?.(admin)}
                  className="p-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 hover:shadow-sm group"
                  title="Edit administrator"
                >
                  <Edit2 className="w-5 h-5 text-[#6B7280] dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                </button>
                
                <button className={`p-2.5 rounded-lg transition-all duration-200 hover:shadow-sm group relative ${
                  admin.hasNotification 
                    ? 'bg-gradient-to-r from-amber-50 dark:from-amber-900/20 to-yellow-50 dark:to-yellow-900/20 hover:from-amber-100 dark:hover:from-amber-900/30 hover:to-yellow-100 dark:hover:to-yellow-900/30 shadow-sm' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}>
                  <Bell className={`w-5 h-5 transition-colors ${
                    admin.hasNotification ? 'text-amber-600 dark:text-amber-400' : 'text-[#6B7280] dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                  }`} />
                  {admin.hasNotification && (
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse" />
                  )}
                </button>
                
                <button 
                  onClick={() => onDelete?.(admin)}
                  disabled={currentUserId && String(currentUserId) === String(admin.id)}
                  className={`p-2.5 rounded-lg transition-all duration-200 hover:shadow-sm group ${
                    currentUserId && String(currentUserId) === String(admin.id)
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-red-50 dark:hover:bg-red-900/20'
                  }`}
                  title={currentUserId && String(currentUserId) === String(admin.id) ? "You cannot delete your own account" : "Delete administrator"}
                >
                  <Trash2 className={`w-5 h-5 transition-colors ${
                    currentUserId && String(currentUserId) === String(admin.id)
                      ? 'text-gray-400 dark:text-gray-600'
                      : 'text-[#6B7280] dark:text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400'
                  }`} />
                </button>
              </div>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className={`lg:hidden p-6 transition-all duration-200 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 ${index < formattedAdmins.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={admin.avatar}
                      className="w-12 h-12 rounded-full object-cover shadow-md ring-2 ring-gray-100 dark:ring-gray-700"
                      alt={admin.name}
                    />
                    {admin.hasNotification && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base text-[#374151] dark:text-gray-200 font-medium">{admin.name}</h3>
                    <p className="text-sm text-[#6B7280] dark:text-gray-300 mt-0.5">{admin.role}</p>
                  </div>
                </div>
                <span 
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-sm ${
                    admin.status === 'active' 
                      ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200' 
                      : 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200'
                  }`}
                >
                  {admin.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-[#9CA3AF] dark:text-gray-500">Assigned</span>
                  <span className="text-sm text-[#374151] dark:text-gray-200 font-medium">{admin.assigned}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <button 
                  onClick={() => onEdit?.(admin)}
                  className="flex-1 p-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 hover:shadow-sm group flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4 text-[#6B7280] dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  <span className="text-sm text-[#6B7280] dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">Edit</span>
                </button>
                
                <button className={`flex-1 p-2.5 rounded-lg transition-all duration-200 hover:shadow-sm group relative flex items-center justify-center gap-2 ${
                  admin.hasNotification 
                    ? 'bg-gradient-to-r from-amber-50 dark:from-amber-900/20 to-yellow-50 dark:to-yellow-900/20 hover:from-amber-100 dark:hover:from-amber-900/30 hover:to-yellow-100 dark:hover:to-yellow-900/30 shadow-sm' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}>
                  <Bell className={`w-4 h-4 transition-colors ${
                    admin.hasNotification ? 'text-amber-600 dark:text-amber-400' : 'text-[#6B7280] dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                  }`} />
                  <span className={`text-sm transition-colors ${
                    admin.hasNotification ? 'text-amber-600 dark:text-amber-400' : 'text-[#6B7280] dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                  }`}>Notify</span>
                  {admin.hasNotification && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900 animate-pulse" />
                  )}
                </button>
                
                <button 
                  onClick={() => onDelete?.(admin)}
                  disabled={currentUserId && String(currentUserId) === String(admin.id)}
                  className={`flex-1 p-2.5 rounded-lg transition-all duration-200 hover:shadow-sm group flex items-center justify-center gap-2 ${
                    currentUserId && String(currentUserId) === String(admin.id)
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-red-50 dark:hover:bg-red-900/20'
                  }`}
                >
                  <Trash2 className={`w-4 h-4 transition-colors ${
                    currentUserId && String(currentUserId) === String(admin.id)
                      ? 'text-gray-400 dark:text-gray-600'
                      : 'text-[#6B7280] dark:text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400'
                  }`} />
                  <span className={`text-sm transition-colors ${
                    currentUserId && String(currentUserId) === String(admin.id)
                      ? 'text-gray-400 dark:text-gray-600'
                      : 'text-[#6B7280] dark:text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400'
                  }`}>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && (
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          onItemsPerPageChange={onItemsPerPageChange}
        />
      )}
    </div>
  );
};

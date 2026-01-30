import React from 'react';
import { Edit2, Trash2, User, Mail, Phone, Building2 } from 'lucide-react';
import { CustomPagination } from '@/components/ui/CustomPagination';

export const UsersTable = ({ 
  users, 
  pagination, 
  onEdit, 
  onDelete,
  onPageChange,
  onItemsPerPageChange,
  currentUserId
}) => {
  const getStatusBadge = (status) => {
    const isActive = status === '1' || status === 1;
    return isActive ? (
      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium">
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium">
        Inactive
      </span>
    );
  };

  const getRoleBadge = (isAdmin) => {
    const admin = isAdmin === '1' || isAdmin === 1;
    return admin ? (
      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-medium">
        Admin
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium">
        User
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/70 dark:bg-gray-800/70 border-b-2 border-gray-200 dark:border-gray-700">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 border-r-2 border-gray-200 dark:border-gray-700">
                User
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 border-r-2 border-gray-200 dark:border-gray-700">
                Contact
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 border-r-2 border-gray-200 dark:border-gray-700">
                Company
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 border-r-2 border-gray-200 dark:border-gray-700">
                Role
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 border-r-2 border-gray-200 dark:border-gray-700">
                Status
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 border-r-2 border-gray-200 dark:border-gray-700">
                Created
              </th>
              <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr 
                key={user.id}
                className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-all duration-200"
              >
                <td className="px-6 py-4 border-r-2 border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E60012] to-[#C00010] flex items-center justify-center text-white font-semibold text-sm">
                      {user.name?.charAt(0)?.toUpperCase() || <User className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">ID: {user.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 border-r-2 border-gray-200 dark:border-gray-700">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Mail className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                      <span className="truncate max-w-[180px]">{user.email || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Phone className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                      <span>{user.mobile || '—'}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 border-r-2 border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {user.company_name || user.company_id || '—'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 border-r-2 border-gray-200 dark:border-gray-700">
                  {getRoleBadge(user.is_admin)}
                </td>
                <td className="px-6 py-4 border-r-2 border-gray-200 dark:border-gray-700">
                  {getStatusBadge(user.status)}
                </td>
                <td className="px-6 py-4 border-r-2 border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(user.creation_date)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit?.(user)}
                      className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition-all hover:scale-110 active:scale-95"
                      title="Edit user"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete?.(user)}
                      disabled={currentUserId && String(currentUserId) === String(user.id)}
                      className={`p-2 rounded-lg transition-all hover:scale-110 active:scale-95 ${
                        currentUserId && String(currentUserId) === String(user.id)
                          ? 'opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-600'
                          : 'hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400'
                      }`}
                      title={currentUserId && String(currentUserId) === String(user.id) ? "You cannot delete your own account" : "Delete user"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <CustomPagination
        currentPage={pagination.page}
        totalPages={pagination.total_pages}
        totalItems={pagination.total}
        itemsPerPage={pagination.per_page}
        onPageChange={onPageChange}
        onItemsPerPageChange={onItemsPerPageChange}
      />
    </div>
  );
};

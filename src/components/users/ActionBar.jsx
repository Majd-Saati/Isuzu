import React from 'react';
import { Search, UserPlus } from 'lucide-react';
import { CompanyFilterDropdown } from './CompanyFilterDropdown';

/**
 * Action bar component for UsersPage with filters
 */
export const UsersActionBar = ({
  onAddUser,
  searchTerm,
  onSearchChange,
  companies,
  selectedCompanyId,
  onCompanyFilterChange,
  selectedStatus,
  onStatusChange,
  selectedRole,
  onRoleChange,
  hasActiveFilters,
  onClearFilters,
}) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-sm p-5 mb-8">
    <div className="flex flex-wrap items-center gap-4">
      <button
        onClick={onAddUser}
        className="flex items-center gap-2 px-6 py-3 bg-[#E60012] text-white rounded-xl text-sm font-semibold hover:bg-[#C00010] transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
      >
        <UserPlus className="w-4 h-4" />
        Add User
      </button>

      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px] max-w-[320px]">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={onSearchChange}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E60012] focus:border-transparent transition-all"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
      </div>

      <div className="flex items-center gap-3 ml-auto flex-wrap">
        {/* Company Filter */}
        <CompanyFilterDropdown
          companies={companies}
          selectedCompanyId={selectedCompanyId}
          onSelect={onCompanyFilterChange}
        />

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={onStatusChange}
          className="px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all cursor-pointer"
        >
          <option value="">All Status</option>
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>

        {/* Role Filter */}
        <select
          value={selectedRole}
          onChange={onRoleChange}
          className="px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all cursor-pointer"
        >
          <option value="">All Roles</option>
          <option value="1">Admin</option>
          <option value="0">User</option>
        </select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  </div>
);


import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { UsersTable } from '@/components/users/UsersTable';
import { UsersTableSkeleton } from '@/components/users/UsersTableSkeleton';
import { UsersTableEmpty } from '@/components/users/UsersTableEmpty';
import { UsersPageHeader, UsersActionBar } from '@/components/users';
import { AddEditUserModal } from '@/components/users/AddEditUserModal';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { useUsers, useDeleteUser } from '@/hooks/api/useUsers';
import { useDealers } from '@/hooks/api/useCompanies';

const UsersPage = () => {
  // Get current user from Redux
  const currentUser = useSelector((state) => state.auth.user);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  // Fetch companies for filter dropdown
  const { data: companiesData = [] } = useDealers();
  const companies = companiesData || [];

  // Fetch users from API with filters
  const { data, isLoading, isError } = useUsers({
    page,
    perPage,
    search: searchTerm || undefined,
    companyId: selectedCompanyId || undefined,
    status: selectedStatus !== '' ? selectedStatus : undefined,
    isAdmin: selectedRole !== '' ? selectedRole : undefined,
  });
  const deleteMutation = useDeleteUser();

  const users = data?.users || [];
  const pagination = data?.pagination;

  // Modal handlers
  const openCreateModal = useCallback(() => {
    setEditingUser(null);
    setShowModal(true);
  }, []);

  const openEditModal = useCallback((user) => {
    setEditingUser(user);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setEditingUser(null);
  }, []);

  const openDeleteModal = useCallback((user) => {
    // Check if user is trying to delete themselves
    if (currentUser && user && String(currentUser.id) === String(user.id)) {
      setDeleteError('You cannot delete your own account.');
      return;
    }
    setDeleteError('');
    setDeletingUser(user);
    setShowDeleteModal(true);
  }, [currentUser]);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setDeletingUser(null);
    setDeleteError('');
  }, []);

  // Delete handler
  const handleConfirmDelete = useCallback(() => {
    if (deletingUser) {
      // Double check before deletion
      if (currentUser && String(currentUser.id) === String(deletingUser.id)) {
        setDeleteError('You cannot delete your own account.');
        return;
      }
      setDeleteError('');
      deleteMutation.mutate(deletingUser.id, {
        onSuccess: () => {
          closeDeleteModal();
        },
      });
    }
  }, [deletingUser, currentUser, deleteMutation, closeDeleteModal]);

  // Pagination handlers
  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const handleItemsPerPageChange = useCallback((newPerPage) => {
    setPerPage(newPerPage);
    setPage(1);
  }, []);

  // Filter handlers
  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  }, []);

  const handleCompanyFilter = useCallback((companyId) => {
    setSelectedCompanyId(companyId);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((e) => {
    setSelectedStatus(e.target.value);
    setPage(1);
  }, []);

  const handleRoleChange = useCallback((e) => {
    setSelectedRole(e.target.value);
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCompanyId('');
    setSelectedStatus('');
    setSelectedRole('');
    setPage(1);
  }, []);

  const hasActiveFilters = searchTerm || selectedCompanyId || selectedStatus || selectedRole;

  // Render content based on state
  const renderContent = () => {
    if (isLoading) return <UsersTableSkeleton />;
    if (isError) {
      return (
        <div className="bg-white rounded-2xl border-2 border-red-200 shadow-sm p-8 text-center">
          <p className="text-red-600 font-medium">Failed to load users. Please try again.</p>
        </div>
      );
    }
    if (!users || users.length === 0) {
      return <UsersTableEmpty onAddClick={openCreateModal} />;
    }

    return (
      <UsersTable
        users={users}
        pagination={pagination}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        currentUserId={currentUser?.id}
      />
    );
  };

  return (
    <>
      <UsersPageHeader />
      <UsersActionBar
        onAddUser={openCreateModal}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        companies={companies}
        selectedCompanyId={selectedCompanyId}
        onCompanyFilterChange={handleCompanyFilter}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        selectedRole={selectedRole}
        onRoleChange={handleRoleChange}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />
      {renderContent()}

      {/* Error Message */}
      {deleteError && (
        <div className="fixed top-4 right-4 z-[10002] bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 shadow-lg animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 text-red-600 dark:text-red-400">⚠️</div>
            <p className="text-sm font-medium text-red-800 dark:text-red-300">{deleteError}</p>
            <button
              onClick={() => setDeleteError('')}
              className="ml-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit User Modal */}
      <AddEditUserModal isOpen={showModal} onClose={closeModal} editData={editingUser} />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? All their data and access permissions will be permanently removed."
        itemName={deletingUser?.name}
        confirmText="Delete User"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
};

export default UsersPage;

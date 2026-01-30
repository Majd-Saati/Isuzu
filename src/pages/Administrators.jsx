import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { AdministratorsTable } from '@/components/administrators/AdministratorsTable';
import { AdministratorsTableSkeleton } from '@/components/administrators/AdministratorsTableSkeleton';
import { AdministratorsTableEmpty } from '@/components/administrators/AdministratorsTableEmpty';
import { AddEditUserModal } from '@/components/users/AddEditUserModal';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/hooks/api/useUsers';
import { Search, Plus, X } from 'lucide-react';

const Administrators = () => {
  // Get current user from Redux
  const currentUser = useSelector((state) => state.auth.user);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAdmin, setDeletingAdmin] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  // Search
  const [searchTerm, setSearchTerm] = useState('');

  // API hooks - filter for administrators only
  const { data, isLoading, isError } = useUsers({
    page,
    perPage,
    isAdmin: '1', // Filter for administrators only
    search: searchTerm || undefined,
  });

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const administrators = data?.users || [];
  const pagination = data?.pagination;

  // Modal handlers
  const openCreateModal = useCallback(() => {
    setEditingAdmin(null);
    setShowModal(true);
  }, []);

  const openEditModal = useCallback((admin) => {
    setEditingAdmin(admin);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setEditingAdmin(null);
  }, []);

  const openDeleteModal = useCallback((admin) => {
    // Check if user is trying to delete themselves
    if (currentUser && admin && String(currentUser.id) === String(admin.id)) {
      setDeleteError('You cannot delete your own account.');
      return;
    }
    setDeleteError('');
    setDeletingAdmin(admin);
    setShowDeleteModal(true);
  }, [currentUser]);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setDeletingAdmin(null);
    setDeleteError('');
  }, []);

  // Submit handler
  const handleSubmitAdmin = useCallback((values) => {
    const mutation = editingAdmin ? updateUserMutation : createUserMutation;
    mutation.mutate(
      { ...values, isAdmin: true },
      {
        onSuccess: () => {
          closeModal();
        },
      }
    );
  }, [editingAdmin, updateUserMutation, createUserMutation, closeModal]);

  // Delete handler
  const handleConfirmDelete = useCallback(() => {
    if (deletingAdmin) {
      // Double check before deletion
      if (currentUser && String(currentUser.id) === String(deletingAdmin.id)) {
        setDeleteError('You cannot delete your own account.');
        return;
      }
      setDeleteError('');
      deleteUserMutation.mutate(deletingAdmin.id, {
        onSuccess: () => {
          closeDeleteModal();
        },
      });
    }
  }, [deletingAdmin, currentUser, deleteUserMutation, closeDeleteModal]);

  // Pagination handlers
  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const handleItemsPerPageChange = useCallback((newPerPage) => {
    setPerPage(newPerPage);
    setPage(1);
  }, []);

  // Search handler
  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
    setPage(1);
  }, []);

  // Render content based on state
  const renderContent = () => {
    if (isLoading) return <AdministratorsTableSkeleton />;
    if (isError) {
      return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-red-200 dark:border-red-800 shadow-sm p-8 text-center">
          <p className="text-red-600 dark:text-red-400 font-medium">Failed to load administrators. Please try again.</p>
        </div>
      );
    }
    if (!administrators || administrators.length === 0) {
      return <AdministratorsTableEmpty />;
    }

    return (
      <AdministratorsTable
        administrators={administrators}
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
      {/* Page Header */}
      <div className="pt-6 pb-8 mb-8 border-b-2 border-gray-100 dark:border-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 pb-4 border-b-4 border-[#E60012] inline-block">
          Administrators
        </h1>
      </div>

      {/* Action Bar */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-sm p-5 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-6 py-3 bg-[#E60012] text-white rounded-xl text-sm font-semibold hover:bg-[#C00010] transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Administrator
          </button>

          <div className="relative flex-1 min-w-[240px] max-w-[320px]">
            <input
              type="text"
              placeholder="Search for members"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-11 pr-10 py-3 rounded-xl bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E60012] focus:border-transparent transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:scale-105 active:scale-95">
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
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

      {/* Add/Edit Administrator Modal */}
      <AddEditUserModal
        isOpen={showModal}
        onClose={closeModal}
        onSubmit={handleSubmitAdmin}
        editData={editingAdmin}
        role="admin"
        isSubmitting={createUserMutation.isPending || updateUserMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Administrator"
        message="Are you sure you want to delete this administrator? All their permissions and access will be permanently removed from the system."
        itemName={deletingAdmin?.name}
        confirmText="Delete Administrator"
        isLoading={deleteUserMutation.isPending}
      />
    </>
  );
};

export default Administrators;

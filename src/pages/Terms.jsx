import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { TermsTable } from '@/components/terms/TermsTable';
import { TermsTableSkeleton } from '@/components/terms/TermsTableSkeleton';
import { TermsTableEmpty } from '@/components/terms/TermsTableEmpty';
import { TermsPageHeader, TermsActionBar } from '@/components/terms';
import { AddEditTermModal } from '@/components/terms/AddEditTermModal';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { useTerms, useDeleteTerm } from '@/hooks/api/useTerms';
import { hasPermission } from '@/lib/permissions';

const Terms = () => {
  // Get current user from Redux
  const user = useSelector((state) => state.auth.user);
  
  // Check permissions
  const canCreate = hasPermission(user, 'term_create');
  const canUpdate = hasPermission(user, 'term_update');
  const canDelete = hasPermission(user, 'delete_term');
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingTerm, setEditingTerm] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingTerm, setDeletingTerm] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  
  // Search
  const [search, setSearch] = useState('');

  // API hooks
  const { data, isLoading, isError } = useTerms({ page, perPage, search });
  const deleteMutation = useDeleteTerm();

  const terms = data?.terms || [];
  const pagination = data?.pagination;

  // Modal handlers
  const openCreateModal = useCallback(() => {
    setEditingTerm(null);
    setShowModal(true);
  }, []);

  const openEditModal = useCallback((term) => {
    setEditingTerm(term);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setEditingTerm(null);
  }, []);

  const openDeleteModal = useCallback((term) => {
    setDeletingTerm(term);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setDeletingTerm(null);
  }, []);

  // Delete handler
  const handleConfirmDelete = useCallback(() => {
    if (deletingTerm) {
      deleteMutation.mutate(deletingTerm.id, {
        onSuccess: () => {
          closeDeleteModal();
        },
      });
    }
  }, [deletingTerm, deleteMutation, closeDeleteModal]);

  // Pagination handlers
  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const handleItemsPerPageChange = useCallback((newPerPage) => {
    setPerPage(newPerPage);
    setPage(1);
  }, []);

  // Search handler
  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    setPage(1); // Reset to first page when search changes
  }, []);

  // Render content based on state
  const renderContent = () => {
    if (isLoading) return <TermsTableSkeleton />;
    if (isError) {
      return (
        <div className="bg-white rounded-2xl border-2 border-red-200 shadow-sm p-8 text-center">
          <p className="text-red-600 font-medium">Failed to load terms. Please try again.</p>
        </div>
      );
    }
    if (!terms || terms.length === 0) {
      return <TermsTableEmpty onAddClick={canCreate ? openCreateModal : null} />;
    }

    return (
      <TermsTable
        terms={terms}
        pagination={pagination}
        onEdit={canUpdate ? openEditModal : null}
        onDelete={canDelete ? openDeleteModal : null}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    );
  };

  return (
    <>
      <TermsPageHeader />
      <TermsActionBar onAddTerm={canCreate ? openCreateModal : null} search={search} onSearchChange={handleSearchChange} />
      {renderContent()}

      {/* Add/Edit Term Modal */}
      <AddEditTermModal isOpen={showModal} onClose={closeModal} editData={editingTerm} />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Term"
        message="Are you sure you want to delete this term? All associated marketing plans and budget data will be permanently removed."
        itemName={deletingTerm?.name}
        confirmText="Delete Term"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
};

export default Terms;

import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { TermsTable } from '@/components/terms/TermsTable';
import { TermsTableSkeleton } from '@/components/terms/TermsTableSkeleton';
import { TermsTableEmpty } from '@/components/terms/TermsTableEmpty';
import {
  TermsPageHeader,
  TermsActionBar,
  TermExchangeTable,
  TermExchangeTableSkeleton,
  TermExchangeTableEmpty,
} from '@/components/terms';
import { AddEditTermModal } from '@/components/terms/AddEditTermModal';
import { AddTermExchangeModal } from '@/components/terms/AddTermExchangeModal';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { useTerms, useDeleteTerm, useTermExchange } from '@/hooks/api/useTerms';
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
  const [showAddExchangeModal, setShowAddExchangeModal] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [exchangePage, setExchangePage] = useState(1);
  const [exchangePerPage, setExchangePerPage] = useState(20);

  // Search
  const [search, setSearch] = useState('');

  // API hooks
  const { data, isLoading, isError } = useTerms({ page, perPage, search });
  const {
    data: exchangeData,
    isLoading: exchangeLoading,
    isError: exchangeError,
  } = useTermExchange({ page: exchangePage, perPage: exchangePerPage });
  const deleteMutation = useDeleteTerm();

  const terms = data?.terms || [];
  const pagination = data?.pagination;
  const exchanges = exchangeData?.exchanges || [];
  const exchangePagination = exchangeData?.pagination;
  const termInfo = exchangeData?.term;

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

  const handleExchangePageChange = useCallback((newPage) => {
    setExchangePage(newPage);
  }, []);

  const handleExchangeItemsPerPageChange = useCallback((newPerPage) => {
    setExchangePerPage(newPerPage);
    setExchangePage(1);
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

  const renderExchangeContent = () => {
    if (exchangeLoading) return <TermExchangeTableSkeleton />;
    if (exchangeError) {
      return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-red-200 dark:border-red-900/50 shadow-sm p-8 text-center">
          <p className="text-red-600 dark:text-red-400 font-medium">Failed to load term exchange rates. Please try again.</p>
        </div>
      );
    }
    if (!exchanges?.length) {
      return <TermExchangeTableEmpty />;
    }
    return (
      <TermExchangeTable
        term={termInfo}
        exchanges={exchanges}
        pagination={exchangePagination}
        onPageChange={handleExchangePageChange}
        onItemsPerPageChange={handleExchangeItemsPerPageChange}
      />
    );
  };

  return (
    <>
      <TermsPageHeader />
      <TermsActionBar onAddTerm={canCreate ? openCreateModal : null} search={search} onSearchChange={handleSearchChange} />
      {renderContent()}

      {/* Term exchange rates section */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Term exchange rates</h2>
          <button
            type="button"
            onClick={() => setShowAddExchangeModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#E60012] hover:bg-[#C00010] transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
          >
            Add exchange rate
          </button>
        </div>
        {renderExchangeContent()}
      </section>

      {/* Add term exchange rate modal */}
      <AddTermExchangeModal
        isOpen={showAddExchangeModal}
        onClose={() => setShowAddExchangeModal(false)}
      />

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

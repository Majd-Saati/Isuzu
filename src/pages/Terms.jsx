import React, { useState, useCallback, useLayoutEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Plus } from 'lucide-react';
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
import { EditTermExchangeModal } from '@/components/terms/EditTermExchangeModal';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { useTerms, useDeleteTerm, useTermExchange } from '@/hooks/api/useTerms';
import { hasPermission } from '@/lib/permissions';

/** Pick the term with the latest start date (fallback: end date, then first item). */
const getLatestTermId = (terms) => {
  if (!Array.isArray(terms) || terms.length === 0) return '';
  const toTime = (d) => {
    if (!d) return NaN;
    const t = new Date(d).getTime();
    return Number.isFinite(t) ? t : NaN;
  };
  let bestId = String(terms[0].id ?? '');
  let bestStart = -Infinity;
  let bestEnd = -Infinity;
  for (const t of terms) {
    const s = toTime(t.start_date);
    const e = toTime(t.end_date);
    const startScore = Number.isFinite(s) ? s : Number.isFinite(e) ? e : -Infinity;
    const endScore = Number.isFinite(e) ? e : startScore;
    if (startScore > bestStart || (startScore === bestStart && endScore > bestEnd)) {
      bestStart = startScore;
      bestEnd = endScore;
      bestId = String(t.id ?? '');
    }
  }
  return bestId;
};

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
  const [showEditExchangeModal, setShowEditExchangeModal] = useState(false);
  const [editingExchange, setEditingExchange] = useState(null);
  // Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [exchangePage, setExchangePage] = useState(1);
  const [exchangePerPage, setExchangePerPage] = useState(20);
  const [exchangeTermId, setExchangeTermId] = useState('');

  // Search
  const [search, setSearch] = useState('');

  // API hooks
  const { data, isLoading, isError } = useTerms({ page, perPage, search });
  const { data: termsListData } = useTerms({ page: 1, perPage: 100 }); // for exchange filter dropdown
  const termsList = termsListData?.terms || [];
  const defaultExchangeTermId = useMemo(() => getLatestTermId(termsList), [termsList]);

  useLayoutEffect(() => {
    if (!termsList.length) {
      setExchangeTermId('');
      return;
    }
    setExchangeTermId((prev) => {
      const stillValid = prev && termsList.some((t) => String(t.id) === String(prev));
      if (stillValid) return prev;
      return defaultExchangeTermId || String(termsList[0].id ?? '');
    });
  }, [termsList, defaultExchangeTermId]);

  const exchangeQueryEnabled = termsList.length > 0 && exchangeTermId !== '';

  const {
    data: exchangeData,
    isLoading: exchangeLoading,
    isError: exchangeError,
  } = useTermExchange(
    {
      page: exchangePage,
      perPage: exchangePerPage,
      termId: exchangeTermId,
    },
    { enabled: exchangeQueryEnabled }
  );
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

  const handleExchangeTermFilterChange = useCallback((e) => {
    const value = e.target.value;
    setExchangeTermId(value);
    setExchangePage(1);
  }, []);

  const openEditExchangeModal = useCallback((exchange) => {
    setEditingExchange(exchange);
    setShowEditExchangeModal(true);
  }, []);

  const closeEditExchangeModal = useCallback(() => {
    setShowEditExchangeModal(false);
    setEditingExchange(null);
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
    if (!exchangeQueryEnabled) {
      if (!termsList.length) {
        return (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 shadow-sm p-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Add a term first to manage exchange rates.</p>
          </div>
        );
      }
      return <TermExchangeTableSkeleton />;
    }
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
        onEdit={openEditExchangeModal}
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
        {/* Title alone - same pattern as Terms header */}
        <div className="pt-6 pb-8 mb-8 border-b-2 border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 pb-3 border-b-4 border-[#E60012] inline-block">
            Term exchange rates
          </h2>
        </div>
        {/* Action bar: filter and add button */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-sm p-5 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="exchange-term-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                Term:
              </label>
              <select
                id="exchange-term-filter"
                value={exchangeTermId}
                onChange={handleExchangeTermFilterChange}
                disabled={!termsList.length}
                className="px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E60012] focus:border-transparent transition-all min-w-[200px] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {termsList.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => setShowAddExchangeModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#E60012] text-white rounded-xl text-sm font-semibold hover:bg-[#C00010] transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Add exchange rate
            </button>
          </div>
        </div>
        {renderExchangeContent()}
      </section>

      {/* Add term exchange rate modal */}
      <AddTermExchangeModal
        isOpen={showAddExchangeModal}
        onClose={() => setShowAddExchangeModal(false)}
        defaultTermId={exchangeTermId}
      />

      {/* Edit term exchange rate modal */}
      <EditTermExchangeModal
        isOpen={showEditExchangeModal}
        onClose={closeEditExchangeModal}
        editData={editingExchange}
      />

      {/* Add/Edit Term Modal */}
      <AddEditTermModal isOpen={showModal} onClose={closeModal} editData={editingTerm} />

      {/* Delete Term Confirmation Modal */}
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

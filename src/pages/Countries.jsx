import React, { useState, useCallback } from 'react';
import { CountriesTable } from '@/components/countries/CountriesTable';
import { CountriesTableSkeleton } from '@/components/countries/CountriesTableSkeleton';
import { CountriesTableEmpty } from '@/components/countries/CountriesTableEmpty';
import { AddEditCountryModal } from '@/components/countries/AddEditCountryModal';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { useCountries, useDeleteCountry } from '@/hooks/api/useCountries';
import { Search, Plus, Filter, ArrowUpDown, Download, X } from 'lucide-react';

const Countries = () => {
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCountry, setDeletingCountry] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  
  // Search
  const [search, setSearch] = useState('');

  // API hooks
  const { data, isLoading, isError } = useCountries({ page, perPage, search });
  const deleteMutation = useDeleteCountry();

  const countries = data?.countries || [];
  const pagination = data?.pagination;

  // Modal handlers
  const openCreateModal = useCallback(() => {
    setEditingCountry(null);
    setShowModal(true);
  }, []);

  const openEditModal = useCallback((country) => {
    setEditingCountry(country);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setEditingCountry(null);
  }, []);

  const openDeleteModal = useCallback((country) => {
    setDeletingCountry(country);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setDeletingCountry(null);
  }, []);

  // Delete handler
  const handleConfirmDelete = useCallback(() => {
    if (deletingCountry) {
      deleteMutation.mutate(deletingCountry.id, {
        onSuccess: () => {
          closeDeleteModal();
        },
      });
    }
  }, [deletingCountry, deleteMutation, closeDeleteModal]);

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
    if (isLoading) return <CountriesTableSkeleton />;
    if (isError) {
      return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-red-200 dark:border-red-800 shadow-sm p-8 text-center">
          <p className="text-red-600 dark:text-red-400 font-medium">Failed to load countries. Please try again.</p>
        </div>
      );
    }
    if (!countries || countries.length === 0) {
      return <CountriesTableEmpty onAddClick={openCreateModal} />;
    }

    return (
      <CountriesTable
        countries={countries}
        pagination={pagination}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    );
  };

  return (
    <>
      {/* Page Header */}
      <div className="pt-6 pb-8 mb-8 border-b-2 border-gray-100 dark:border-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 pb-4 border-b-4 border-[#E60012] inline-block">
          Countries
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
          Manage countries, currencies, and exchange rates
        </p>
      </div>

      {/* Action Bar */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-sm p-5 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-6 py-3 bg-[#E60012] text-white rounded-xl text-sm font-semibold hover:bg-[#C00010] transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Country
          </button>

          <div className="relative flex-1 min-w-[240px] max-w-[320px]">
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search countries..."
              className="w-full pl-11 pr-10 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E60012] focus:border-transparent transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
            {search && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 ml-auto flex-wrap">
            <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:scale-105 active:scale-95">
              <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              Filter
            </button>

            <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:scale-105 active:scale-95">
              <ArrowUpDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              Sort
            </button>

            <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:scale-105 active:scale-95">
              <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Countries Table */}
      {renderContent()}

      {/* Add/Edit Country Modal */}
      <AddEditCountryModal
        isOpen={showModal}
        onClose={closeModal}
        editData={editingCountry}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Country"
        message="Are you sure you want to delete this country? All associated currency and exchange rate data will be permanently removed."
        itemName={deletingCountry?.name}
        confirmText="Delete Country"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
};

export default Countries;

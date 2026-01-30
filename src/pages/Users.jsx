import React, { useState, useCallback } from 'react';
import { CompaniesTable } from '@/components/companies/CompaniesTable';
import { CompaniesTableSkeleton } from '@/components/companies/CompaniesTableSkeleton';
import { CompaniesTableEmpty } from '@/components/companies/CompaniesTableEmpty';
import { CompaniesPageHeader, CompaniesActionBar } from '@/components/companies';
import { AddEditCompanyModal } from '@/components/companies/AddEditCompanyModal';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { useCompanies, useDeleteCompany } from '@/hooks/api/useCompanies';

const Companies = () => {
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCompany, setDeletingCompany] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  
  // Search
  const [search, setSearch] = useState('');

  // API hooks
  const { data, isLoading, isError } = useCompanies({ page, perPage, search });
  const deleteMutation = useDeleteCompany();

  const companies = data?.companies || [];
  const pagination = data?.pagination;

  // Modal handlers
  const openCreateModal = useCallback(() => {
    setEditingCompany(null);
    setShowModal(true);
  }, []);

  const openEditModal = useCallback((company) => {
    setEditingCompany(company);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setEditingCompany(null);
  }, []);

  const openDeleteModal = useCallback((company) => {
    setDeletingCompany(company);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setDeletingCompany(null);
  }, []);

  // Delete handler
  const handleConfirmDelete = useCallback(() => {
    if (deletingCompany) {
      deleteMutation.mutate(deletingCompany.id, {
        onSuccess: () => {
          closeDeleteModal();
        },
      });
    }
  }, [deletingCompany, deleteMutation, closeDeleteModal]);

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
    if (isLoading) return <CompaniesTableSkeleton />;
    if (isError) {
      return (
        <div className="bg-white rounded-2xl border-2 border-red-200 shadow-sm p-8 text-center">
          <p className="text-red-600 font-medium">Failed to load companies. Please try again.</p>
        </div>
      );
    }
    if (!companies || companies.length === 0) {
      return <CompaniesTableEmpty onAddClick={openCreateModal} />;
    }

    return (
      <CompaniesTable
        companies={companies}
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
      <CompaniesPageHeader />
      <CompaniesActionBar onAddCompany={openCreateModal} search={search} onSearchChange={handleSearchChange} />
      {renderContent()}

      {/* Add/Edit Company Modal */}
      <AddEditCompanyModal isOpen={showModal} onClose={closeModal} editData={editingCompany} />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Company"
        message="Are you sure you want to delete this company? All associated data, users, and marketing plans will be permanently removed."
        itemName={deletingCompany?.name}
        confirmText="Delete Company"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
};

export default Companies;

import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  AnnouncementsPageHeader,
  AnnouncementsActionBar,
  AnnouncementsTable,
  AnnouncementsTableSkeleton,
  AnnouncementsTableEmpty,
  AddEditAnnouncementModal,
} from '@/components/announcements';
import { useAnnouncements } from '@/hooks/api/useAnnouncements';
import { useCompanies } from '@/hooks/api/useCompanies';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { isAdminUser } from '@/lib/permissions';

const DEFAULT_PER_PAGE = 10;
const SEARCH_DEBOUNCE_MS = 400;

const Announcements = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const isAdmin = isAdminUser(currentUser);

  // Filters
  const [searchInput, setSearchInput] = useState('');
  const search = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);
  const [companyId, setCompanyId] = useState('');
  const [forAll, setForAll] = useState('');
  const [unreadOnly, setUnreadOnly] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);

  // Add/Edit modal
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  const { data, isLoading, isError } = useAnnouncements({
    page,
    perPage,
    search,
    companyId,
    forAll,
    unreadOnly,
  });
  const { data: companiesData } = useCompanies({ page: 1, perPage: 100 }, { enabled: isAdmin });

  const announcements = data?.announcements || [];
  const pagination = data?.pagination;
  const companies = companiesData?.companies || [];

  const hasActiveFilters = Boolean(searchInput || companyId || forAll || unreadOnly);

  // Reset to page 1 once the debounced search term actually changes the query,
  // rather than on every keystroke.
  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleSearchChange = useCallback((value) => {
    setSearchInput(value);
  }, []);

  const handleCompanyChange = useCallback((value) => {
    setCompanyId(value);
    setPage(1);
  }, []);

  const handleForAllChange = useCallback((value) => {
    setForAll(value);
    setPage(1);
  }, []);

  const handleUnreadOnlyChange = useCallback((value) => {
    setUnreadOnly(value);
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearch('');
    setCompanyId('');
    setForAll('');
    setUnreadOnly(false);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage) => setPage(newPage), []);

  const handleItemsPerPageChange = useCallback((newPerPage) => {
    setPerPage(newPerPage);
    setPage(1);
  }, []);

  const openCreateModal = useCallback(() => {
    setEditingAnnouncement(null);
    setShowModal(true);
  }, []);

  const openEditModal = useCallback((announcement) => {
    setEditingAnnouncement(announcement);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setEditingAnnouncement(null);
  }, []);

  const renderContent = () => {
    if (isLoading) return <AnnouncementsTableSkeleton />;
    if (isError) return <AnnouncementsTableEmpty isError />;
    if (!announcements.length) {
      return <AnnouncementsTableEmpty hasActiveFilters={hasActiveFilters} onClearFilters={clearFilters} />;
    }
    return (
      <AnnouncementsTable
        announcements={announcements}
        pagination={pagination}
        onEdit={openEditModal}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    );
  };

  return (
    <>
      <AnnouncementsPageHeader
        total={pagination?.total}
        unreadCount={data?.unreadCount}
        onNewAnnouncement={openCreateModal}
      />

      <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm mb-8 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-800 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Announcement history
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Review announcements sent to dealers and their delivery status.
          </p>
        </div>

        <AnnouncementsActionBar
          companies={companies}
          search={search}
          onSearchChange={handleSearchChange}
          companyId={companyId}
          onCompanyChange={handleCompanyChange}
          forAll={forAll}
          onForAllChange={handleForAllChange}
          unreadOnly={unreadOnly}
          onUnreadOnlyChange={handleUnreadOnlyChange}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />

        {renderContent()}
      </section>

      <AddEditAnnouncementModal
        isOpen={showModal}
        onClose={closeModal}
        editData={editingAnnouncement}
        companies={companies}
      />
    </>
  );
};

export default Announcements;

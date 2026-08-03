import { useMemo, useState, useCallback } from 'react';
import { mockReminders } from '@/data/mockRemindersData';

const DEFAULT_PER_PAGE = 10;

/**
 * Local state manager for the Reminders page.
 *
 * Holds the (mock) reminders list plus search / filter / pagination state and
 * exposes derived, filtered + paginated data. Because there is no backend yet,
 * new reminders are prepended to local state and deletions remove from it.
 */
export const useReminders = () => {
  const [reminders, setReminders] = useState(mockReminders);

  // Filters
  const [search, setSearch] = useState('');
  const [dealerId, setDealerId] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);

  const resetPage = () => setPage(1);

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    resetPage();
  }, []);

  const handleDealerFilter = useCallback((value) => {
    setDealerId(value);
    resetPage();
  }, []);

  const handleTypeFilter = useCallback((value) => {
    setType(value);
    resetPage();
  }, []);

  const handleStatusFilter = useCallback((value) => {
    setStatus(value);
    resetPage();
  }, []);

  const clearFilters = useCallback(() => {
    setSearch('');
    setDealerId('');
    setType('');
    setStatus('');
    resetPage();
  }, []);

  const handlePageChange = useCallback((newPage) => setPage(newPage), []);

  const handlePerPageChange = useCallback((value) => {
    setPerPage(value);
    resetPage();
  }, []);

  /** Add reminders (one per targeted dealer) to the top of the list. */
  const addReminders = useCallback((newReminders) => {
    setReminders((prev) => [...newReminders, ...prev]);
  }, []);

  const removeReminder = useCallback((id) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const hasActiveFilters = Boolean(search || dealerId || type || status);

  // Apply filters
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return reminders.filter((r) => {
      const matchesSearch =
        !term ||
        r.title.toLowerCase().includes(term) ||
        r.message.toLowerCase().includes(term) ||
        r.dealerName.toLowerCase().includes(term);
      const matchesDealer = !dealerId || String(r.dealerId) === String(dealerId);
      const matchesType = !type || r.type === type;
      const matchesStatus = !status || r.status === status;
      return matchesSearch && matchesDealer && matchesType && matchesStatus;
    });
  }, [reminders, search, dealerId, type, status]);

  // Paginate
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, currentPage, perPage]);

  const pagination = {
    page: currentPage,
    per_page: perPage,
    total,
    total_pages: totalPages,
  };

  return {
    // data
    reminders: paginated,
    pagination,
    total,

    // filter state
    search,
    dealerId,
    type,
    status,
    hasActiveFilters,

    // filter handlers
    handleSearchChange,
    handleDealerFilter,
    handleTypeFilter,
    handleStatusFilter,
    clearFilters,

    // pagination handlers
    handlePageChange,
    handlePerPageChange,

    // mutations
    addReminders,
    removeReminder,
  };
};

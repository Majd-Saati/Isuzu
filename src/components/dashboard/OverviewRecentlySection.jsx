import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Filter, Calendar, ChevronDown, RotateCcw } from 'lucide-react';
import { OverviewTable } from '@/components/dashboard/OverviewTable';
import { OverviewTableSkeleton } from '@/components/dashboard/OverviewTableSkeleton';
import { OverviewTableEmpty } from '@/components/dashboard/OverviewTableEmpty';
import { useRecentOperations } from '@/hooks/api/useRecentOperations';
import { useCompanies } from '@/hooks/api/useCompanies';
import { useTerms } from '@/hooks/api/useTerms';
import { usePlans } from '@/hooks/api/usePlans';
import { useActivities } from '@/hooks/api/useActivities';
import { isAdminUser } from '@/lib/permissions';
import { useCurrency } from '@/contexts/CurrencyContext';

const getLogoUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `https://marketing.5v.ae/${path}`;
};

const selectClass =
  'px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E60012]/50 focus:border-[#E60012] min-w-0 w-full cursor-pointer';

const inputClass =
  'px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E60012]/50 focus:border-[#E60012] w-full';

const KIND_OPTIONS = [
  { value: '', label: 'All kinds' },
  { value: 'plan_created', label: 'Plan created' },
  { value: 'budget', label: 'Budget' },
  { value: 'meta', label: 'Meta' },
];

const BUDGET_TYPE_OPTIONS = [
  { value: '', label: 'Any' },
  { value: 'estimated cost', label: 'Estimated cost' },
  { value: 'actual cost', label: 'Actual Cost' },
  { value: 'support cost', label: 'Support Cost' },
  { value: 'invoice', label: 'Invoice' },
];

const META_TYPE_OPTIONS = [
  { value: '', label: 'Any' },
  { value: 'comment', label: 'Comment' },
  { value: 'evidence', label: 'Evidence' },
];

const BUDGET_STATUS_OPTIONS = [
  { value: '', label: 'Any' },
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'denied', label: 'Denied' },
];

const PER_PAGE_OPTIONS = [10, 20, 50, 100];

const pageInputClass =
  'w-14 px-2 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm text-center text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E60012]/50 focus:border-[#E60012] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';

export const OverviewRecentlySection = () => {
  const user = useSelector((state) => state.auth.user);
  const isAdmin = isAdminUser(user);
  const { currency } = useCurrency();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [pageInput, setPageInput] = useState('1');
  const [companyId, setCompanyId] = useState(isAdmin ? '' : String(user?.id || ''));
  const [kind, setKind] = useState('');
  const [termId, setTermId] = useState('');
  const [planId, setPlanId] = useState('');
  const [activityId, setActivityId] = useState('');
  const [budgetType, setBudgetType] = useState('');
  const [budgetStatus, setBudgetStatus] = useState('');
  const [metaType, setMetaType] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    if (!isAdmin && user?.id) setCompanyId(String(user.id));
  }, [isAdmin, user]);

  const effectiveCompanyId = isAdmin ? companyId : String(user?.id || '');

  const bumpPageReset = () => setPage(1);

  const resetAllFilters = () => {
    setPage(1);
    setKind('');
    setTermId('');
    setPlanId('');
    setActivityId('');
    setBudgetType('');
    setBudgetStatus('');
    setMetaType('');
    setDateFrom('');
    setDateTo('');
    if (isAdmin) {
      setCompanyId('');
    } else if (user?.id) {
      setCompanyId(String(user.id));
    }
  };

  const hasActiveFilters = Boolean(
    kind ||
      termId ||
      planId ||
      activityId ||
      budgetType ||
      budgetStatus ||
      metaType ||
      dateFrom ||
      dateTo ||
      (isAdmin && companyId) ||
      perPage !== 20 ||
      page !== 1
  );

  const { data: companiesData } = useCompanies({ page: 1, perPage: 100 }, { enabled: isAdmin });
  const companies = companiesData?.companies ?? [];

  const { data: termsData } = useTerms({ page: 1, perPage: 100 });
  const terms = termsData?.terms ?? [];

  const { data: plansData } = usePlans({
    page: 1,
    perPage: 100,
    companyId: effectiveCompanyId || undefined,
    termId: termId || undefined,
  });
  const plans = plansData?.plans ?? [];

  const { data: activitiesData } = useActivities({
    planIds: planId ? [planId] : [],
    page: 1,
    perPage: 200,
  });
  const activities = activitiesData?.activities ?? [];

  const apiParams = useMemo(() => {
    const p = {
      page,
      per_page: perPage,
    };
    if (effectiveCompanyId) p.company_id = effectiveCompanyId;
    if (kind) p.kind = kind;
    if (termId) p.term_id = termId;
    if (planId) p.plan_id = planId;
    if (activityId) p.activity_id = activityId;
    if (budgetType) p.budget_type = budgetType;
    if (budgetStatus) p.budget_status = budgetStatus;
    if (metaType.trim()) p.meta_type = metaType.trim();
    if (dateFrom) p.date_from = dateFrom;
    if (dateTo) p.date_to = dateTo;
    return p;
  }, [
    page,
    perPage,
    effectiveCompanyId,
    kind,
    termId,
    planId,
    activityId,
    budgetType,
    budgetStatus,
    metaType,
    dateFrom,
    dateTo,
  ]);

  const queryEnabled = isAdmin ? true : Boolean(effectiveCompanyId);

  const { data, isError, isPending } = useRecentOperations(apiParams, {
    enabled: queryEnabled,
  });

  const recentItems = data?.recentOperations || [];
  const pagination = data?.pagination;
  const totalRaw =
    pagination != null && pagination.total != null && pagination.total !== ''
      ? Number(pagination.total)
      : 0;
  const total = Number.isFinite(totalRaw) ? totalRaw : 0;
  const totalPagesNum =
    pagination != null &&
    pagination.total_pages != null &&
    pagination.total_pages !== '' &&
    Number.isFinite(Number(pagination.total_pages))
      ? Math.max(1, Math.floor(Number(pagination.total_pages)))
      : null;
  const totalPages = totalPagesNum ?? 1;
  const currentPage = Math.min(page, totalPages);
  const perPageFromApi =
    pagination != null && pagination.per_page != null && pagination.per_page !== ''
      ? Number(pagination.per_page)
      : perPage;

  const pageInputFocusedRef = useRef(false);

  useEffect(() => {
    if (pageInputFocusedRef.current) return;
    setPageInput(String(page));
  }, [page]);

  useEffect(() => {
    if (totalPagesNum == null) return;
    if (page > totalPagesNum) setPage(totalPagesNum);
  }, [totalPagesNum, page]);

  /** Parse digits and update `page` immediately so the request runs without waiting for blur. */
  const syncPageFromDigitString = useCallback(
    (digitString) => {
      if (totalPagesNum == null) return;
      const raw = String(digitString).trim();
      if (raw === '') return;
      const n = parseInt(raw, 10);
      if (Number.isNaN(n)) return;
      const clamped = Math.min(Math.max(1, n), totalPagesNum);
      setPage(clamped);
      setPageInput(String(clamped));
    },
    [totalPagesNum]
  );

  const onPerPageChange = (e) => {
    const v = Number(e.target.value);
    if (!Number.isFinite(v) || v < 1) return;
    setPerPage(v);
    setPage(1);
    setPageInput('1');
  };

  const onTermChange = (e) => {
    bumpPageReset();
    setTermId(e.target.value);
    setPlanId('');
    setActivityId('');
  };

  const onPlanChange = (e) => {
    bumpPageReset();
    setPlanId(e.target.value);
    setActivityId('');
  };

  const onCompanyChange = (e) => {
    bumpPageReset();
    setCompanyId(e.target.value);
    setTermId('');
    setPlanId('');
    setActivityId('');
  };

  const renderTable = () => {
    if (queryEnabled && isPending && !isError) {
      return <OverviewTableSkeleton />;
    }

    if (isError) {
      return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-red-200 dark:border-red-800 shadow-sm p-8 text-center">
          <p className="text-red-600 dark:text-red-400 font-medium">
            Failed to load recent operations. Please try again.
          </p>
        </div>
      );
    }

    if (!recentItems.length) {
      return <OverviewTableEmpty />;
    }

    const mappedItems = recentItems.map((item) => ({
      ...item,
      company_logo: getLogoUrl(item.company_logo),
    }));

    return <OverviewTable items={mappedItems} isAdmin={isAdmin} appCurrencyCode={currency} />;
  };

  const rangeStart = total === 0 ? 0 : (currentPage - 1) * perPageFromApi + 1;
  const rangeEnd = total === 0 ? 0 : Math.min(currentPage * perPageFromApi, total);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            className="flex flex-1 items-center gap-2 min-w-0 text-left rounded-lg py-1 -my-1 px-1 -mx-1 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E60012]/50"
            aria-expanded={filtersOpen}
          >
            <ChevronDown
              className={`w-4 h-4 shrink-0 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                filtersOpen ? 'rotate-180' : ''
              }`}
              aria-hidden
            />
            <Filter className="w-4 h-4 shrink-0 text-[#E60012]" aria-hidden />
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Filters</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              resetAllFilters();
            }}
            disabled={!hasActiveFilters}
            title="Reset all filters"
            aria-label="Reset all filters"
            className="shrink-0 p-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#E60012] dark:hover:text-[#E60012] disabled:opacity-35 disabled:pointer-events-none disabled:hover:bg-transparent transition-colors"
          >
            <RotateCcw className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {filtersOpen ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          {isAdmin && (
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Company</span>
              <select value={companyId} onChange={onCompanyChange} className={selectClass}>
                <option value="">All companies</option>
                {companies.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Kind</span>
            <select
              value={kind}
              onChange={(e) => {
                bumpPageReset();
                setKind(e.target.value);
              }}
              className={selectClass}
            >
              {KIND_OPTIONS.map((opt) => (
                <option key={opt.value || 'all'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Term</span>
            <select value={termId} onChange={onTermChange} className={selectClass}>
              <option value="">Any term</option>
              {terms.map((t) => (
                <option key={t.id} value={String(t.id)}>
                  {t.term_name || t.name || t.id}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Plan</span>
            <select value={planId} onChange={onPlanChange} className={selectClass}>
              <option value="">Any plan</option>
              {plans.map((pl) => (
                <option key={pl.id} value={String(pl.id)}>
                  {pl.name || pl.plan_name || pl.id}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Activity</span>
            <select
              value={activityId}
              onChange={(e) => {
                bumpPageReset();
                setActivityId(e.target.value);
              }}
              className={selectClass}
              disabled={!planId}
            >
              <option value="">Any activity</option>
              {activities.map((a) => (
                <option key={a.id} value={String(a.id)}>
                  {a.name || a.activity_name || a.id}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Budget type</span>
            <select
              value={budgetType}
              onChange={(e) => {
                bumpPageReset();
                setBudgetType(e.target.value);
              }}
              className={selectClass}
            >
              {BUDGET_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value || 'any'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Budget status</span>
            <select
              value={budgetStatus}
              onChange={(e) => {
                bumpPageReset();
                setBudgetStatus(e.target.value);
              }}
              className={selectClass}
            >
              {BUDGET_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value || 'any'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Meta type</span>
            <select
              value={metaType}
              onChange={(e) => {
                bumpPageReset();
                setMetaType(e.target.value);
              }}
              className={selectClass}
            >
              {META_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value || 'any'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Date from
            </span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                bumpPageReset();
                setDateFrom(e.target.value);
              }}
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Date to
            </span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                bumpPageReset();
                setDateTo(e.target.value);
              }}
              className={inputClass}
            />
          </label>
        </div>
        ) : null}
      </div>

      {renderTable()}

      {!isPending && !isError && total > 0 && (
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-4 px-1 py-1">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <label className="flex items-center gap-2">
              <span className="whitespace-nowrap">Rows per page</span>
              <select value={perPage} onChange={onPerPageChange} className={`${selectClass} w-auto min-w-[4.5rem]`}>
                {PER_PAGE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <span className="text-gray-500 dark:text-gray-500">
              {rangeStart}–{rangeEnd} of {total}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 sm:px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Previous
            </button>
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="whitespace-nowrap">Page</span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={pageInput}
                onFocus={() => {
                  pageInputFocusedRef.current = true;
                }}
                onChange={(e) => {
                  const next = e.target.value.replace(/\D/g, '');
                  setPageInput(next);
                  syncPageFromDigitString(next);
                }}
                onBlur={(e) => {
                  pageInputFocusedRef.current = false;
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.trim() === '') {
                    setPageInput(String(page));
                    return;
                  }
                  syncPageFromDigitString(val);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    syncPageFromDigitString(e.currentTarget.value.replace(/\D/g, ''));
                    e.currentTarget.blur();
                  }
                }}
                className={pageInputClass}
                aria-label="Go to page"
              />
              <span className="text-gray-500 dark:text-gray-500 whitespace-nowrap">
                / {totalPagesNum != null ? totalPagesNum : '—'}
              </span>
            </label>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 sm:px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

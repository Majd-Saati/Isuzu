import React from 'react';
import { SectionTitle } from '@/components/dashboard/SectionTitle';
import { useBudgetAllocationTable } from './hooks/useBudgetAllocationTable';
import { BudgetAllocationFilters } from './components/Filters';
import { TermSection } from './components/TermSection';
import { BudgetAllocationEmptyState } from './components/EmptyState';
import { BudgetAllocationErrorState } from './components/ErrorState';
import { BudgetAllocationTableSkeleton } from './BudgetAllocationTableSkeleton';

export const BudgetAllocationTable = () => {
  const {
    termId,
    setTermId,
    companyId,
    setCompanyId,
    termsFromList,
    companies,
    isAdmin,
    terms,
    isLoading,
    isError,
    error,
    hasTerms,
    hasAnyAllocations,
  } = useBudgetAllocationTable();

  if (isLoading) {
    return <BudgetAllocationTableSkeleton />;
  }

  if (isError) {
    return <BudgetAllocationErrorState error={error} />;
  }

  if (!hasTerms || !hasAnyAllocations) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-[24px] p-6 md:p-8 shadow-[0px_4px_16px_rgba(0,0,0,0.06)] border-2 border-gray-100 dark:border-gray-800 animate-fade-in">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <SectionTitle title="Budget allocations" />
          <BudgetAllocationFilters
            termId={termId}
            terms={termsFromList}
            companyId={companyId}
            companies={companies}
            onTermChange={setTermId}
            onCompanyChange={setCompanyId}
            isAdmin={isAdmin}
          />
        </div>
        <BudgetAllocationEmptyState />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-[24px] p-6 md:p-8 shadow-[0px_4px_16px_rgba(0,0,0,0.06)] border-2 border-gray-100 dark:border-gray-800 animate-fade-in">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <SectionTitle title="Budget allocations" />
        <BudgetAllocationFilters
          termId={termId}
          terms={termsFromList}
          companyId={companyId}
          companies={companies}
          onTermChange={setTermId}
          onCompanyChange={setCompanyId}
          isAdmin={isAdmin}
        />
      </div>
      <div className="space-y-2">
        {terms.map((term) => (
          <TermSection key={term.term_id} term={term} />
        ))}
      </div>
    </div>
  );
};

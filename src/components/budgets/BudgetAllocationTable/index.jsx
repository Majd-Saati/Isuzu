import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useBudgetAllocationTable } from './hooks/useBudgetAllocationTable';
import { BudgetAllocationFilters } from './components/Filters';
import { TermSection } from './components/TermSection';
import { BudgetAllocationEmptyState } from './components/EmptyState';
import { BudgetAllocationErrorState } from './components/ErrorState';
import { BudgetAllocationTableSkeleton } from './BudgetAllocationTableSkeleton';
import { SetBudgetAllocationModal } from '@/components/budgets/SetBudgetAllocationModal';
import { useSetBudgetAllocation, useDeleteBudgetAllocation } from '@/hooks/api/useBudgetAllocation';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';

export const BudgetAllocationTable = () => {
  const [showSetModal, setShowSetModal] = useState(false);
  const [preselectedTermId, setPreselectedTermId] = useState(null);
  const [preselectedTermName, setPreselectedTermName] = useState('');
  const [allocationToDelete, setAllocationToDelete] = useState(null);
  const setAllocationMutation = useSetBudgetAllocation();
  const deleteAllocationMutation = useDeleteBudgetAllocation();

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

  const filtersAndAction = (
    <div className="flex flex-wrap items-center gap-3 md:gap-4">
        {isAdmin && (
        <button
          type="button"
          onClick={() => {
            setPreselectedTermId(null);
            setPreselectedTermName('');
            setShowSetModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#E60012] hover:bg-[#C00010] transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Set allocation
        </button>
      )}
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
  );

  if (!hasTerms || !hasAnyAllocations) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
          <div className="flex flex-wrap items-center justify-end gap-3 md:gap-4">
            {filtersAndAction}
          </div>
        </div>
        <BudgetAllocationEmptyState />
        <SetBudgetAllocationModal
          isOpen={showSetModal}
          onClose={() => setShowSetModal(false)}
          onSubmit={(payload, { onSuccess, onSettled }) => {
            setAllocationMutation.mutate(payload, { onSuccess, onSettled });
          }}
          isSubmitting={setAllocationMutation.isPending}
          terms={termsFromList}
          companies={companies}
          preselectedTermId={preselectedTermId}
          preselectedTermName={preselectedTermName}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        <div className="flex flex-wrap items-center justify-start gap-3 md:gap-4">
          {filtersAndAction}
        </div>
      </div>
      <div className="space-y-6">
        {terms.map((term) => (
          <TermSection
            key={term.term_id}
            term={term}
            onDeleteAllocation={(allocation) => setAllocationToDelete({ id: allocation.id, company_name: allocation.company_name })}
            onAddAllocation={isAdmin ? (t) => { setPreselectedTermId(t.term_id); setPreselectedTermName(t.term_name || ''); setShowSetModal(true); } : undefined}
          />
        ))}
      </div>
      <DeleteConfirmationModal
        isOpen={!!allocationToDelete}
        onClose={() => setAllocationToDelete(null)}
        onConfirm={() => {
          if (allocationToDelete) {
            deleteAllocationMutation.mutate(
              { id: allocationToDelete.id },
              { onSuccess: () => setAllocationToDelete(null) }
            );
          }
        }}
        title="Delete budget allocation"
        message="Are you sure you want to delete this budget allocation? This action cannot be undone."
        itemName={allocationToDelete?.company_name ? `${allocationToDelete.company_name} (ID: ${allocationToDelete.id})` : ''}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteAllocationMutation.isPending}
      />
      <SetBudgetAllocationModal
        isOpen={showSetModal}
        onClose={() => setShowSetModal(false)}
        onSubmit={(payload, { onSuccess, onSettled }) => {
          setAllocationMutation.mutate(payload, { onSuccess, onSettled });
        }}
        isSubmitting={setAllocationMutation.isPending}
        terms={termsFromList}
        companies={companies}
        preselectedTermId={preselectedTermId}
        preselectedTermName={preselectedTermName}
      />
    </div>
  );
};

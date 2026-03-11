import React from 'react';
import { BudgetAllocationTable } from '@/components/budgets/BudgetAllocationTable';

const BudgetsAllocation = () => {
  return (
    <>
      <div className="pt-6 pb-8 mb-8 border-b-2 border-gray-100 dark:border-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 pb-4 border-b-4 border-[#E60012] inline-block">
          Budgets Allocation
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
          View and manage budget allocations by term and company
        </p>
      </div>
      <BudgetAllocationTable />
    </>
  );
};

export default BudgetsAllocation;

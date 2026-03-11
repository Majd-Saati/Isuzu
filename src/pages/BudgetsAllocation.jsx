import React from 'react';
import { BudgetAllocationTable } from '@/components/budgets/BudgetAllocationTable';

const BudgetsAllocation = () => {
  return (
    <div className="space-y-6">
      <div className="pt-6 pb-8 border-b-2 border-gray-100 dark:border-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 pb-4 border-b-4 border-[#E60012] inline-block">
          Budgets Allocation
        </h1>
      </div>
      <BudgetAllocationTable />
    </div>
  );
};

export default BudgetsAllocation;

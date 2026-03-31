import React from 'react';
import { useSelector } from 'react-redux';
import { BudgetAllocationTable } from '@/components/budgets/BudgetAllocationTable';

const BudgetsAllocation = () => {
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.is_admin === '1' || user?.is_admin === 1;
console.log(user);
  return (
    <>
      <div className="pt-6 pb-8 mb-8 border-b-2 border-gray-100 dark:border-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 pb-4 border-b-4 border-[#E60012] inline-block">
          Budgets Allocation
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
          {isAdmin
            ? 'View and manage budget allocations by term and company.'
            : 'View budget allocations by term.'}
        </p>
      </div>
      <BudgetAllocationTable />
    </>
  );
};

export default BudgetsAllocation;

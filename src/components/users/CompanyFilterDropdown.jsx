import React, { useState } from 'react';
import { Filter, ChevronDown } from 'lucide-react';

/**
 * Company filter dropdown component for UsersPage
 */
export const CompanyFilterDropdown = ({
  companies = [],
  selectedCompanyId,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId);

  const handleSelect = (companyId) => {
    onSelect(companyId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
      >
        <Filter className="w-4 h-4" />
        {selectedCompany?.label || 'Company'}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 min-w-[180px] max-h-60 overflow-y-auto">
          <button
            onClick={() => handleSelect('')}
            className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-xl"
          >
            All Companies
          </button>
          {companies.map((company) => (
            <button
              key={company.id}
              onClick={() => handleSelect(company.id)}
              className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 last:rounded-b-xl ${
                selectedCompanyId === company.id
                  ? 'text-[#E60012] font-medium'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {company.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};


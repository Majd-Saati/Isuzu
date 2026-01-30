import React from 'react';
import { Edit2, Trash2, Building2 } from 'lucide-react';
import { CustomPagination } from '@/components/ui/CustomPagination';

export const CompaniesTable = ({ 
  companies, 
  pagination, 
  onEdit, 
  onDelete,
  onPageChange,
  onItemsPerPageChange 
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return '—';
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/70 dark:bg-gray-800/70 border-b-2 border-gray-200 dark:border-gray-700">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 border-r-2 border-gray-200 dark:border-gray-700">
                Company Name
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 border-r-2 border-gray-200 dark:border-gray-700">
                Country
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 border-r-2 border-gray-200 dark:border-gray-700">
                Currency
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 border-r-2 border-gray-200 dark:border-gray-700">
                Created At
              </th>
              <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-gray-200 dark:divide-gray-700">
            {companies.map((company) => (
              <tr 
                key={company.id}
                className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-all duration-200"
              >
                <td className="px-6 py-4 border-r-2 border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E60012] to-[#C00010] flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                      {company.logo ? (
                        <img 
                          src={`https://marketing.5v.ae/${company.logo}`} 
                          alt={company.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="w-5 h-5" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {company.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 border-r-2 border-gray-200 dark:border-gray-700">
                  <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm font-medium">
                    {company.country_name || '—'}
                  </span>
                </td>
                <td className="px-6 py-4 border-r-2 border-gray-200 dark:border-gray-700">
                  <span className="inline-flex items-center px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-sm font-medium">
                    {company.country_currency || '—'}
                  </span>
                </td>
                <td className="px-6 py-4 border-r-2 border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(company.creation_date)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit?.(company)}
                      className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition-all hover:scale-110 active:scale-95"
                      title="Edit company"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete?.(company)}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-all hover:scale-110 active:scale-95"
                      title="Delete company"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <CustomPagination
        currentPage={pagination.page}
        totalPages={pagination.total_pages}
        totalItems={pagination.total}
        itemsPerPage={pagination.per_page}
        onPageChange={onPageChange}
        onItemsPerPageChange={onItemsPerPageChange}
      />
    </div>
  );
};


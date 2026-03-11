import React from 'react';
import { Edit2, Globe } from 'lucide-react';
import { CustomPagination } from '@/components/ui/CustomPagination';

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

const formatRate = (value) => {
  if (value == null) return '—';
  const num = Number(value);
  return isNaN(num) ? '—' : num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 4 });
};

export const TermExchangeTable = ({
  term,
  exchanges,
  pagination,
  onPageChange,
  onItemsPerPageChange,
  onEdit,
}) => {
  const safePagination = pagination || {
    page: 1,
    per_page: 20,
    total: 0,
    total_pages: 1,
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      {term && (
        <div className="px-6 py-4 bg-gray-50/70 dark:bg-gray-800/70 border-b-2 border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Term: {term.name}
            {term.start_date && term.end_date && (
              <span className="font-normal text-gray-500 dark:text-gray-400 ml-2">
                ({formatDate(term.start_date)} – {formatDate(term.end_date)})
              </span>
            )}
          </h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/70 dark:bg-gray-800/70 border-b-2 border-gray-200 dark:border-gray-700">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 border-r-2 border-gray-200 dark:border-gray-700">
                Country
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 border-r-2 border-gray-200 dark:border-gray-700">
                Currency
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 border-r-2 border-gray-200 dark:border-gray-700">
                Rate to JPY
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 border-r-2 border-gray-200 dark:border-gray-700">
                Created
              </th>
              <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-gray-200 dark:divide-gray-700">
            {exchanges.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-all duration-200"
              >
                <td className="px-6 py-4 border-r-2 border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E60012] to-[#C00010] flex items-center justify-center text-white font-semibold text-xs shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {row.country_name ?? '—'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 border-r-2 border-gray-200 dark:border-gray-700">
                  <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm font-medium">
                    {row.currency ?? '—'}
                  </span>
                </td>
                <td className="px-6 py-4 border-r-2 border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatRate(row.rate_to_jpy)}
                  </span>
                </td>
                <td className="px-6 py-4 border-r-2 border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(row.creation_date)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {onEdit ? (
                    <div className="flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => row.allowed_to_update && onEdit(row)}
                        disabled={!row.allowed_to_update}
                        title={row.allowed_to_update ? 'Edit exchange rate' : 'Not allowed to update'}
                        className={`p-2 rounded-lg transition-all ${
                          row.allowed_to_update
                            ? 'hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:scale-110 active:scale-95'
                            : 'opacity-40 cursor-not-allowed text-gray-400 dark:text-gray-500'
                        }`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 dark:text-gray-600">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CustomPagination
        currentPage={safePagination.page}
        totalPages={safePagination.total_pages ?? 1}
        totalItems={safePagination.total ?? 0}
        itemsPerPage={safePagination.per_page ?? 20}
        onPageChange={onPageChange}
        onItemsPerPageChange={onItemsPerPageChange}
      />
    </div>
  );
};

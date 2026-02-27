import React from 'react';
import { CustomPagination } from '@/components/ui/CustomPagination';

const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Allowed to Update
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
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {row.country_name ?? '—'}
                  </span>
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
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium ${
                      row.allowed_to_update
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {row.allowed_to_update ? 'Yes' : 'No'}
                  </span>
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

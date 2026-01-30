import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export const CustomPagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  itemsPerPage,
  totalItems,
  onItemsPerPageChange 
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t-2 border-gray-200 dark:border-gray-700 bg-gradient-to-b from-white dark:from-gray-900 to-gray-50 dark:to-gray-950">
      {/* Left side - Items per page and count */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#6B7280] dark:text-gray-300 font-medium">Rows per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-700 text-sm text-[#374151] dark:text-gray-200 font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 focus:border-gray-400 dark:focus:border-gray-600 hover:border-gray-400 dark:hover:border-gray-600 transition-all"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <span className="text-sm text-[#6B7280] dark:text-gray-300 font-medium">
          {startItem}-{endItem} of {totalItems}
        </span>
      </div>

      {/* Right side - Page navigation */}
      <div className="flex items-center gap-2">
        {/* First page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-800 disabled:hover:border-gray-200 dark:disabled:hover:border-gray-700 transition-all duration-200 group"
          aria-label="First page"
        >
          <ChevronsLeft className="w-4 h-4 text-[#6B7280] dark:text-gray-300 group-hover:text-[#374151] dark:group-hover:text-gray-100" />
        </button>

        {/* Previous page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-800 disabled:hover:border-gray-200 dark:disabled:hover:border-gray-700 transition-all duration-200 group"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4 text-[#6B7280] dark:text-gray-300 group-hover:text-[#374151] dark:group-hover:text-gray-100" />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-3 py-1.5 text-sm text-[#6B7280] dark:text-gray-300 font-medium">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`min-w-[36px] px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 border-2 ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-[#E60012] to-[#C00010] text-white border-[#E60012] shadow-md'
                    : 'bg-white dark:bg-gray-800 text-[#6B7280] dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-[#374151] dark:hover:text-gray-100'
                }`}
              >
                {page}
              </button>
            )
          ))}
        </div>

        {/* Next page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-800 disabled:hover:border-gray-200 dark:disabled:hover:border-gray-700 transition-all duration-200 group"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4 text-[#6B7280] dark:text-gray-300 group-hover:text-[#374151] dark:group-hover:text-gray-100" />
        </button>

        {/* Last page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-800 disabled:hover:border-gray-200 dark:disabled:hover:border-gray-700 transition-all duration-200 group"
          aria-label="Last page"
        >
          <ChevronsRight className="w-4 h-4 text-[#6B7280] dark:text-gray-300 group-hover:text-[#374151] dark:group-hover:text-gray-100" />
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { Calendar } from 'lucide-react';

export const TermFilter = ({ selectedTermId, terms, onChange }) => {
  return (
    <div className="flex items-center gap-3">
      <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      <select
        value={selectedTermId}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E60012]/50 focus:border-[#E60012] min-w-[200px] cursor-pointer"
      >
        {terms.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name || `Term ${t.id}`}
          </option>
        ))}
      </select>
    </div>
  );
};




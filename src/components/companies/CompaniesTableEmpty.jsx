import React from 'react';
import { Building2, Plus } from 'lucide-react';

export const CompaniesTableEmpty = ({ onAddClick }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#E60012]/10 dark:from-[#E60012]/20 to-[#C00010]/10 dark:to-[#C00010]/20 flex items-center justify-center mb-6 animate-pulse">
          <Building2 className="w-10 h-10 text-[#E60012]" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          No Companies Yet
        </h3>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
          There are no companies in the system yet. Add your first company to start managing dealers and marketing plans.
        </p>
        
        <button 
          onClick={onAddClick}
          className="flex items-center gap-2 px-6 py-3 bg-[#E60012] text-white rounded-xl text-sm font-semibold hover:bg-[#C00010] transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add First Company
        </button>
      </div>
    </div>
  );
};


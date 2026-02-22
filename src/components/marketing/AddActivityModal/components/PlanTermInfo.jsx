import React from 'react';
import { Calendar } from 'lucide-react';
import { formatDateDisplay } from '../utils';

export const PlanTermInfo = ({ planStartDate, planEndDate }) => {
  if (!planStartDate || !planEndDate) return null;

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-start gap-3">
      <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Plan Term Period</p>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
          Activity dates must be within: <span className="font-semibold">{formatDateDisplay(planStartDate)}</span> - <span className="font-semibold">{formatDateDisplay(planEndDate)}</span>
        </p>
      </div>
    </div>
  );
};



import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const styles = {
    accepted: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
    pending: 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    rejected: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
  };
  
  const icons = {
    accepted: <CheckCircle className="w-3.5 h-3.5" />,
    pending: <Clock className="w-3.5 h-3.5" />,
    rejected: <AlertCircle className="w-3.5 h-3.5" />,
  };

  const key = (status || '').toLowerCase();
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[key] || styles.pending}`}>
      {icons[key] || icons.pending}
      {status || 'Pending'}
    </span>
  );
};

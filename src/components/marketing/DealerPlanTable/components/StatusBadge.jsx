import React from 'react';
import { ChevronDown } from 'lucide-react';
import { statusStyles, statusOptions } from '../constants';

export const StatusBadge = ({ status, onClick, isOpen, disabled = false, className = '' }) => {
  const key = (status || '').toLowerCase();
  const style = statusStyles[key] || statusStyles['working on it'];
  const label = statusOptions.find(o => o.value === key)?.label || status;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap ${style.bg} ${className} ${
        disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {style.icon}
      <span>{label || 'Status'}</span>
      <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
  );
};




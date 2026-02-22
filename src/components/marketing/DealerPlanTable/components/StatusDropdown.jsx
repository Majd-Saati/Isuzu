import React from 'react';
import { Check } from 'lucide-react';
import { statusStyles, statusOptions } from '../constants';

export const StatusDropdown = ({
  activity,
  isOpen,
  position,
  customInput,
  onCustomInputChange,
  onCustomSubmit,
  onStatusClick,
  isAdmin,
  onKeyDown,
}) => {
  if (!isOpen) return null;

  const key = (activity.status || '').toLowerCase();

  return (
    <div 
      className="status-dropdown-menu fixed bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl z-[10000] min-w-[220px] overflow-hidden"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Custom Status Input */}
      <div className="p-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={customInput || ''}
            onChange={(e) => onCustomInputChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Enter custom status"
            disabled={isAdmin}
            className="flex-1 px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E60012]/50 focus:border-[#E60012] disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="button"
            onClick={() => onCustomSubmit()}
            disabled={isAdmin || !customInput?.trim()}
            className="p-1.5 rounded-lg bg-[#E60012] text-white hover:bg-[#C00010] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#E60012]"
            title="Submit custom status"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      
      {/* Status Options */}
      {statusOptions.map((opt) => {
        const optStyle = statusStyles[opt.value];
        const isCurrentStatus = key === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onStatusClick(opt.value)}
            className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-2.5 ${
              isCurrentStatus ? 'bg-gray-50 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${optStyle.dot}`} />
            <span className={`font-medium whitespace-nowrap ${optStyle.text} dark:text-gray-200`}>{opt.label}</span>
            {isCurrentStatus && (
              <span className="ml-auto text-[10px] text-gray-400 dark:text-gray-500">✓</span>
            )}
          </button>
        );
      })}
    </div>
  );
};




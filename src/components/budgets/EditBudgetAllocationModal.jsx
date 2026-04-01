import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

/**
 * Modal to update allocation value via POST /budget_allocation_update { id, value }.
 */
export function EditBudgetAllocationModal({
  isOpen,
  allocation,
  onClose,
  onSave,
  isSubmitting = false,
}) {
  const [value, setValue] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (!isOpen || !allocation) return;
    const v = allocation.value;
    setValue(v != null && v !== '' ? String(v) : '');
    setLocalError('');
  }, [isOpen, allocation]);

  if (!isOpen || !allocation) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');
    const num = parseFloat(String(value).replace(/,/g, ''), 10);
    if (!Number.isFinite(num) || num <= 0) {
      setLocalError('Enter a valid amount greater than 0');
      return;
    }
    onSave({ id: Number(allocation.id), value: num });
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget && !isSubmitting) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-[10000] p-4"
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-allocation-title"
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 id="edit-allocation-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Edit allocation
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {allocation.company_name || 'Company'}
            </span>
            {allocation.currency ? (
              <span className="text-gray-500 dark:text-gray-500"> · {allocation.currency}</span>
            ) : null}
          </p>
          <div>
            <label
              htmlFor="edit-allocation-value"
              className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              Allocated value *
            </label>
            <input
              id="edit-allocation-value"
              type="number"
              min={0}
              step="any"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#E60012]/80"
            />
            {localError ? (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{localError}</p>
            ) : null}
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[#E60012] hover:bg-[#cc0010] disabled:opacity-50"
            >
              {isSubmitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

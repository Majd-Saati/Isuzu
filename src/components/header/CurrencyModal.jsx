import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, DollarSign } from 'lucide-react';
import { useCountries } from '@/hooks/api/useCountries';
import { useCurrency, DEFAULT_CURRENCY } from '@/contexts/CurrencyContext';

/**
 * Build unique currency options from countries list (body.countries with id, name, currency, exchange_rate).
 */
const JPY_OPTION = { code: 'JPY', name: 'Japanese Yen' };

const getUniqueCurrencies = (countries) => {
  const byCode = new Map();
  byCode.set(JPY_OPTION.code, JPY_OPTION);
  if (!Array.isArray(countries) || countries.length === 0) {
    return Array.from(byCode.values()).sort((a, b) => a.code.localeCompare(b.code));
  }
  countries.forEach((c) => {
    const code = c?.currency?.trim();
    if (code && !byCode.has(code)) {
      byCode.set(code, { code, name: c.name || code });
    }
  });
  return Array.from(byCode.values()).sort((a, b) => a.code.localeCompare(b.code));
};

export const CurrencyModal = ({ isOpen, onClose }) => {
  const { currency: storedCurrency, setCurrency } = useCurrency();
  const [selectedCurrency, setSelectedCurrency] = useState(storedCurrency || DEFAULT_CURRENCY);

  const { data, isLoading, isError } = useCountries({ perPage: 500 });
  const countries = data?.countries ?? [];
  const currencyOptions = useMemo(() => getUniqueCurrencies(countries), [countries]);

  useEffect(() => {
    if (isOpen) {
      setSelectedCurrency(storedCurrency?.trim() || DEFAULT_CURRENCY);
    }
  }, [isOpen, storedCurrency, currencyOptions]);

  const handleConfirm = () => {
    const hasCurrencyChanged = selectedCurrency !== storedCurrency;

    setCurrency(selectedCurrency || DEFAULT_CURRENCY);

    if (hasCurrencyChanged && typeof window !== 'undefined') {
      window.location.reload();
      return;
    }

    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  const modal = (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6"
      aria-modal="true"
      role="dialog"
      aria-labelledby="currency-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/60 backdrop-blur-sm"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      <div className="relative z-10 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 w-full max-w-md p-6 animate-scale-in">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 id="currency-modal-title" className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Currency
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Choose your display currency for reports and data.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="currency-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select currency
          </label>
          {isLoading && (
            <div className="flex items-center gap-2 py-4 text-gray-500 dark:text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading currencies...</span>
            </div>
          )}
          {isError && (
            <p className="text-sm text-red-600 dark:text-red-400 py-2">
              Failed to load currencies. Please try again.
            </p>
          )}
          {!isLoading && !isError && (
            <select
              id="currency-select"
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:border-transparent transition-all"
            >
              {currencyOptions.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.code} {opt.name !== opt.code ? `(${opt.name})` : ''}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-[#E60012] hover:bg-[#C00010] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modal, document.body) : null;
};

import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';

const STORAGE_KEY = 'app_currency';

function readStoredCurrency() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw == null || !String(raw).trim()) return '';
    return String(raw).trim();
  } catch {
    return '';
  }
}

const CurrencyContext = createContext({
  currency: '',
  setCurrency: () => {},
});

/**
 * Global app currency for non-admin users (persisted).
 * Initial value comes from localStorage; if empty or invalid, CurrencyBootstrap sets the first
 * currency from the countries list. Admins use JPY in UI/API via permissions, not this value.
 */
export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState(readStoredCurrency);

  useEffect(() => {
    try {
      const trimmed = String(currency || '').trim();
      if (trimmed) localStorage.setItem(STORAGE_KEY, trimmed);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, [currency]);

  const setCurrency = useCallback((value) => {
    setCurrencyState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      return String(next ?? '').trim();
    });
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
};

/**
 * Current app currency from localStorage (for axios and non-React helpers).
 * May be empty until CurrencyBootstrap resolves the first available currency for non-admins.
 */
export const getStoredCurrency = () => readStoredCurrency();

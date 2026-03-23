import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';

const STORAGE_KEY = 'app_currency';

/** Default display & API currency for non-admin users */
export const DEFAULT_CURRENCY = 'JPY';

function readStoredCurrency() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw == null || !String(raw).trim()) return DEFAULT_CURRENCY;
    return String(raw).trim();
  } catch {
    return DEFAULT_CURRENCY;
  }
}

const CurrencyContext = createContext({
  currency: DEFAULT_CURRENCY,
  setCurrency: () => {},
});

/**
 * Global app currency for non-admin users (persisted). Admins always use JPY in UI/API rules elsewhere.
 */
export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState(readStoredCurrency);

  useEffect(() => {
    try {
      const toStore = String(currency || '').trim() || DEFAULT_CURRENCY;
      localStorage.setItem(STORAGE_KEY, toStore);
    } catch {
      // ignore
    }
  }, [currency]);

  const setCurrency = useCallback((value) => {
    setCurrencyState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      const normalized = String(next ?? '').trim() || DEFAULT_CURRENCY;
      return normalized;
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
 * Current app currency from localStorage (for axios and non-React helpers). Always at least JPY.
 */
export const getStoredCurrency = () => readStoredCurrency();

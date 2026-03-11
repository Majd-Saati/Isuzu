import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';

const STORAGE_KEY = 'app_currency';

const CurrencyContext = createContext({
  currency: '',
  setCurrency: () => {},
});

/**
 * Currency provider for non-admin users. Persists selected currency in localStorage
 * and exposes it for the header modal and for API client (x-currency header).
 */
export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    try {
      if (currency) {
        localStorage.setItem(STORAGE_KEY, currency);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, [currency]);

  const setCurrency = useCallback((value) => {
    setCurrencyState(typeof value === 'function' ? value() : value);
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
 * Get current currency from localStorage (for use outside React, e.g. API client).
 */
export const getStoredCurrency = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) || '';
  } catch {
    return '';
  }
};

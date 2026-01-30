import { useState, useCallback } from 'react';

/**
 * Custom hook for managing dropdown open/close state
 * @returns {Object} Dropdown state and handlers
 */
export const useDropdowns = () => {
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showTermDropdown, setShowTermDropdown] = useState(false);

  const toggleCompanyDropdown = useCallback(() => {
    setShowCompanyDropdown((prev) => !prev);
  }, []);

  const closeCompanyDropdown = useCallback(() => {
    // Use setTimeout to allow click events to fire before closing
    setTimeout(() => setShowCompanyDropdown(false), 200);
  }, []);

  const toggleTermDropdown = useCallback(() => {
    setShowTermDropdown((prev) => !prev);
  }, []);

  const closeTermDropdown = useCallback(() => {
    // Use setTimeout to allow click events to fire before closing
    setTimeout(() => setShowTermDropdown(false), 200);
  }, []);

  const closeAllDropdowns = useCallback(() => {
    setShowCompanyDropdown(false);
    setShowTermDropdown(false);
  }, []);

  return {
    showCompanyDropdown,
    showTermDropdown,
    toggleCompanyDropdown,
    closeCompanyDropdown,
    toggleTermDropdown,
    closeTermDropdown,
    closeAllDropdowns,
  };
};


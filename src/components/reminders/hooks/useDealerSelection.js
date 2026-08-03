import { useState, useCallback, useMemo } from 'react';

/**
 * Manages the set of dealers the admin has checked to send a reminder to.
 *
 * @param {Array<{id:number|string,label:string}>} dealers - full dealer list
 */
export const useDealerSelection = (dealers = []) => {
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleDealer = useCallback((id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const isSelected = useCallback((id) => selectedIds.includes(id), [selectedIds]);

  const allSelected = dealers.length > 0 && selectedIds.length === dealers.length;

  const toggleAll = useCallback(() => {
    setSelectedIds((prev) =>
      prev.length === dealers.length ? [] : dealers.map((d) => d.id)
    );
  }, [dealers]);

  const clearSelection = useCallback(() => setSelectedIds([]), []);

  const selectedDealers = useMemo(
    () => dealers.filter((d) => selectedIds.includes(d.id)),
    [dealers, selectedIds]
  );

  return {
    selectedIds,
    selectedDealers,
    selectedCount: selectedIds.length,
    isSelected,
    toggleDealer,
    allSelected,
    toggleAll,
    clearSelection,
  };
};

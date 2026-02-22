// Format date to readable format
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch {
    return 'N/A';
  }
};

// Map budget status (accepted/pending/other) to color classes used in the table
export const getAmountColorByStatus = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'accepted') return 'text-emerald-600';
  if (s === 'pending') return 'text-amber-600';
  return 'text-gray-900';
};




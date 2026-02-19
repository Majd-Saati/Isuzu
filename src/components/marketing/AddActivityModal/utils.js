// Format date for display
export const formatDateDisplay = (dateString) => {
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

// Format date for input (YYYY-MM-DD)
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return '';
  }
};

// Helper to parse YYYY-MM-DD into a local Date (no timezone offset)
export const parseYMD = (val) => {
  if (!val || typeof val !== 'string') return null;
  const parts = val.split('-').map((p) => Number(p));
  if (parts.length !== 3) return null;
  const [y, m, d] = parts;
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
};

// Extract date from activity object (handles multiple possible field names)
export const extractActivityDates = (activity) => {
  if (!activity) return { startDate: null, endDate: null };
  
  const startDate = activity.starts_at || activity.start_date || activity.start || activity.duration?.start;
  const endDate = activity.ends_at || activity.end_date || activity.end || activity.duration?.end;
  
  return { startDate, endDate };
};

// Prepare form payload for submission
export const prepareFormPayload = (values, isEditMode, initialActivity) => {
  if (isEditMode) {
    // Edit mode: only send activity_id, name, starts_at, ends_at
    return {
      activity_id: initialActivity.id,
      name: values.activityName,
      starts_at: values.startsAt,
      ends_at: values.endsAt,
    };
  }
  
  // Create mode: send all fields
  return {
    name: values.activityName,
    company_id: values.companyId,
    term_id: values.termId,
    starts_at: values.startsAt,
    ends_at: values.endsAt,
  };
};


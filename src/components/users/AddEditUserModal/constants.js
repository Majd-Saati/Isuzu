export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

export const ROLE_OPTIONS = [
  { value: '0', label: 'User' },
  { value: '1', label: 'Admin' },
];

export const STATUS_OPTIONS = [
  { value: '1', label: 'Active' },
  { value: '0', label: 'Inactive' },
];

export const formatGenderLabel = (gender) => {
  if (!gender) return '';
  return gender.charAt(0).toUpperCase() + gender.slice(1);
};

export const formatRoleLabel = (isAdmin) => {
  if (isAdmin === undefined || isAdmin === '') return '';
  return (isAdmin === '1' || isAdmin === 1) ? 'Admin' : 'User';
};

export const normalizeStatusValue = (status) => {
  if (status === undefined || status === null || status === '') return '';
  if (status === '1' || status === 1 || status === 'active') return '1';
  if (status === '0' || status === 0 || status === 'inactive') return '0';
  return String(status);
};

export const formatStatusLabel = (status) => {
  const normalized = normalizeStatusValue(status);
  if (!normalized) return '';
  return normalized === '1' ? 'Active' : 'Inactive';
};





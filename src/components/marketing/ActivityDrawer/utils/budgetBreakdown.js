/**
 * Read monthly breakdown from budget/meta payloads (snake_case, camelCase, or JSON string).
 * @param {Record<string, unknown>|null|undefined} record
 * @returns {Record<string, number|string>|null}
 */
export function getMonthsBreakdownFromRecord(record) {
  if (!record) return null;
  const raw = record.months_breakdown ?? record.monthsBreakdown;
  if (raw == null) return null;
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
    } catch {
      return null;
    }
    return null;
  }
  if (typeof raw === 'object' && !Array.isArray(raw)) return raw;
  return null;
}

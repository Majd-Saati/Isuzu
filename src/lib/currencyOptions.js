/**
 * Unique currencies from API countries, sorted by code (same order as currency picker).
 * No static default currency — first option is options[0] after sort.
 */
export function getSortedUniqueCurrenciesFromCountries(countries) {
  if (!Array.isArray(countries) || countries.length === 0) return [];
  const byCode = new Map();
  countries.forEach((c) => {
    const code = c?.currency?.trim();
    if (code && !byCode.has(code)) {
      byCode.set(code, { code, name: c.name || code });
    }
  });
  return Array.from(byCode.values()).sort((a, b) => a.code.localeCompare(b.code));
}

export function getFirstCurrencyFromCountries(countries) {
  const list = getSortedUniqueCurrenciesFromCountries(countries);
  return list[0]?.code ?? '';
}

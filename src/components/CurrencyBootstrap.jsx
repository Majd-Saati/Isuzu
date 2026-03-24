import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useCountries } from '@/hooks/api/useCountries';
import { useCurrency } from '@/contexts/CurrencyContext';
import { isAdminUser } from '@/lib/permissions';
import { getSortedUniqueCurrenciesFromCountries } from '@/lib/currencyOptions';

/**
 * For non-admin users: persist first available currency from the countries API when none
 * is stored or when the stored code is no longer in the list.
 */
export function CurrencyBootstrap() {
  const user = useSelector((state) => state.auth.user);
  const isAdmin = isAdminUser(user);
  const { currency, setCurrency } = useCurrency();

  const { data } = useCountries({ perPage: 500 }, { enabled: !isAdmin && !!user });

  useEffect(() => {
    if (isAdmin || !user) return;
    const countries = data?.countries;
    if (!countries) return;

    const options = getSortedUniqueCurrenciesFromCountries(countries);
    if (options.length === 0) return;

    const codes = new Set(options.map((o) => o.code));
    const current = String(currency ?? '').trim();

    if (!current || !codes.has(current)) {
      setCurrency(options[0].code);
    }
  }, [isAdmin, user, data?.countries, currency, setCurrency]);

  return null;
}

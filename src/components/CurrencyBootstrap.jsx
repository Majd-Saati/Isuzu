import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useCountries } from '@/hooks/api/useCountries';
import { useCurrency } from '@/contexts/CurrencyContext';
import { isAdminUser } from '@/lib/permissions';
import { getDealerCurrencyOptions } from '@/lib/currencyOptions';

/**
 * For non-admin users: persist dealer currency default/options from countries API.
 * Dealer options are [user country currency, JPY].
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

    const options = getDealerCurrencyOptions(countries, user?.country_id);
    if (options.length === 0) return;

    const codes = new Set(options.map((o) => o.code));
    const current = String(currency ?? '').trim();

    if (!current || !codes.has(current)) {
      setCurrency(options[0].code);
    }
  }, [isAdmin, user, data?.countries, currency, setCurrency]);

  return null;
}

import React from 'react';
import { SectionTitle } from '@/components/dashboard/SectionTitle';
import { SummaryCards } from '@/components/calendar/SummaryCards';
import { CalendarFilters } from '@/components/calendar/CalendarFilters';
import { CalendarEmptyState } from '@/components/calendar/CalendarEmptyState';
import { CalendarLoadingState } from '@/components/calendar/CalendarLoadingState';
import { CalendarErrorState } from '@/components/calendar/CalendarErrorState';
import { CalendarTermCard } from '@/components/calendar/CalendarTermCard';
import { CalendarCompanyCard } from '@/components/calendar/CalendarCompanyCard';
import { CalendarTable } from '@/components/calendar/CalendarTable';
import { useCalendarPage } from '@/hooks/calendar/useCalendarPage';
import { useCurrency } from '@/contexts/CurrencyContext';
import { getEffectiveCurrencyCode } from '@/lib/dashboardMoney';

const Calendar = () => {
  const {
    isAdmin,
    selectedTermId,
    setSelectedTermId,
    selectedCompanyId,
    setSelectedCompanyId,
    terms,
    companies,
    isQueryEnabled,
    calendarData,
    isLoading,
    isError,
    error,
    summaryStats,
  } = useCalendarPage();

  const { currency } = useCurrency();
  const displayCurrencyCode = getEffectiveCurrencyCode(isAdmin, currency);

  const filters = (
    <CalendarFilters
      selectedTermId={selectedTermId}
      setSelectedTermId={setSelectedTermId}
      selectedCompanyId={selectedCompanyId}
      setSelectedCompanyId={setSelectedCompanyId}
      terms={terms}
      companies={companies}
      isAdmin={isAdmin}
    />
  );

  const showEmpty = !isQueryEnabled || (!calendarData && !isLoading);
  if (showEmpty) {
    return (
      <div className="space-y-5">
        <SectionTitle title="MARKETING CALENDAR VIEW" />
        {filters}
        {!isQueryEnabled && <CalendarEmptyState isAdmin={isAdmin} />}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-5">
        <SectionTitle title="MARKETING CALENDAR VIEW" />
        {filters}
        <CalendarLoadingState />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-5">
        <SectionTitle title="MARKETING CALENDAR VIEW" />
        {filters}
        <CalendarErrorState message={error?.message} />
      </div>
    );
  }

  const { term, company, months = [], plans = [] } = calendarData || {};

  return (
    <div className="space-y-5">
      <SectionTitle title="MARKETING CALENDAR VIEW" />
      {filters}

      <SummaryCards
        totalActualCost={summaryStats.totalActualCost}
        totalSupportCost={summaryStats.totalSupportCost}
        isAdmin={isAdmin}
        currencyCode={currency}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CalendarTermCard term={term} />
        {company && selectedCompanyId !== 'all' && (
          <CalendarCompanyCard company={company} displayCurrencyCode={displayCurrencyCode} />
        )}
      </div>

      <CalendarTable plans={plans} months={months} isAdmin={isAdmin} currencyCode={currency} />
    </div>
  );
};

export default Calendar;

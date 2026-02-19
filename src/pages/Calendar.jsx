import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Loader2, Building2, Calendar as CalendarIcon, Globe, DollarSign, Info } from 'lucide-react';
import { SectionTitle } from '@/components/dashboard/SectionTitle';
import { SummaryCards } from '@/components/calendar/SummaryCards';
import { CalendarFilters } from '@/components/calendar/CalendarFilters';
import { useCalendarView } from '@/hooks/api/useCalendar';
import { useTerms } from '@/hooks/api/useTerms';
import { useCompanies } from '@/hooks/api/useCompanies';

const Calendar = () => {
  // Get current user from Redux
  const currentUser = useSelector((state) => state.auth.user);
  const isAdmin = Boolean(currentUser?.is_admin === '1' || currentUser?.is_admin === 1);
  
  const [selectedTermId, setSelectedTermId] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [shouldFetch, setShouldFetch] = useState(false);

  // Fetch terms and companies for dropdowns
  const { data: termsData } = useTerms({ page: 1, perPage: 100 }, { enabled: true });
  const { data: companiesData } = useCompanies({ page: 1, perPage: 100 }, { enabled: isAdmin });
  
  const terms = termsData?.terms || [];
  const companies = companiesData?.companies || [];

  // For non-admin users, automatically set company_id from user object
  useEffect(() => {
    if (!isAdmin && currentUser?.company_id) {
      setSelectedCompanyId(String(currentUser.company_id));
    }
  }, [isAdmin, currentUser]);

  // Auto-trigger request when "All companies" is selected and term is available
  useEffect(() => {
    if (isAdmin && selectedCompanyId === 'all' && selectedTermId) {
      setShouldFetch(true);
    }
  }, [selectedCompanyId, selectedTermId, isAdmin]);

  // Prepare API params - exclude company_id if "all" is selected
  const calendarParams = useMemo(() => {
    const params = { term_id: selectedTermId };
    // Only include company_id if it's not "all" and not empty
    if (selectedCompanyId && selectedCompanyId !== 'all') {
      params.company_id = selectedCompanyId;
    }
    return params;
  }, [selectedTermId, selectedCompanyId]);

  // Fetch calendar data only when term is selected and user clicked "Load" or "all" is selected
  const { data: calendarData, isLoading, isError, error } = useCalendarView(
    calendarParams,
    { enabled: shouldFetch && !!selectedTermId && (isAdmin ? (!!selectedCompanyId || selectedCompanyId === 'all') : true) }
  );

  const handleSubmit = () => {
    // For admins, both term and company (or "all") are required
    // For non-admins, only term is required (company is auto-set from user)
    if (selectedTermId && (isAdmin ? (selectedCompanyId || selectedCompanyId === 'all') : true)) {
      setShouldFetch(true);
    }
  };

  // Calculate summary stats from calendar data
  const summaryStats = useMemo(() => {
    if (!calendarData) return { totalCost: 0, totalIncentive: 0, totalActualCost: 0, totalSupportCost: 0 };

    let totalCost = 0;
    let totalIncentive = 0;
    let totalActualCost = 0;
    let totalSupportCost = 0;

    calendarData.plans?.forEach((plan) => {
      plan.activities?.forEach((activity) => {
        totalCost += parseFloat(activity.total_cost) || 0;
        totalIncentive += parseFloat(activity.incentive) || 0;
        
        // Sum monthly costs
        Object.values(activity.monthly || {}).forEach((monthData) => {
          totalActualCost += parseFloat(monthData.actual_cost) || 0;
          totalSupportCost += parseFloat(monthData.support_cost) || 0;
        });
      });
    });

    return { totalCost, totalIncentive, totalActualCost, totalSupportCost };
  }, [calendarData]);

  const formatCurrency = (amount, currency = 'AED') => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Show empty state when no data is loaded
  if (!shouldFetch || (!calendarData && !isLoading)) {
    return (
      <div className="space-y-5">
        <SectionTitle title="MARKETING CALENDAR VIEW" />
        
        <CalendarFilters
          selectedTermId={selectedTermId}
          setSelectedTermId={setSelectedTermId}
          selectedCompanyId={selectedCompanyId}
          setSelectedCompanyId={setSelectedCompanyId}
          terms={terms}
          companies={companies}
          isAdmin={isAdmin}
          onSubmit={handleSubmit}
        />

        {!shouldFetch && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-sm p-12 text-center">
            <Info className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Calendar Data Loaded
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isAdmin 
                ? 'Please select a term and company (or "All companies") above, then click "Load Calendar Data" to view the calendar information.'
                : 'Please select a term above, then click "Load Calendar Data" to view the calendar information.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-5">
        <SectionTitle title="MARKETING CALENDAR VIEW" />
        
        <CalendarFilters
          selectedTermId={selectedTermId}
          setSelectedTermId={setSelectedTermId}
          selectedCompanyId={selectedCompanyId}
          setSelectedCompanyId={setSelectedCompanyId}
          terms={terms}
          companies={companies}
          isAdmin={isAdmin}
          onSubmit={handleSubmit}
        />

        <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-sm p-12 text-center">
          <Loader2 className="w-12 h-12 text-[#E60012] dark:text-red-400 mx-auto mb-4 animate-spin" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading calendar data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="space-y-5">
        <SectionTitle title="MARKETING CALENDAR VIEW" />
        
        <CalendarFilters
          selectedTermId={selectedTermId}
          setSelectedTermId={setSelectedTermId}
          selectedCompanyId={selectedCompanyId}
          setSelectedCompanyId={setSelectedCompanyId}
          terms={terms}
          companies={companies}
          isAdmin={isAdmin}
          onSubmit={handleSubmit}
        />

        <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-red-200 dark:border-red-800 shadow-sm p-6">
          <p className="text-sm text-red-600 dark:text-red-400">
            Error loading calendar data: {error?.message || 'An error occurred'}
          </p>
        </div>
      </div>
    );
  }

  const { term, company, months = [], plans = [] } = calendarData || {};
  const currency = company?.currency || 'AED';

  return (
    <div className="space-y-5">
      <SectionTitle title="MARKETING CALENDAR VIEW" />

      {/* Filter Section */}
      <CalendarFilters
        selectedTermId={selectedTermId}
        setSelectedTermId={setSelectedTermId}
        selectedCompanyId={selectedCompanyId}
        setSelectedCompanyId={setSelectedCompanyId}
        terms={terms}
        companies={companies}
        isAdmin={isAdmin}
        onSubmit={handleSubmit}
      />

      {/* Summary Cards */}
      <SummaryCards
        totalActualCost={summaryStats.totalActualCost}
        totalSupportCost={summaryStats.totalSupportCost}
      />

      {/* Term and Company Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Term Info Card */}
        {term && (
          <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900 rounded-2xl border-2 border-blue-200 dark:border-blue-800 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Term Information</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b border-blue-100 dark:border-blue-900/40">
                <span className="text-sm text-gray-600 dark:text-gray-400">Name</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{term.name}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-blue-100 dark:border-blue-900/40">
                <span className="text-sm text-gray-600 dark:text-gray-400">Start Date</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatDate(term.start_date)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">End Date</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatDate(term.end_date)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Company Info Card - Only show when a specific company is selected, not "All companies" */}
        {company && selectedCompanyId !== 'all' && (
          <div className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-900 rounded-2xl border-2 border-green-200 dark:border-green-800 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              {company.logo ? (
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white dark:bg-gray-800 flex items-center justify-center border-2 border-green-200 dark:border-green-800">
                  <img 
                    src={`https://marketing.5v.ae/${company.logo}`}
                    alt={company.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center" style={{ display: 'none' }}>
                    <Building2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              )}
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Company Information</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b border-green-100 dark:border-green-900/40">
                <span className="text-sm text-gray-600 dark:text-gray-400">Name</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{company.name}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-green-100 dark:border-green-900/40">
                <span className="text-sm text-gray-600 dark:text-gray-400">Country</span>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{company.country_name}</span>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Currency</span>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{currency}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Calendar Table */}
      {plans.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 sticky left-0 bg-gray-50 dark:bg-gray-800 z-10 uppercase tracking-wide min-w-[180px]">
                    Plan
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 uppercase tracking-wide min-w-[200px]">
                    Activity
                  </th>
                  {months.map((month) => (
                    <th key={month.key} className="px-4 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 uppercase tracking-wide min-w-[140px]">
                      <div className="flex flex-col">
                        <span>{month.label}</span>
                      </div>
                    </th>
                  ))}
                  {/* Total Cost and Total Incentive columns commented out per request */}
                  {/**
                  <th className="px-5 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 uppercase tracking-wide min-w-[120px]">
                    Total Cost
                  </th>
                  <th className="px-5 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide min-w-[120px]">
                    Total Incentive
                  </th>
                  */}
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => {
                  const activities = plan.activities || [];
                  return activities.map((activity, activityIdx) => (
                    <tr
                      key={`${plan.plan_id}-${activity.activity_id}`}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-150"
                    >
                      {activityIdx === 0 && (
                        <td
                          rowSpan={activities.length}
                          className="px-5 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700 align-top sticky left-0 bg-white dark:bg-gray-900 z-5"
                        >
                          <div className="flex flex-col">
                            <span className="text-[#E60012] dark:text-red-400 font-bold">{plan.plan_name}</span>
                            {plan.description && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{plan.description}</span>
                            )}
                            <span className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block w-fit ${
                              plan.status === 1 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                            }`}>
                              {plan.status === 1 ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </td>
                      )}
                      <td className="px-5 py-4 text-sm font-medium text-[#D22827] dark:text-red-400 border-r border-gray-200 dark:border-gray-700">
                        {activity.activity_name}
                      </td>
                      
                      {months.map((month) => {
                        const monthData = activity.monthly?.[month.key] || {};
                        const actualCost = parseFloat(monthData.actual_cost) || 0;
                        const supportCost = parseFloat(monthData.support_cost) || 0;
                        const totalCost = parseFloat(monthData.total_cost) || 0;
                        const incentive = parseFloat(monthData.incentive) || 0;
                        const hasData = actualCost > 0 || supportCost > 0 || totalCost > 0 || incentive > 0;

                        return (
                          <td
                            key={month.key}
                            className={`px-4 py-4 border-r border-gray-200 dark:border-gray-700 ${
                              hasData ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50'
                            }`}
                          >
                            {hasData ? (
                              <div className="text-center space-y-1.5">
                                {actualCost > 0 && (
                                  <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded">
                                    Actual: {formatCurrency(actualCost, currency)}
                                  </div>
                                )}
                                {supportCost > 0 && (
                                  <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 px-2 py-1 bg-purple-50 dark:bg-purple-900/20 rounded">
                                    Support: {formatCurrency(supportCost, currency)}
                                  </div>
                                )}
                                {/* Total and Incentive values commented out per request
                                {totalCost > 0 && (
                                  <div className="text-xs font-bold text-[#D22827] dark:text-red-400 px-2 py-1 bg-red-50 dark:bg-red-900/20 rounded">
                                    Total: {formatCurrency(totalCost, currency)}
                                  </div>
                                )}
                                {incentive > 0 && (
                                  <div className="text-xs font-semibold text-[#10B981] dark:text-emerald-400 px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded">
                                    Incentive: {formatCurrency(incentive, currency)}
                                  </div>
                                )}
                                */}
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400 dark:text-gray-600">—</span>
                            )}
                          </td>
                        );
                      })}
                      
                      {/* Row totals commented out per request
                      <td className="px-5 py-4 text-center border-r border-gray-200 dark:border-gray-700">
                        <span className="text-sm font-bold text-[#3B82F6] dark:text-blue-400">
                          {formatCurrency(parseFloat(activity.total_cost) || 0, currency)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                          {formatCurrency(parseFloat(activity.incentive) || 0, currency)}
                        </span>
                      </td>
                      */}
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {plans.length === 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-sm p-12 text-center">
          <Info className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-sm text-gray-500 dark:text-gray-400">No plans found for the selected term and company.</p>
        </div>
      )}
    </div>
  );
};

export default Calendar;

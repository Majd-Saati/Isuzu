import React, { useState, useEffect } from 'react';
import { DealerEfficiencyChart } from '@/components/dashboard/DealerEfficiencyChart';
import { DealerEfficiencyChartSkeleton } from '@/components/dashboard/DealerEfficiencyChartSkeleton';
import { DealerEfficiencyChartEmpty } from '@/components/dashboard/DealerEfficiencyChartEmpty';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { PerformanceChartSkeleton } from '@/components/dashboard/PerformanceChartSkeleton';
import { PerformanceChartEmpty } from '@/components/dashboard/PerformanceChartEmpty';
import { ReportingTable } from '@/components/dashboard/ReportingTable';
import { ReportingTableSkeleton } from '@/components/dashboard/ReportingTableSkeleton';
import { ReportingTableEmpty } from '@/components/dashboard/ReportingTableEmpty';

const Charts = () => {
  const [efficiencyChartsState, setEfficiencyChartsState] = useState('loading'); // 'loading' | 'empty' | 'data'
  const [performanceChartState, setPerformanceChartState] = useState('loading'); // 'loading' | 'empty' | 'data'
  const [reportingState, setReportingState] = useState('loading'); // 'loading' | 'empty' | 'data'

  // Simulate data loading
  useEffect(() => {
    setTimeout(() => {
      setEfficiencyChartsState('data'); // Change to 'empty' to test empty state
      setPerformanceChartState('data'); // Change to 'empty' to test empty state
      setReportingState('data'); // Change to 'empty' to test empty state
    }, 1500);
  }, []);

  const renderEfficiencyCharts = () => {
    switch (efficiencyChartsState) {
      case 'loading':
        return (
          <>
            <DealerEfficiencyChartSkeleton />
            <DealerEfficiencyChartSkeleton />
          </>
        );
      case 'empty':
        return (
          <>
            <DealerEfficiencyChartEmpty title="Expense Dealer Vs Support Amount" />
            <DealerEfficiencyChartEmpty title="Budget Allocation Vs Support Amount" />
          </>
        );
      case 'data':
        return (
          <>
            <DealerEfficiencyChart data={expenseData} />
            <DealerEfficiencyChart data={budgetData} />
          </>
        );
      default:
        return (
          <>
            <DealerEfficiencyChart data={expenseData} />
            <DealerEfficiencyChart data={budgetData} />
          </>
        );
    }
  };

  const renderPerformanceChart = () => {
    switch (performanceChartState) {
      case 'loading':
        return <PerformanceChartSkeleton />;
      case 'empty':
        return <PerformanceChartEmpty />;
      case 'data':
        return <PerformanceChart />;
      default:
        return <PerformanceChart />;
    }
  };

  const renderReportingSection = () => {
    switch (reportingState) {
      case 'loading':
        return <ReportingTableSkeleton />;
      case 'empty':
        return <ReportingTableEmpty />;
      case 'data':
        return <ReportingTable />;
      default:
        return <ReportingTable />;
    }
  };

  const expenseData = {
    title: 'Expense Dealer Vs Support Amount',
    amount: 4200,
    percentage: 60,
    color: '#4A90E2',
    legendLabel: 'Expense'
  };

  const budgetData = {
    title: 'Budget Allocation Vs Support Amount',
    amount: 5950,
    percentage: 70,
    color: '#EF5A6F',
    legendLabel: 'Budget'
  };

  return (
    <>
      {/* Page Header */}
      <div className="pt-6 pb-8 mb-8 border-b-2 border-gray-100 dark:border-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 pb-4 border-b-4 border-[#E60012] inline-block">
          Charts
        </h1>
      </div>

      {/* First Section - Two Charts Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {renderEfficiencyCharts()}
      </div>

      {/* Second Section - Bar Chart */}
      <div className="mb-8">
        {renderPerformanceChart()}
      </div>

      {/* Third Section - Reporting Table */}
      <div className="mb-8">
        {renderReportingSection()}
      </div>
    </>
  );
};
  
  export default Charts;

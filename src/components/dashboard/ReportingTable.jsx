import React from 'react';
import { FileText, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { SectionTitle } from './SectionTitle';

export const ReportingTable = () => {
  const reportingData = [
    {
      month: 'Jun',
      activities: [
        { activity: 'Online Media Coverage', status: 'completed', expense: 500000 },
        { activity: 'Social Media Platforms', status: 'pending', expense: 200000 },
        { activity: 'Design new landing page', status: 'upcoming', expense: 400000 },
        { activity: 'Online Media Coverage', status: 'completed', expense: 300000 },
      ]
    },
    {
      month: 'Jul',
      activities: [
        { activity: 'Online Media Coverage', status: 'completed', expense: 500000 },
        { activity: 'Social Media Platforms', status: 'pending', expense: 200000 },
        { activity: 'Design new landing page', status: 'upcoming', expense: 400000 },
        { activity: 'Online Media Coverage', status: 'completed', expense: 400000 },
        { activity: 'Online Media Coverage', status: 'completed', expense: 300000 },
      ]
    },
    {
      month: 'Apr',
      activities: [
        { activity: 'Online Media Coverage', status: 'completed', expense: 500000 },
        { activity: 'Social Media Platforms', status: 'pending', expense: 200000 },
      ]
    },
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return {
          label: 'Completed',
          bgColor: 'bg-green-50',
          textColor: 'text-green-600',
          Icon: CheckCircle2
        };
      case 'pending':
        return {
          label: 'In Pending',
          bgColor: 'bg-red-50',
          textColor: 'text-red-600',
          Icon: AlertCircle
        };
      case 'upcoming':
        return {
          label: 'Up Coming',
          bgColor: 'bg-amber-50',
          textColor: 'text-amber-600',
          Icon: Clock
        };
      default:
        return {
          label: status,
          bgColor: 'bg-muted',
          textColor: 'text-muted-foreground',
          Icon: AlertCircle
        };
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-[24px] p-6 md:p-8 shadow-[0px_4px_16px_rgba(0,0,0,0.06)] border-2 border-gray-100 dark:border-gray-800 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <SectionTitle title="Reporting" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200 dark:border-gray-700">
              <th className="text-left py-4 px-4 text-[#4A5568] dark:text-gray-300 text-sm font-medium w-32">Month</th>
              <th className="text-left py-4 px-4 text-[#4A5568] dark:text-gray-300 text-sm font-medium">Activity</th>
              <th className="text-left py-4 px-4 text-[#4A5568] dark:text-gray-300 text-sm font-medium w-48">Status</th>
              <th className="text-left py-4 px-4 text-[#4A5568] dark:text-gray-300 text-sm font-medium w-40">Dealer Expense</th>
              <th className="text-center py-4 px-4 text-[#4A5568] dark:text-gray-300 text-sm font-medium w-24">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {reportingData.map((monthGroup, groupIndex) => (
              <React.Fragment key={groupIndex}>
                {monthGroup.activities.map((item, itemIndex) => (
                  <tr 
                    key={`${groupIndex}-${itemIndex}`}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                  >
                    {/* Month column - only show for first row of each month */}
                    <td className="py-4 px-4">
                      {itemIndex === 0 && (
                        <div className="text-[#1F2937] dark:text-gray-200 text-base font-semibold">
                          {monthGroup.month}
                        </div>
                      )}
                    </td>
                    
                    {/* Activity */}
                    <td className="py-4 px-4">
                      <div className="text-[#6B7280] dark:text-gray-300 text-sm">
                        {item.activity}
                      </div>
                    </td>
                    
                    {/* Status */}
                    <td className="py-4 px-4">
                      {(() => {
                        const config = getStatusConfig(item.status);
                        const StatusIcon = config.Icon;
                        return (
                          <div className="inline-flex items-center gap-2">
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${config.bgColor} dark:${config.bgColor.replace('bg-', 'dark:bg-').replace('-50', '-900/20')}`}>
                              <StatusIcon className={`w-4 h-4 ${config.textColor} dark:${config.textColor.replace('text-', 'dark:text-').replace('-600', '-400')}`} />
                              <span className={`text-xs font-medium ${config.textColor} dark:${config.textColor.replace('text-', 'dark:text-').replace('-600', '-400')}`}>
                                {config.label}
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                    </td>
                    
                    {/* Dealer Expense */}
                    <td className="py-4 px-4">
                      <div className="text-[#1F2937] dark:text-gray-200 text-sm font-normal">
                        {item.expense.toLocaleString('en-US', { minimumFractionDigits: 3 })}
                      </div>
                    </td>
                    
                    {/* Invoice */}
                    <td className="py-4 px-4">
                      <div className="flex justify-center">
                        <button className="text-[#3B82F6] dark:text-blue-400 hover:text-[#2563EB] dark:hover:text-blue-300 transition-colors duration-200">
                          <FileText className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

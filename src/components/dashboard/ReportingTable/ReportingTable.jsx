import React from 'react';
import { FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import { SectionTitle } from '../SectionTitle';
import { ReportingTableSkeleton } from '../ReportingTableSkeleton';
import { ReportingTableEmpty } from '../ReportingTableEmpty';
import { exportReportToExcel } from '@/components/charts/chartExportUtils';
import { useReportingTable } from './hooks/useReportingTable';
import { TermFilter } from './components/TermFilter';
import { TableSummary } from './components/TableSummary';
import { TableHeader } from './components/TableHeader';
import { TableRow } from './components/TableRow';
import { EvidenceModal } from './components/EvidenceModal';
import { ErrorState } from './components/ErrorState';

export const ReportingTable = () => {
  const {
    selectedTermId,
    setSelectedTermId,
    evidenceModal,
    terms,
    reportData,
    isLoading,
    isError,
    error,
    hasData,
    handleOpenEvidences,
    handleCloseEvidences,
  } = useReportingTable();

  const handleExportExcel = () => {
    if (!reportData) return;
    const termName = terms.find((t) => String(t.id) === String(selectedTermId))?.name || selectedTermId;
    const filename = `report-${termName || 'term'}-${new Date().toISOString().slice(0, 10)}`.replace(/\s+/g, '-');
    const success = exportReportToExcel(reportData, filename);
    if (success) {
      toast.success('Report exported to Excel');
    } else {
      toast.error('Failed to export report');
    }
  };

  if (isLoading) {
    return <ReportingTableSkeleton />;
  }

  if (isError) {
    return <ErrorState error={error} />;
  }

  if (!hasData) {
    return <ReportingTableEmpty />;
  }

  const { term, summary, months } = reportData;

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-[24px] p-6 md:p-8 shadow-[0px_4px_16px_rgba(0,0,0,0.06)] border-2 border-gray-100 dark:border-gray-800 animate-fade-in">
        {/* Header with filter and summary */}
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <SectionTitle title="Reporting" />
            
            {/* Term Filter + Export */}
            <div className="flex items-center gap-3 flex-wrap">
              <TermFilter
                selectedTermId={selectedTermId}
                terms={terms}
                onChange={setSelectedTermId}
              />
              <button
                type="button"
                onClick={handleExportExcel}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white bg-[#217346] hover:bg-[#185C37] transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Export Excel
              </button>
            </div>
          </div>

          {/* Term info and Summary */}
          <TableSummary term={term} summary={summary} />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <TableHeader />
            <tbody>
              {months.map((monthGroup) => (
                <React.Fragment key={monthGroup.period}>
                  {monthGroup.rows.map((row, itemIndex) => (
                    <TableRow
                      key={`${row.activity_id}-${itemIndex}`}
                      row={row}
                      monthLabel={monthGroup.label}
                      isFirstInMonth={itemIndex === 0}
                      onOpenEvidences={handleOpenEvidences}
                    />
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Evidence Modal */}
      {evidenceModal.open && (
        <EvidenceModal
          evidences={evidenceModal.evidences}
          activityName={evidenceModal.activityName}
          activityId={evidenceModal.activityId}
          onClose={handleCloseEvidences}
        />
      )}
    </>
  );
};




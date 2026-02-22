import { useState, useEffect } from 'react';
import { useReport } from '@/hooks/api/useCharts';
import { useTerms } from '@/hooks/api/useTerms';

export const useReportingTable = () => {
  const [selectedTermId, setSelectedTermId] = useState('');
  const [evidenceModal, setEvidenceModal] = useState({ 
    open: false, 
    evidences: [], 
    activityName: '',
    activityId: null 
  });

  // Fetch terms for the dropdown
  const { data: termsData } = useTerms({ perPage: 100 });
  const terms = termsData?.terms ?? [];

  // Set default term when terms are loaded
  useEffect(() => {
    if (terms.length > 0 && !selectedTermId) {
      setSelectedTermId(terms[0].id);
    }
  }, [terms, selectedTermId]);

  // Fetch report data
  const { data: reportData, isLoading, isError, error } = useReport(
    { term_id: selectedTermId },
    { enabled: !!selectedTermId }
  );

  const hasData = reportData?.months && reportData.months.length > 0;

  const handleOpenEvidences = (evidences, activityName, activityId) => {
    setEvidenceModal({ open: true, evidences, activityName, activityId });
  };

  const handleCloseEvidences = () => {
    setEvidenceModal({ open: false, evidences: [], activityName: '', activityId: null });
  };

  return {
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
  };
};



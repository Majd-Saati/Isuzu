import { useState, useCallback, useEffect } from 'react';

export const useActivityDrawerModals = ({ isOpen, activity, updateBudgetStatusMutation, deleteActivityMutation, deleteBudgetMutation, deleteMetaMutation, onClose }) => {
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteBudgetModal, setShowDeleteBudgetModal] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);
  const [showDeleteMetaModal, setShowDeleteMetaModal] = useState(false);
  const [metaToDelete, setMetaToDelete] = useState(null);

  const handleAcceptBudget = useCallback((budget) => {
    setSelectedBudget(budget);
    setShowAcceptModal(true);
  }, []);

  const handleConfirmAccept = useCallback(() => {
    if (!selectedBudget) return;

    updateBudgetStatusMutation.mutate(
      {
        budgetId: selectedBudget.id,
        status: 'accepted',
      },
      {
        onSuccess: () => {
          setShowAcceptModal(false);
          setSelectedBudget(null);
        },
      }
    );
  }, [selectedBudget, updateBudgetStatusMutation]);

  const handleDeleteActivity = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const handleConfirmDeleteActivity = useCallback(() => {
    if (!activity?.id) return;

    deleteActivityMutation.mutate(activity.id, {
      onSuccess: () => {
        setShowDeleteModal(false);
        onClose();
      },
    });
  }, [activity?.id, deleteActivityMutation, onClose]);

  const handleCloseDeleteModal = useCallback(() => {
    if (!deleteActivityMutation.isPending) {
      setShowDeleteModal(false);
    }
  }, [deleteActivityMutation.isPending]);

  const handleDeleteBudget = useCallback((budget) => {
    setBudgetToDelete(budget);
    setShowDeleteBudgetModal(true);
  }, []);

  const handleConfirmDeleteBudget = useCallback(() => {
    if (!budgetToDelete?.id) return;

    deleteBudgetMutation.mutate(budgetToDelete.id, {
      onSuccess: () => {
        setShowDeleteBudgetModal(false);
        setBudgetToDelete(null);
      },
    });
  }, [budgetToDelete, deleteBudgetMutation]);

  const handleCloseDeleteBudgetModal = useCallback(() => {
    if (!deleteBudgetMutation.isPending) {
      setShowDeleteBudgetModal(false);
      setBudgetToDelete(null);
    }
  }, [deleteBudgetMutation.isPending]);

  const handleDeleteMeta = useCallback((meta) => {
    setMetaToDelete(meta);
    setShowDeleteMetaModal(true);
  }, []);

  const handleConfirmDeleteMeta = useCallback(() => {
    if (!metaToDelete?.id) return;

    deleteMetaMutation.mutate(metaToDelete.id, {
      onSuccess: () => {
        setShowDeleteMetaModal(false);
        setMetaToDelete(null);
      },
    });
  }, [metaToDelete, deleteMetaMutation]);

  const handleCloseDeleteMetaModal = useCallback(() => {
    if (!deleteMetaMutation.isPending) {
      setShowDeleteMetaModal(false);
      setMetaToDelete(null);
    }
  }, [deleteMetaMutation.isPending]);

  // Reset modals when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setShowAcceptModal(false);
      setSelectedBudget(null);
      setShowDeleteModal(false);
      setShowDeleteBudgetModal(false);
      setBudgetToDelete(null);
      setShowDeleteMetaModal(false);
      setMetaToDelete(null);
    }
  }, [isOpen]);

  const handleCloseAcceptModal = useCallback(() => {
    if (!updateBudgetStatusMutation.isPending) {
      setShowAcceptModal(false);
      setSelectedBudget(null);
    }
  }, [updateBudgetStatusMutation.isPending]);

  return {
    // Accept Budget Modal
    showAcceptModal,
    selectedBudget,
    handleAcceptBudget,
    handleConfirmAccept,
    handleCloseAcceptModal,
    
    // Delete Activity Modal
    showDeleteModal,
    handleDeleteActivity,
    handleConfirmDeleteActivity,
    handleCloseDeleteModal,
    
    // Delete Budget Modal
    showDeleteBudgetModal,
    budgetToDelete,
    handleDeleteBudget,
    handleConfirmDeleteBudget,
    handleCloseDeleteBudgetModal,
    
    // Delete Meta Modal
    showDeleteMetaModal,
    metaToDelete,
    handleDeleteMeta,
    handleConfirmDeleteMeta,
    handleCloseDeleteMetaModal,
  };
};

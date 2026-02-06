import { useState } from 'react';
import { SelectProject } from './useSelectWishlist';

export const useSelectComparator = () => {
  const [comparison, setComparison] = useState<SelectProject[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToComparison = (project: SelectProject) => {
    if (comparison.length < 3 && !comparison.some(p => p.id === project.id)) {
      setComparison([...comparison, project]);
    }
  };

  const removeFromComparison = (projectId: string) => {
    setComparison(comparison.filter(p => p.id !== projectId));
  };

  const isInComparison = (projectId: string) => {
    return comparison.some(p => p.id === projectId);
  };

  const toggleComparison = (project: SelectProject) => {
    if (isInComparison(project.id)) {
      removeFromComparison(project.id);
    } else if (comparison.length < 3) {
      addToComparison(project);
    }
  };

  const openComparator = () => {
    if (comparison.length >= 2) {
      setIsOpen(true);
    }
  };

  const closeComparator = () => {
    setIsOpen(false);
  };

  const clearComparison = () => {
    setComparison([]);
    setIsOpen(false);
  };

  return {
    comparison,
    isOpen,
    addToComparison,
    removeFromComparison,
    isInComparison,
    toggleComparison,
    openComparator,
    closeComparator,
    clearComparison
  };
};
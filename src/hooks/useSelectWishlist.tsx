import { useState, useEffect } from 'react';

export interface SelectProject {
  id: string;
  name: string;
  status: string;
  description: string;
  specs: {
    area: string;
    suites: string;
    parking: string;
  };
  image: string;
}

export const useSelectWishlist = () => {
  const [wishlist, setWishlist] = useState<SelectProject[]>([]);

  useEffect(() => {
    const savedWishlist = localStorage.getItem('select-wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  const addToWishlist = (project: SelectProject) => {
    const updatedWishlist = [...wishlist, project];
    setWishlist(updatedWishlist);
    localStorage.setItem('select-wishlist', JSON.stringify(updatedWishlist));
  };

  const removeFromWishlist = (projectId: string) => {
    const updatedWishlist = wishlist.filter(p => p.id !== projectId);
    setWishlist(updatedWishlist);
    localStorage.setItem('select-wishlist', JSON.stringify(updatedWishlist));
  };

  const isInWishlist = (projectId: string) => {
    return wishlist.some(p => p.id === projectId);
  };

  const toggleWishlist = (project: SelectProject) => {
    if (isInWishlist(project.id)) {
      removeFromWishlist(project.id);
    } else {
      addToWishlist(project);
    }
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist
  };
};
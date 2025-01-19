// src/hooks/use-pagination.js

import { useState, useEffect, useMemo } from 'react';

export function usePagination({ 
  totalItems = 0, 
  itemsPerPage = 10,
  initialPage = 1 
}) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Calculate total pages
  const totalPages = useMemo(() => 
    Math.max(1, Math.ceil(totalItems / itemsPerPage)), 
    [totalItems, itemsPerPage]
  );

  // Reset to first page when total items or items per page changes
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalItems, itemsPerPage, totalPages, currentPage]);

  // Handle page change with validation
  const handlePageChange = (page) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate pagination results
  const paginationResult = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    return {
      currentPage,
      totalPages,
      startIndex,
      endIndex,
      pageSize: itemsPerPage,
      // Helper function to slice an array
      slicePage: (items) => items.slice(startIndex, endIndex)
    };
  }, [currentPage, totalPages, itemsPerPage, totalItems]);

  return {
    ...paginationResult,
    handlePageChange,
    setPage: setCurrentPage
  };
}
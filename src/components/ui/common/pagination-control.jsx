import React, { useEffect } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export function PaginationControl({ 
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  itemsPerPage = 10,
  totalItems = 0,
  className = ""
}) {
  // Scroll to top on page change with smooth animation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Ensure all numeric values are valid
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));
  const validTotalPages = Math.max(1, totalPages);

  // Generate page numbers to display
  const getPageNumbers = () => {
    if (validTotalPages <= 7) {
      return Array.from({ length: validTotalPages }, (_, i) => i + 1);
    }

    if (validCurrentPage <= 3) {
      return [1, 2, 3, 4, 'ellipsis', validTotalPages];
    }

    if (validCurrentPage >= validTotalPages - 2) {
      return [1, 'ellipsis', validTotalPages - 3, validTotalPages - 2, validTotalPages - 1, validTotalPages];
    }

    return [
      1,
      'ellipsis',
      validCurrentPage - 1,
      validCurrentPage,
      validCurrentPage + 1,
      'ellipsis',
      validTotalPages
    ];
  };

  if (totalItems === 0 || validTotalPages <= 1) {
    return null;
  }

  const startItem = (validCurrentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(validCurrentPage * itemsPerPage, totalItems);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="w-full flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (validCurrentPage > 1) {
                    onPageChange(validCurrentPage - 1);
                  }
                }}
                aria-disabled={validCurrentPage === 1}
                className={validCurrentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>

            {getPageNumbers().map((page, idx) => (
              <PaginationItem key={idx}>
                {page === 'ellipsis' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(page);
                    }}
                    isActive={page === validCurrentPage}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (validCurrentPage < validTotalPages) {
                    onPageChange(validCurrentPage + 1);
                  }
                }}
                aria-disabled={validCurrentPage === validTotalPages}
                className={validCurrentPage === validTotalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        Showing {startItem} to {endItem} of {totalItems} items
      </div>
    </div>
  );
}
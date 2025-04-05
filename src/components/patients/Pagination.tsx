import React from 'react';
import { Icons } from '../ui/Icons';
import { Button } from '../ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are few
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(0);
      
      // Calculate middle pages
      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(totalPages - 2, currentPage + 1);
      
      // Adjust if we're near the start
      if (currentPage < 2) {
        endPage = 3;
      }
      
      // Adjust if we're near the end
      if (currentPage > totalPages - 3) {
        startPage = totalPages - 4;
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 1) {
        pages.push(-1); // -1 represents ellipsis
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 2) {
        pages.push(-2); // -2 represents ellipsis
      }
      
      // Always include last page
      pages.push(totalPages - 1);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();
  
  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center py-4 px-6 bg-white border-t border-gray-200">
      <div className="text-sm text-gray-500 mb-4 sm:mb-0">
        Showing <span className="font-medium">{startItem}</span> to{' '}
        <span className="font-medium">{endItem}</span> of{' '}
        <span className="font-medium">{totalItems}</span> patients
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="mr-4">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-2 py-1 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(0)}
          disabled={currentPage === 0}
          className="hidden sm:flex"
        >
          <Icons.ChevronsLeft className="w-4 h-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          <Icons.ChevronLeft className="w-4 h-4" />
        </Button>
        
        <div className="flex space-x-1">
          {pageNumbers.map((pageNum, index) => {
            if (pageNum < 0) {
              // Render ellipsis
              return (
                <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-400">
                  ...
                </span>
              );
            }
            
            return (
              <Button
                key={pageNum}
                variant={pageNum === currentPage ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className={pageNum === currentPage ? 'bg-primary text-white' : ''}
              >
                {pageNum + 1}
              </Button>
            );
          })}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
        >
          <Icons.ChevronRight className="w-4 h-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages - 1)}
          disabled={currentPage >= totalPages - 1}
          className="hidden sm:flex"
        >
          <Icons.ChevronsRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationButton,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5; 

    const addPageButton = (pageNum: number) => {
      items.push(
        <PaginationItem key={pageNum}>
          <PaginationButton
            onClick={() => onPageChange(pageNum)}
            isActive={pageNum === currentPage}
          >
            {pageNum}
          </PaginationButton>
        </PaginationItem>,
      );
    };

    addPageButton(1);

    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    
    if (currentPage < 3) {
      endPage = Math.min(totalPages - 1, maxVisiblePages - 1);
    }

    
    if (currentPage > totalPages - 3) {
      startPage = Math.max(2, totalPages - maxVisiblePages + 2);
    }

    
    for (let i = startPage; i <= endPage; i++) {
      addPageButton(i);
    }

    
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    
    if (totalPages > 1) {
      addPageButton(totalPages);
    }

    return items;
  };

  return (
    <Pagination className={className}>
      <PaginationContent>
        {/* Previous button */}
        <PaginationItem>
          <PaginationButton
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            size="icon"
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon />
          </PaginationButton>
        </PaginationItem>

        {/* Page numbers and ellipses */}
        {generatePaginationItems()}

        {/* Next button */}
        <PaginationItem>
          <PaginationButton
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            size="icon"
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon />
          </PaginationButton>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;

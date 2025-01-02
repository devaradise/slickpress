import type { Pagination } from "./types";

export const calculateReadingTime = (content: string) => {
  const wpm = 225;
  const words = content.trim().split(/\s+/).length;
  const time = Math.ceil(words / wpm);
  return time
}

export const generatePagination = (
  totalItems: number,
  currentPage: number,
  itemsPerPage: number
): Pagination => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  // Generate a range of page numbers to display
  const maxVisiblePages = 5;
  const pageNumbers: number[] = [];
  const halfRange = Math.floor(maxVisiblePages / 2);

  if (totalPages <= maxVisiblePages) {
    // Show all pages if total pages are less than max visible
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
  } else {
    // Handle large number of pages
    let startPage = Math.max(1, currentPage - halfRange);
    let endPage = Math.min(totalPages, currentPage + halfRange);

    if (currentPage <= halfRange) {
      // Shift range to the start when on initial pages
      endPage = maxVisiblePages;
    } else if (currentPage + halfRange >= totalPages) {
      // Shift range to the end when on final pages
      startPage = totalPages - maxVisiblePages + 1;
    }

    for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
  }

  return {
    currentPage,
    totalPages,
    hasNext,
    hasPrevious,
    nextPage: hasNext ? currentPage + 1 : null,
    previousPage: hasPrevious ? currentPage - 1 : null,
    pageNumbers,
    showFirst: pageNumbers[0] !== 1, // Link to the first page if not shown
    showLast: pageNumbers[pageNumbers.length - 1] !== totalPages, // Link to the last page if not shown
  };
}

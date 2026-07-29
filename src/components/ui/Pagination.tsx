import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25, 50],
}) => {
  const { t } = useLanguage();

  if (totalPages <= 0) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        start = 2;
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
        end = totalPages - 1;
      }

      if (start > 2) {
        pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const startItem = totalItems !== undefined && pageSize ? Math.min((currentPage - 1) * pageSize + 1, totalItems) : null;
  const endItem = totalItems !== undefined && pageSize ? Math.min(currentPage * pageSize, totalItems) : null;

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        {totalItems !== undefined && startItem !== null && endItem !== null && totalItems > 0 ? (
          <span className="pagination-count">
            {t('showingCount', { start: startItem, end: endItem, total: totalItems })}
          </span>
        ) : null}

        {pageSize && onPageSizeChange && (
          <div className="page-size-selector">
            <label htmlFor="pageSizeSelect">{t('showPerPage')}</label>
            <select
              id="pageSizeSelect"
              className="page-size-select"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="pagination-controls">
        <button
          type="button"
          className="pagination-btn nav-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label={t('prevPage')}
        >
          <ChevronLeft size={16} />
        </button>

        {getPageNumbers().map((page, idx) => (
          <React.Fragment key={idx}>
            {typeof page === 'number' ? (
              <button
                type="button"
                className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            ) : (
              <span className="pagination-ellipsis">{page}</span>
            )}
          </React.Fragment>
        ))}

        <button
          type="button"
          className="pagination-btn nav-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label={t('nextPage')}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};


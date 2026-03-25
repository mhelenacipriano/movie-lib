'use client';

import styles from './Pagination.module.scss';

function getPageNumbers(current, total) {
  const pages = [];
  const maxVisible = 7;

  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }

  pages.push(1);

  if (current > 3) pages.push('...');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push('...');

  pages.push(total);
  return pages;
}

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const maxPages = Math.min(totalPages, 500); // TMDB limits to 500
  const pages = getPageNumbers(currentPage, maxPages);

  if (maxPages <= 1) return null;

  return (
    <div className={styles.pagination}>
      <button
        className={styles.pageBtn}
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ‹
      </button>

      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`ellipsis-${i}`} className={styles.ellipsis}>…</span>
        ) : (
          <button
            key={page}
            className={`${styles.pageBtn} ${page === currentPage ? styles.active : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        )
      )}

      <button
        className={styles.pageBtn}
        disabled={currentPage >= maxPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        ›
      </button>
    </div>
  );
}

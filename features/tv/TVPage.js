'use client';

import { useState, useEffect, useRef } from 'react';
import { getPopularTV, searchTV } from '@/lib/api/tmdb';
import { MediaGrid, LoadingState } from '@/components/ui/MediaGrid';
import Pagination from '@/components/ui/Pagination';
import styles from '../movies/MoviesPage.module.scss';

export default function TVPage() {
  const [shows, setShows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const debounceRef = useRef(null);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      try {
        const data = activeQuery
          ? await searchTV(activeQuery, page)
          : await getPopularTV(page);
        setShows(data.results);
        setTotalPages(data.total_pages);
      } catch {
        setShows([]);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [activeQuery, page]);

  const handleQueryChange = (value) => {
    setQuery(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      setActiveQuery(value.trim());
    }, 400);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>TV Shows</h1>
          <p className={styles.subtitle}>
            {activeQuery ? `Search results for "${activeQuery}"` : 'Popular TV Shows'}
          </p>
        </div>

        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search TV shows"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <LoadingState />
      ) : (
        <>
          <MediaGrid items={shows} mediaType="tv" />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

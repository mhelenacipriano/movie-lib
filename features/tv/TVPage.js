'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getPopularTV, searchTV } from '@/lib/api/tmdb';
import { MediaGrid, LoadingState } from '@/components/ui/MediaGrid';
import Pagination from '@/components/ui/Pagination';
import styles from '../movies/MoviesPage.module.scss';

export default function TVPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get('search') || '';

  const [shows, setShows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const fetchShows = useCallback(async (query, pageNum) => {
    setLoading(true);
    try {
      const data = query
        ? await searchTV(query, pageNum)
        : await getPopularTV(pageNum);
      setShows(data.results);
      setTotalPages(data.total_pages);
    } catch (err) {
      console.error('Failed to fetch TV shows:', err);
      setShows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLocalQuery(searchQuery);
    setPage(1);
    fetchShows(searchQuery, 1);
  }, [searchQuery, fetchShows]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchShows(searchQuery, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = localQuery.trim();
    if (trimmed) {
      router.push(`/tv?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push('/tv');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>TV Shows</h1>
          <p className={styles.subtitle}>
            {searchQuery ? `Search results for "${searchQuery}"` : 'Popular TV Shows'}
          </p>
        </div>

        <form onSubmit={handleSearch} className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search TV shows"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
          />
        </form>
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

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getPopularMovies, searchMovies } from '@/lib/api/tmdb';
import { MediaGrid, LoadingState } from '@/components/ui/MediaGrid';
import Pagination from '@/components/ui/Pagination';
import styles from './MoviesPage.module.scss';

export default function MoviesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get('search') || '';

  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const fetchMovies = useCallback(async (query, pageNum) => {
    setLoading(true);
    try {
      const data = query
        ? await searchMovies(query, pageNum)
        : await getPopularMovies(pageNum);
      setMovies(data.results);
      setTotalPages(data.total_pages);
    } catch (err) {
      console.error('Failed to fetch movies:', err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLocalQuery(searchQuery);
    setPage(1);
    fetchMovies(searchQuery, 1);
  }, [searchQuery, fetchMovies]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchMovies(searchQuery, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = localQuery.trim();
    if (trimmed) {
      router.push(`/movies?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push('/movies');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Movies</h1>
          <p className={styles.subtitle}>
            {searchQuery ? `Search results for "${searchQuery}"` : 'Popular Movies'}
          </p>
        </div>

        <form onSubmit={handleSearch} className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search movies"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
          />
        </form>
      </div>

      {loading ? (
        <LoadingState />
      ) : (
        <>
          <MediaGrid items={movies} mediaType="movie" />
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

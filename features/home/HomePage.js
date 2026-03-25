'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTrendingMovies, getTrendingTV } from '@/lib/api/tmdb';
import { useFavoritesStore } from '@/store/favorites';
import { MediaRow, LoadingState } from '@/components/ui/MediaGrid';
import Button from '@/components/ui/Button';
import styles from './HomePage.module.scss';

export default function HomePage() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTV, setTrendingTV] = useState([]);
  const [loading, setLoading] = useState(true);
  const favorites = useFavoritesStore((s) => s.favorites);

  useEffect(() => {
    async function load() {
      try {
        const [movies, tv] = await Promise.all([
          getTrendingMovies(),
          getTrendingTV(),
        ]);
        setTrendingMovies(movies.results);
        setTrendingTV(tv.results);
      } catch (err) {
        console.error('Failed to load trending:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <LoadingState />;

  const movieFavs = favorites.filter((f) => f.media_type === 'movie');

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1>Welcome</h1>
        <p>Discover and track your favorite movies and TV shows.</p>
      </div>

      <MediaRow title="Trending Movies" items={trendingMovies} mediaType="movie" />

      <div className={styles.discoverCard}>
        <h3>Discover New Movies &amp; Shows</h3>
        <p>List your favorite movies here and discover new recommendations.</p>

        {movieFavs.length > 0 ? (
          <ul className={styles.favoritesList}>
            {movieFavs.map((f) => (
              <li key={f.id}>{f.title || f.name}</li>
            ))}
          </ul>
        ) : (
          <p className={styles.emptyFavs}>
            Add movies to your favorites to get personalized recommendations.
          </p>
        )}

        <Link href="/recommendations">
          <Button>Generate Recommendations</Button>
        </Link>
      </div>

      <MediaRow title="Trending TV Shows" items={trendingTV} mediaType="tv" />
    </div>
  );
}

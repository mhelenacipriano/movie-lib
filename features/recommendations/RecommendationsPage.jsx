'use client';

import { useState } from 'react';
import { useFavoritesStore } from '@/store/favorites';
import { generateRecommendations } from '@/lib/ai/recommender';
import Button from '@/components/ui/Button';
import { MediaGrid, LoadingState } from '@/components/ui/MediaGrid';
import styles from './RecommendationsPage.module.scss';

export default function RecommendationsPage() {
  const favorites = useFavoritesStore((s) => s.favorites);
  const movieFavs = favorites.filter((f) => f.media_type === 'movie');

  const [recommendations, setRecommendations] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (movieFavs.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const data = await generateRecommendations(movieFavs);
      setRecommendations(data.recommendations);
      setResults(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Discover New Movies &amp; Shows</h1>
      <p className={styles.subtitle}>
        Get smart recommendations based on your favorite genres, actors, and directors.
      </p>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Smart Recommendations</h3>
        <p className={styles.cardDesc}>
          We analyze your favorites to find movies you&apos;ll love.
        </p>

        {movieFavs.length > 0 ? (
          <>
            <ul className={styles.favList}>
              {movieFavs.map((f) => (
                <li key={f.id}>{f.title || f.name}</li>
              ))}
            </ul>
            <Button onClick={handleGenerate} disabled={loading}>
              {loading ? 'Generating...' : 'Generate Recommendations'}
            </Button>
            <p className={styles.hint}>
              Analyzes genres and ratings from your favorites to find similar titles.
            </p>
          </>
        ) : (
          <div className={styles.empty}>
            Add some movies to your favorites first to get personalized recommendations.
          </div>
        )}
      </div>

      {loading && <LoadingState />}
      {error && <p style={{ color: '#ef4444', marginTop: 16 }}>{error}</p>}

      {!loading && recommendations.length > 0 && (
        <div className={styles.resultsSection}>
          <div className={styles.resultsList}>
            {recommendations.map((rec) => (
              <div key={rec.title} className={styles.resultCard}>
                <div className={styles.resultTitle}>{rec.title}</div>
                <div className={styles.resultReason}>{rec.reason}</div>
              </div>
            ))}
          </div>

          {results.length > 0 && (
            <div className={styles.recRow}>
              <h2>Recommended for You</h2>
              <MediaGrid items={results} mediaType="movie" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

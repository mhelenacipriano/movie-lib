'use client';

import { useState, useEffect } from 'react';
import { getMovieDetails, getTVDetails, posterUrl } from '@/lib/api/tmdb';
import { useFavoritesStore } from '@/store/favorites';
import Button from './Button';
import styles from './DetailPanel.module.scss';

const IMG_BASE = 'https://image.tmdb.org/t/p';
const backdropUrl = (path) => (path ? `${IMG_BASE}/w780${path}` : null);

export default function DetailPanel({ item, mediaType, onClose }) {
  const [details, setDetails] = useState(null);
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();

  const type = mediaType || item.media_type || 'movie';
  const favorited = isFavorite(item.id, type);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const data =
          type === 'tv'
            ? await getTVDetails(item.id)
            : await getMovieDetails(item.id);
        setDetails(data);
      } catch {
        setDetails(null);
      }
    }
    fetchDetails();
  }, [item.id, type]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const title = item.title || item.name;
  const year = (item.release_date || item.first_air_date || '').slice(0, 4);
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null;
  const overview = details?.overview || item.overview || '';
  const backdrop = backdropUrl(details?.backdrop_path || item.backdrop_path);
  const genres = details?.genres || [];
  const runtime = details?.runtime;
  const seasons = details?.number_of_seasons;

  const handleFavorite = () => {
    if (favorited) {
      removeFavorite(item.id, type);
    } else {
      addFavorite({
        id: item.id,
        title: item.title,
        name: item.name,
        poster_path: item.poster_path,
        release_date: item.release_date,
        first_air_date: item.first_air_date,
        vote_average: item.vote_average,
        genre_ids: item.genre_ids,
        media_type: type,
      });
    }
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <aside className={styles.panel}>
        <div className={styles.backdrop}>
          {backdrop ? (
            <img src={backdrop} alt={title} />
          ) : (
            <div className={styles.backdropPlaceholder}>🎬</div>
          )}
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>

          <div className={styles.meta}>
            {year && <span>{year}</span>}
            {rating && <span className={styles.rating}>★ {rating}</span>}
            {runtime && <span className={styles.badge}>{runtime} min</span>}
            {seasons && (
              <span className={styles.badge}>
                {seasons} season{seasons > 1 ? 's' : ''}
              </span>
            )}
            <span className={styles.badge}>{type === 'tv' ? 'TV Show' : 'Movie'}</span>
          </div>

          {genres.length > 0 && (
            <div className={styles.genres}>
              {genres.map((g) => (
                <span key={g.id} className={styles.genre}>
                  {g.name}
                </span>
              ))}
            </div>
          )}

          {overview && <p className={styles.overview}>{overview}</p>}

          <div className={styles.actions}>
            <Button onClick={handleFavorite}>
              {favorited ? '❤️ Unfavorite' : '🤍 Add to Favorites'}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}

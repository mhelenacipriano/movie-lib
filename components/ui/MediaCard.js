'use client';

import { posterUrl } from '@/lib/api/tmdb';
import { useFavoritesStore } from '@/store/favorites';
import styles from './MediaCard.module.scss';

export default function MediaCard({ item, mediaType }) {
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const type = mediaType || item.media_type || 'movie';
  const favorited = isFavorite(item.id, type);

  const title = item.title || item.name;
  const year = (item.release_date || item.first_air_date || '').slice(0, 4);
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null;
  const poster = posterUrl(item.poster_path);

  const handleFavorite = (e) => {
    e.stopPropagation();
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
    <div className={styles.card}>
      <div className={styles.poster}>
        {poster ? (
          <img src={poster} alt={title} loading="lazy" />
        ) : (
          <div className={styles.placeholder}>🎬</div>
        )}
        <div className={styles.overlay} />
        <button
          className={`${styles.favoriteBtn} ${favorited ? styles.active : ''}`}
          onClick={handleFavorite}
          title={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          {favorited ? '❤️' : '🤍'}
        </button>
      </div>
      <div className={styles.info}>
        <div className={styles.title}>{title}</div>
        <div className={styles.meta}>
          {year && <span>{year}</span>}
          {year && rating && <span>·</span>}
          {rating && <span className={styles.rating}>★ {rating}</span>}
        </div>
      </div>
    </div>
  );
}

export function HorizontalMediaCard({ item, onRemove }) {
  const type = item.media_type || 'movie';
  const title = item.title || item.name;
  const year = (item.release_date || item.first_air_date || '').slice(0, 4);
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null;
  const poster = posterUrl(item.poster_path, 'w154');

  return (
    <div className={styles.horizontalCard}>
      <div className={styles.horizontalPoster}>
        {poster ? (
          <img src={poster} alt={title} loading="lazy" />
        ) : (
          <div className={styles.placeholder}>🎬</div>
        )}
      </div>
      <div className={styles.horizontalInfo}>
        <div className={styles.horizontalTitle}>{title}</div>
        <div className={styles.horizontalMeta}>
          {year && <span>{year}</span>}
          {year && rating && <span>·</span>}
          {rating && <span>★ {rating}</span>}
        </div>
      </div>
      <div className={styles.horizontalActions}>
        {onRemove && (
          <button
            className={`${styles.favoriteBtn} ${styles.active}`}
            onClick={() => onRemove(item.id, type)}
            title="Remove from favorites"
          >
            ❤️
          </button>
        )}
      </div>
    </div>
  );
}

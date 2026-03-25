'use client';

import { useState } from 'react';
import { useFavoritesStore } from '@/store/favorites';
import { HorizontalMediaCard } from '@/components/ui/MediaCard';
import Pagination from '@/components/ui/Pagination';
import styles from './FavoritesPage.module.scss';

const ITEMS_PER_PAGE = 10;

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState('movie');
  const [page, setPage] = useState(1);
  const { favorites, removeFavorite } = useFavoritesStore();

  const filtered = favorites.filter((f) => f.media_type === activeTab);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Favorites</h1>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'movie' ? styles.active : ''}`}
          onClick={() => handleTabChange('movie')}
        >
          Movies
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'tv' ? styles.active : ''}`}
          onClick={() => handleTabChange('tv')}
        >
          TV Shows
        </button>
      </div>

      <div className={styles.subheader}>
        <h2 className={styles.subTitle}>Your Favorites</h2>
        <span style={{ color: '#94A3B8', fontSize: 13 }}>
          {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {paginated.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>
            {activeTab === 'movie' ? '🎬' : '📺'}
          </span>
          No favorite {activeTab === 'movie' ? 'movies' : 'TV shows'} yet.
          <br />
          Browse and add some!
        </div>
      ) : (
        <div className={styles.list}>
          {paginated.map((item) => (
            <HorizontalMediaCard
              key={`${item.media_type}-${item.id}`}
              item={item}
              onRemove={removeFavorite}
            />
          ))}
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

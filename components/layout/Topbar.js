'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useCallback } from 'react';
import styles from './Topbar.module.scss';

const pageNames = {
  '/': 'Home',
  '/movies': 'Movies',
  '/tv': 'TV Shows',
  '/favorites': 'Favorites',
};

export default function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState('');

  const pageName = pageNames[pathname] || 'Home';

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    if (pathname === '/tv') {
      router.push(`/tv?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push(`/movies?search=${encodeURIComponent(trimmed)}`);
    }
  }, [query, pathname, router]);

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <div className={styles.breadcrumb}>
          <span className={styles.separator}>≡</span>
          <span className={styles.current}>{pageName}</span>
        </div>

        <form onSubmit={handleSearch} className={styles.searchWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search movies or TV shows"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
      </div>

      <div className={styles.actions}>
        <button className={styles.iconBtn} title="Favorites">❤️</button>
        <button className={styles.iconBtn} title="Notifications">🔔</button>
        <div className={styles.avatar}>U</div>
      </div>
    </header>
  );
}

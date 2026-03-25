'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef } from 'react';
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
  const debounceRef = useRef(null);

  const pageName = pageNames[pathname] || 'Home';

  const navigateSearch = (value) => {
    const trimmed = value.trim();
    const target = pathname === '/tv' ? '/tv' : '/movies';
    if (trimmed) {
      router.push(`${target}?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push(target);
    }
  };

  const handleChange = (value) => {
    setQuery(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => navigateSearch(value), 400);
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <div className={styles.breadcrumb}>
          <span className={styles.separator}>≡</span>
          <span className={styles.current}>{pageName}</span>
        </div>

        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search movies or TV shows"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.iconBtn} title="Favorites">❤️</button>
        <button className={styles.iconBtn} title="Notifications">🔔</button>
        <div className={styles.avatar}>U</div>
      </div>
    </header>
  );
}

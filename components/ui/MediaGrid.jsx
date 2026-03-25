'use client';

import { useRef } from 'react';
import MediaCard from './MediaCard';
import styles from './MediaGrid.module.scss';

export function MediaGrid({ items, mediaType }) {
  if (!items || items.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>🎬</span>
        No results found.
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <MediaCard key={item.id} item={item} mediaType={mediaType} />
      ))}
    </div>
  );
}

export function MediaRow({ title, items, mediaType }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const amount = direction === 'left' ? -400 : 400;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <div className={styles.scrollControls}>
          <button className={styles.scrollBtn} onClick={() => scroll('left')}>‹</button>
          <button className={styles.scrollBtn} onClick={() => scroll('right')}>›</button>
        </div>
      </div>
      <div className={styles.scrollRow} ref={scrollRef}>
        {items.map((item) => (
          <div key={item.id} className={styles.scrollItem}>
            <MediaCard item={item} mediaType={mediaType} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className={styles.loading}>
      <div className={styles.spinner} />
      Loading...
    </div>
  );
}

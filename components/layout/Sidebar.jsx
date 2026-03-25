'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.scss';

const navItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/movies', label: 'Movies', icon: '🎬' },
  { href: '/tv', label: 'TV Shows', icon: '📺' },
  { href: '/favorites', label: 'Favorites', icon: '❤️' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>🎥</div>
        <div className={styles.logoText}>
          <span>MovieLib</span>
        </div>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
          >
            <span className={styles.icon}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

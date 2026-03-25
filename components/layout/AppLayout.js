'use client';

import Sidebar from './Sidebar';
import Topbar from './Topbar';
import styles from './AppLayout.module.scss';

export default function AppLayout({ children }) {
  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <Topbar />
      <main className={styles.main}>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}

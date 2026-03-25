import { Suspense } from 'react';
import TVPage from '@/features/tv/TVPage';

export default function TV() {
  return (
    <Suspense>
      <TVPage />
    </Suspense>
  );
}

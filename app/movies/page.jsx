import { Suspense } from 'react';
import MoviesPage from '@/features/movies/MoviesPage';

export default function Movies() {
  return (
    <Suspense>
      <MoviesPage />
    </Suspense>
  );
}

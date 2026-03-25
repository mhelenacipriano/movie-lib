const BASE_URL = 'https://api.themoviedb.org/3';
const TOKEN = process.env.NEXT_PUBLIC_TMDB_TOKEN;

const IMG_BASE = 'https://image.tmdb.org/t/p';
export const posterUrl = (path, size = 'w342') =>
  path ? `${IMG_BASE}/${size}${path}` : null;

async function tmdbFetch(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  });

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getTrendingMovies(page = 1) {
  return tmdbFetch('/trending/movie/week', { page });
}

export async function getTrendingTV(page = 1) {
  return tmdbFetch('/trending/tv/week', { page });
}

export async function getPopularMovies(page = 1) {
  return tmdbFetch('/movie/popular', { page });
}

export async function getPopularTV(page = 1) {
  return tmdbFetch('/tv/popular', { page });
}

export async function searchMovies(query, page = 1) {
  return tmdbFetch('/search/movie', { query, page });
}

export async function searchTV(query, page = 1) {
  return tmdbFetch('/search/tv', { query, page });
}

export async function getMovieDetails(id) {
  return tmdbFetch(`/movie/${id}`);
}

export async function getTVDetails(id) {
  return tmdbFetch(`/tv/${id}`);
}

// Discover movies by genre IDs
export async function discoverMovies(params = {}) {
  return tmdbFetch('/discover/movie', {
    sort_by: 'popularity.desc',
    ...params,
  });
}

// Get genre list for movies
export async function getMovieGenres() {
  return tmdbFetch('/genre/movie/list');
}

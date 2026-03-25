import { getMovieDetails, discoverMovies } from '@/lib/api/tmdb';

/**
 * Heuristic recommender that:
 * 1. Fetches full details for each favorite to get genres, cast, keywords
 * 2. Tallies the most common genre IDs
 * 3. Uses TMDB's /discover/movie endpoint to find similar movies
 * 4. Filters out movies already in favorites
 */
export async function generateRecommendations(favorites) {
  // 1. Fetch details for all favorites in parallel
  const detailPromises = favorites.map((f) =>
    getMovieDetails(f.id).catch(() => null)
  );
  const details = (await Promise.all(detailPromises)).filter(Boolean);

  if (details.length === 0) {
    return { recommendations: [], results: [] };
  }

  // 2. Tally genre IDs and collect production company info
  const genreCount = {};
  const genreNames = {};

  for (const d of details) {
    if (d.genres) {
      for (const g of d.genres) {
        genreCount[g.id] = (genreCount[g.id] || 0) + 1;
        genreNames[g.id] = g.name;
      }
    }
  }

  const topGenreIds = Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => Number(id));

  const topGenreLabels = topGenreIds.map((id) => genreNames[id]);

  // 3. Use TMDB discover to find movies matching top genres
  const favIds = new Set(favorites.map((f) => f.id));
  let results = [];

  if (topGenreIds.length > 0) {
    const data = await discoverMovies({
      with_genres: topGenreIds.join(','),
      'vote_average.gte': 6,
      'vote_count.gte': 100,
    });
    results = data.results.filter((m) => !favIds.has(m.id));
  }

  // 4. Build insight cards
  const recommendations = [];

  if (topGenreLabels.length > 0) {
    recommendations.push({
      title: `You love ${topGenreLabels.join(', ')}`,
      reason: `${topGenreLabels.length > 1 ? 'These genres appear' : 'This genre appears'} most in your favorites. Here are popular picks in the same space.`,
    });
  }

  // Find most-favorited average rating range
  const avgRating =
    details.reduce((sum, d) => sum + (d.vote_average || 0), 0) / details.length;
  if (avgRating > 0) {
    recommendations.push({
      title: `Your taste averages ★ ${avgRating.toFixed(1)}`,
      reason: `We filtered for movies rated 6+ to match your quality preferences.`,
    });
  }

  return {
    recommendations,
    results: results.slice(0, 20),
  };
}

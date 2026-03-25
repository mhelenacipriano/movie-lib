# MovieLib

A movie and TV show library app where you can browse trending titles, search for anything, save favorites, and get smart recommendations based on what you like.

Built as a portfolio project with a focus on clean architecture, polished UI, and real API integration.

## Tech Stack

- **Next.js 16** (App Router)
- **React (js)** (no TypeScript)
- **SCSS** (CSS Modules with `.module.scss`)
- **Zustand** (state management + localStorage persistence)
- **TMDB API** (movie and TV data)
- **Fetch API** (no axios)

## Features

**Browse**
- Trending movies and TV shows on the home page (weekly data from TMDB)
- Popular movies and TV shows with pagination
- Horizontal scroll carousels with navigation controls

**Search**
- Live search with 400ms debounce — results update as you type
- Search from the topbar (navigates to movies or TV page) or from each page's local search bar
- Works for both movies and TV shows

**Detail Panel**
- Click any card to open a slide-in detail panel
- Shows backdrop image, title, year, rating, runtime/seasons, genres, and full overview
- Add or remove from favorites directly from the panel
- Close with Escape key or by clicking the overlay

**Favorites**
- Favorite any movie or TV show from cards or the detail panel
- Toggle between Movies and TV Shows tabs on the favorites page
- Persisted to localStorage via Zustand — survives page refreshes and sessions
- Unfavorite from the favorites list

**Recommendations**
- Heuristic recommender based on your favorite movies' genres
- Fetches full details for each favorite, tallies top genres, then uses TMDB's discover endpoint to find similar titles
- Shows genre insights and a grid of recommended movies
- No external AI dependency — runs entirely on TMDB data

## Project Structure

```
app/                    # Next.js App Router pages
  page.js               # Home (/)
  movies/page.js        # Movies (/movies)
  tv/page.js            # TV Shows (/tv)
  favorites/page.js     # Favorites (/favorites)
  recommendations/      # Recommendations (/recommendations)

components/
  layout/               # AppLayout, Sidebar, Topbar
  ui/                   # Button, MediaCard, MediaGrid, Pagination,
                        # DetailPanel, DetailPanelProvider

features/               # Page-level feature components
  home/                 # HomePage + styles
  movies/               # MoviesPage + styles
  tv/                   # TVPage (shares movies styles)
  favorites/            # FavoritesPage + styles
  recommendations/      # RecommendationsPage + styles

lib/
  api/tmdb.js           # TMDB API layer (trending, popular, search, details, discover)
  ai/recommender.js     # Heuristic recommendation engine

store/
  favorites.js          # Zustand store with localStorage persistence

styles/
  globals.scss          # Global styles and resets
  _variables.scss       # Design tokens (colors, gradients, shadows, spacing)
  _mixins.scss          # Reusable SCSS mixins (glass, glow, truncate)
```

## Design

Dark cinematic theme with a gradient palette:

- Deep blue `#0F172A` — base background
- Electric blue `#1D4ED8` — accents
- Purple `#7C3AED` — primary highlight
- Pink `#DB2777` — accent
- Cyan `#06B6D4` — glow

Glass-effect cards, subtle glow on hover, smooth transitions. Layout uses a fixed sidebar (240px) and top bar with search.

## Getting Started

### Prerequisites

- Node.js 18+
- A TMDB API token (free at [themoviedb.org](https://www.themoviedb.org/settings/api))

### Setup

1. Clone the repo:

```bash
git clone https://github.com/<your-username>/movie-lib.git
cd movie-lib
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root:

```
NEXT_PUBLIC_TMDB_TOKEN=your_tmdb_read_access_token
```

4. Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

Works out of the box on Vercel:

1. Push to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add `NEXT_PUBLIC_TMDB_TOKEN` as an environment variable
4. Deploy

## API Reference

All data comes from [TMDB API v3](https://developer.themoviedb.org/docs). Endpoints used:

| Endpoint | Purpose |
|---|---|
| `/trending/movie/week` | Home page trending movies |
| `/trending/tv/week` | Home page trending TV shows |
| `/movie/popular` | Movies page default listing |
| `/tv/popular` | TV page default listing |
| `/search/movie` | Movie search |
| `/search/tv` | TV search |
| `/movie/{id}` | Movie detail (genres, runtime, overview) |
| `/tv/{id}` | TV detail (genres, seasons, overview) |
| `/discover/movie` | Recommendations by genre |
| `/genre/movie/list` | Genre ID mapping |

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (item) => {
        const { favorites } = get();
        const key = `${item.media_type}-${item.id}`;
        if (favorites.some((f) => `${f.media_type}-${f.id}` === key)) return;
        set({ favorites: [...favorites, item] });
      },

      removeFavorite: (id, mediaType) => {
        set({
          favorites: get().favorites.filter(
            (f) => !(f.id === id && f.media_type === mediaType)
          ),
        });
      },

      isFavorite: (id, mediaType) => {
        return get().favorites.some(
          (f) => f.id === id && f.media_type === mediaType
        );
      },

      getFavoritesByType: (mediaType) => {
        return get().favorites.filter((f) => f.media_type === mediaType);
      },
    }),
    {
      name: 'movielib-favorites',
    }
  )
);

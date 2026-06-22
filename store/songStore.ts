import { create } from "zustand";
import { CursorPage, songApi } from "@/libs";
import { Song } from "@/types";

interface SongStore {
  songs: Song[];
  nextCursor: string | null;
  hasMore: boolean;
  isLoading: boolean;
  hydrate: (data: CursorPage<Song>) => void;
  fetchMore: () => Promise<void>;
  fetchSongs: () => Promise<void>;
}

export const useSongStore = create<SongStore>((set, get) => ({
  songs: [],
  nextCursor: null,
  hasMore: true,
  isLoading: false,

  hydrate: (data) =>
    set({
      songs: data.items,
      nextCursor: data.nextCursor,
      hasMore: data.hasMore,
    }),

  fetchMore: async () => {
    const { nextCursor, isLoading, hasMore } = get();
    if (isLoading || !hasMore || !nextCursor) return;

    set({ isLoading: true });
    try {
      const res = await songApi.getSongs(nextCursor);
      set((state) => ({
        songs: [...state.songs, ...res.items],
        nextCursor: res.nextCursor,
        hasMore: res.hasMore,
      }));
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSongs: async () => {
    set({ isLoading: true });
    try {
      const res = await songApi.getSongs();
      set({
        songs: res.items,
        nextCursor: res.nextCursor,
        hasMore: res.hasMore,
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));

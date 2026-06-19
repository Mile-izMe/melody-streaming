import { Song } from "@/types";
import { create } from "zustand";

interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  stop: () => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  currentSong: null,
  isPlaying: false,
  playSong: (song) => set({ currentSong: song, isPlaying: true }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  stop: () => set({ currentSong: null, isPlaying: false }),
}));

import { songApi } from "@/libs";
import { Song } from "@/types";
import { create } from "zustand";

interface PlayerStore {
  currentSong: Song | null;
  streamUrl: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isExpanded: boolean;
  setCurrentTime: (t: number) => void;
  setDuration: (d: number) => void;
  setExpanded: (v: boolean) => void;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  stop: () => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  currentSong: null,
  streamUrl: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  isExpanded: false,

  setCurrentTime: (t: number) => set({ currentTime: t }),
  setDuration: (d: number) => set({ duration: d }),
  setExpanded: (v: boolean) => set({ isExpanded: v }),

  playSong: (song) =>
    set({
      currentSong: song,
      streamUrl: songApi.getStreamUrl(song.id),
      isPlaying: true,
    }),

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  stop: () => set({ currentSong: null, streamUrl: null, isPlaying: false }),
}));

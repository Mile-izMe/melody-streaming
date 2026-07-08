import { create } from "zustand";

interface PlaylistUIStore {
  isAddModalOpen: boolean;
  selectedSongId: string | null;
  openAddModal: (songId: string) => void;
  closeAddModal: () => void;
}

export const usePlaylistUIStore = create<PlaylistUIStore>((set) => ({
  isAddModalOpen: false,
  selectedSongId: null,
  openAddModal: (songId) =>
    set({ isAddModalOpen: true, selectedSongId: songId }),
  closeAddModal: () => set({ isAddModalOpen: false, selectedSongId: null }),
}));

import { create } from "zustand";

interface PlaylistStore {
  // 1. Handle Modal create Playlist
  isCreateModalOpen: boolean;
  setCreateModalOpen: (isOpen: boolean) => void;

  // 2. Handle Modal edit Playlist
  editingPlaylistId: string | null;
  setEditingPlaylistId: (playlistId: string | null) => void;

  // 3. Handle Modal Add Song To Playlist
  isAddToPlaylistModalOpen: boolean;
  selectedSongIdToAdd: string | null;
  openAddToPlaylistModal: (songId: string) => void;
  closeAddToPlaylistModal: () => void;
}

export const usePlaylistStore = create<PlaylistStore>((set) => ({
  isCreateModalOpen: false,
  setCreateModalOpen: (isOpen) => set({ isCreateModalOpen: isOpen }),

  editingPlaylistId: null,
  setEditingPlaylistId: (id) => set({ editingPlaylistId: id }),

  isAddToPlaylistModalOpen: false,
  selectedSongIdToAdd: null,
  openAddToPlaylistModal: (songId) =>
    set({
      isAddToPlaylistModalOpen: true,
      selectedSongIdToAdd: songId,
    }),
  closeAddToPlaylistModal: () =>
    set({
      isAddToPlaylistModalOpen: false,
      selectedSongIdToAdd: null,
    }),
}));

import { PlaylistInput } from "../validations/playlist";
import { privateApi } from "./api";
import { SongResponse } from "./song";

export interface PlaylistResponse {
  id: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  songCount: number;
  containSong: boolean;
  songs: SongResponse[];
  createdAt: Date;
}

export const playlistApi = {
  createPlaylist: (
    data: PlaylistInput,
    token: string,
  ): Promise<PlaylistResponse> => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.description) {
      formData.append("description", data.description);
    }
    if (data.thumbnailUrl) {
      formData.append("thumbnailUrl", data.thumbnailUrl);
    }
    return privateApi(token).upload("/api/playlists", formData);
  },

  getUserPlaylists: (
    token: string,
    checkSongId?: string | null,
  ): Promise<PlaylistResponse[]> => {
    const url = checkSongId
      ? `/api/playlists?checkSongId=${checkSongId}`
      : "/api/playlists";

    return privateApi(token).get(url);
  },

  getDetail: (id: string, token: string): Promise<PlaylistResponse> =>
    privateApi(token).get(`/api/playlists/${id}`),

  updatePlaylist: (
    id: string,
    data: PlaylistInput,
    token: string,
  ): Promise<PlaylistResponse> => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.description) {
      formData.append("description", data.description);
    }
    if (data.thumbnailUrl) {
      formData.append("thumbnailUrl", data.thumbnailUrl);
    }
    return privateApi(token).upload(`/api/playlists/${id}`, formData);
  },

  deletePlaylist: (id: string, token: string): Promise<{ message: string }> =>
    privateApi(token).delete(`/api/playlists/${id}`),

  addSongToPlaylist: (
    playlistId: string,
    songId: string,
    token: string,
  ): Promise<{ message: string }> =>
    privateApi(token).post(
      `/api/playlists/${playlistId}/songs?songId=${songId}`,
      null,
    ),

  removeSongFromPlaylist: (
    playlistId: string,
    songId: string,
    token: string,
  ): Promise<{ message: string }> =>
    privateApi(token).delete(`/api/playlists/${playlistId}/songs/${songId}`),
};

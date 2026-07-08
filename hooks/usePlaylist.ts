import { playlistApi, PlaylistInput } from "@/libs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ==========================================
// 1. READ
// ==========================================
export const usePlaylists = (token: string) => {
  return useQuery({
    queryKey: ["playlists", token],
    queryFn: () => playlistApi.getUserPlaylists(token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // Cache data in 5 mins
  });
};

// ==========================================
// READ DETAIL
// ==========================================
export const usePlaylistDetail = (playlistId: string, token: string) => {
  return useQuery({
    queryKey: ["playlistDetail", playlistId],
    queryFn: () => playlistApi.getDetail(playlistId, token),
    enabled: !!playlistId && !!token,
  });
};

// ==========================================
// 2. CREATE NEW PLAYLIST
// ==========================================
export const useCreatePlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, token }: { data: PlaylistInput; token: string }) =>
      playlistApi.createPlaylist(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
    },
  });
};

// ==========================================
// 3. UPDATE PLAYLIST
// ==========================================
export const useUpdatePlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      playlistId,
      data,
      token,
    }: {
      playlistId: string;
      data: PlaylistInput;
      token: string;
    }) => playlistApi.updatePlaylist(playlistId, data, token),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
    },
  });
};

// ==========================================
// 4. DELETE A PLAYLIST
// ==========================================
export const useDeletePlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      playlistId,
      token,
    }: {
      playlistId: string;
      token: string;
    }) => playlistApi.deletePlaylist(playlistId, token),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
    },
  });
};

// ==========================================
// 5. ADD SONG
// ==========================================
export const useAddSongToPlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      playlistId,
      songId,
      token,
    }: {
      playlistId: string;
      songId: string;
      token: string;
    }) => playlistApi.addSongToPlaylist(playlistId, songId, token),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
    },
  });
};

// ==========================================
// 6. REMOVE SONG
// ==========================================
export const useRemoveSongFromPlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      playlistId,
      songId,
      token,
    }: {
      playlistId: string;
      songId: string;
      token: string;
    }) => playlistApi.removeSongFromPlaylist(playlistId, songId, token),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
    },
  });
};

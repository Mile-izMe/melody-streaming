import { usePlaylistDetail, useRemoveSongFromPlaylist } from "@/hooks";
import { formatTimeSong } from "@/libs/common";
import { useAuthStore, usePlayerStore } from "@/store";
import { Playlist } from "@/types";
import { FolderHeart, Library, Play, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

export interface PlaylistDetailProps {
  selectedPlaylist: Playlist | null;
}

export default function PlaylistDetail({
  selectedPlaylist,
}: PlaylistDetailProps) {
  const t = useTranslations("playlists.detail");
  const { accessToken } = useAuthStore();
  const { playSong } = usePlayerStore();
  const {
    data: listSongs,
    isLoading,
    isError,
  } = usePlaylistDetail(selectedPlaylist?.id || "", accessToken || "");
  const { mutate: removeSongFromPlaylist, isPending: isDeleting } =
    useRemoveSongFromPlaylist();

  const handleRemoveSong = (playlistId: string, songId: string) => {
    if (!accessToken) return;
    const toastId = toast.loading(t("loadingRemove"));

    removeSongFromPlaylist(
      { playlistId, songId, token: accessToken || "" },
      {
        onSuccess: () => {
          toast.success(t("removeSuccess"), { id: toastId });
        },
        onError: () => {
          toast.error(t("errorRemove"), { id: toastId });
        },
      },
    );
  };

  // --- RENDER STATES ---
  if (isLoading) {
    return (
      <div className="text-sm text-stone-500 animate-pulse">{t("loading")}</div>
    );
  }

  if (isError) {
    return <div className="text-sm text-red-500">{t("error")}</div>;
  }

  return (
    <div className="md:col-span-2"> 
      {selectedPlaylist ? (
        <div className="bg-stone-900/10 border border-amber-950/20 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Playlist Identity Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-amber-950/20 pb-6 mb-6 gap-4">
            <div className="flex items-center space-x-4">
              <div
                className={`w-16 h-16 rounded-xl bg-gradient-to-br ${selectedPlaylist.thumbnailUrl} shadow-xl border border-white/10 flex items-center justify-center p-2.5`}
              >
                <Library className="w-8 h-8 text-stone-100" />
              </div>

              <div>
                <span className="text-[10px] font-mono text-amber-500 tracking-widest uppercase">
                  {t("badge")}
                </span>
                <h2 className="text-2xl font-sans font-semibold text-stone-100 tracking-tight mt-1">
                  {selectedPlaylist.name}
                </h2>
                <p className="text-xs text-stone-400 font-sans mt-1">
                  {selectedPlaylist.description || t("default_description")}
                </p>
              </div>
            </div>

            <div className="text-stone-500 font-mono text-[10px] tracking-wide bg-stone-950/40 border border-stone-800 px-3 py-1.5 rounded-full select-none self-start sm:self-auto">
              {t("created_at")}{" "}
              {new Date(selectedPlaylist.createdAt).toLocaleDateString("vi-VN")}
            </div>
          </div>

          {/* Tracks in Selected Playlist */}
          <div className="space-y-2">
            {selectedPlaylist.songCount === 0 ? (
              <div className="text-center py-12 text-stone-500 text-xs">
                {t("empty_songs")}
              </div>
            ) : (
              listSongs?.songs.map((song, i) => (
                <div
                  key={song.id}
                  className="group flex items-center justify-between p-3 rounded-xl hover:bg-amber-950/10 border border-transparent hover:border-amber-950/30 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <span className="text-stone-600 font-mono text-xs w-5 text-right font-medium">
                      {(i + 1).toString().padStart(2, "0")}
                    </span>

                    <img
                      src={song.thumbnailUrl}
                      alt={song.title}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover border border-amber-950/20 shrink-0"
                    />

                    <div className="overflow-hidden text-left">
                      <span className="text-xs font-semibold text-stone-200 block truncate group-hover:text-amber-400 transition-colors">
                        {song.title}
                      </span>
                      <span className="text-[10px] text-stone-400 block truncate mt-0.5">
                        {song.artist}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3.5 pl-2">
                    <span className="text-stone-500 font-mono text-[10px]">
                      {formatTimeSong(song.duration || 0)}
                    </span>

                    <button
                      disabled={isDeleting}
                      onClick={() => playSong(song)}
                      className="cursor-pointer w-7 h-7 rounded-full bg-amber-950/40 border border-amber-500/30 hover:bg-amber-500 hover:text-stone-950 flex items-center justify-center text-amber-400 transition-all"
                      title={t("play_song_title")}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>

                    <button
                      onClick={() =>
                        handleRemoveSong(selectedPlaylist.id, song.id)
                      }
                      className="cursor-pointer p-1.5 rounded-full text-stone-600 hover:text-red-400 transition-colors"
                      title={t("remove_song_title")}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="h-72 border-2 border-dashed border-stone-850/60 rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-stone-900/5">
          <FolderHeart className="w-8 h-8 text-stone-600 mb-3" />
          <p className="text-stone-400 text-xs">{t("empty_state_title")}</p>
          <p className="text-stone-500 text-[10px] mt-1.5">
            {t("empty_state_subtitle")}
          </p>
        </div>
      )}
    </div>
  );
}

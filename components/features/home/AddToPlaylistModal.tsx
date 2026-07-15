import { useAddSongToPlaylist, usePlaylists } from "@/hooks";
import { useAuthStore, usePlaylistUIStore } from "@/store";
import { useQueryClient } from "@tanstack/react-query";
import { Check, FolderHeart, Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

function AddToPlaylistModal() {
  const t = useTranslations("add_to_playlist_modal");
  const { accessToken } = useAuthStore();
  const { isAddModalOpen, selectedSongId, closeAddModal } =
    usePlaylistUIStore();

  const { data: playlists, isLoading } = usePlaylists(
    accessToken || "",
    selectedSongId,
  );

  const queryClient = useQueryClient();

  const { mutate: addSong, isPending: isAdding } = useAddSongToPlaylist();

  if (!isAddModalOpen) return null;

  const handleAddToPlaylist = (playlistId: string) => {
    if (!selectedSongId || !accessToken) return;

    const toastId = toast.loading(t("add_playlist"));

    addSong(
      { playlistId, songId: selectedSongId, token: accessToken },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["playlists", accessToken, selectedSongId],
          });

          toast.success(t("add_success_toast"), {
            id: toastId,
          });

          setTimeout(() => {
            closeAddModal();
          }, 2000);
        },
        onError: () => {
          toast.error(t("add_error"), {
            id: toastId,
          });
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-sm shadow-2xl relative flex flex-col max-h-[80vh]">
        {/* Header Modal */}
        <div className="p-5 border-b border-stone-800/50 flex items-center justify-between shrink-0">
          <h3 className="text-lg font-semibold text-stone-100">
            {t("add_playlist")}
          </h3>
          <button
            onClick={closeAddModal}
            className="text-stone-500 hover:text-stone-300 transition-colors p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Modal */}
        <div className="p-3 overflow-y-auto space-y-2 custom-scrollbar">
          {isLoading ? (
            <div className="p-8 text-center text-stone-500 text-sm animate-pulse">
              {t("loading")}
            </div>
          ) : !playlists || playlists.length === 0 ? (
            <div className="p-8 text-center text-stone-500 text-sm">
              {t("no_playlist")}
            </div>
          ) : (
            playlists.map((playlist) => {
              const isAlreadyInPlaylist = playlist.containSong;

              return (
                <button
                  key={playlist.id}
                  disabled={isAdding || isAlreadyInPlaylist}
                  onClick={() => handleAddToPlaylist(playlist.id)}
                  className="cursor-pointer w-full flex items-center justify-between p-3 rounded-xl hover:bg-stone-800/50 border border-transparent hover:border-stone-700/50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed text-left"
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-lg bg-stone-800 shrink-0 flex items-center justify-center overflow-hidden">
                      {playlist.thumbnailUrl ? (
                        <img
                          src={playlist.thumbnailUrl}
                          alt={playlist.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FolderHeart className="w-4 h-4 text-stone-500" />
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-sm font-medium text-stone-200 block truncate">
                        {playlist.name}
                      </span>
                      <span className="text-xs text-stone-500 block truncate mt-0.5">
                        {playlist.songCount || 0} {t("songs")}
                      </span>
                    </div>
                  </div>

                  {isAlreadyInPlaylist ? (
                    <div className="flex items-center space-x-1">
                      <span className="text-[10px] text-stone-500 font-medium">
                        {t("added")}
                      </span>
                      <Check className="w-4 h-4 text-green-500 shrink-0" />
                    </div>
                  ) : (
                    <Plus className="w-4 h-4 text-stone-600 group-hover:text-amber-500 transition-colors shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default AddToPlaylistModal;

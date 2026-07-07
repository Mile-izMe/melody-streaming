"use client";
import { useDeletePlaylist, usePlaylists } from "@/hooks";
import { useAuthStore } from "@/store/authStore";
import { Playlist } from "@/types";
import { ChevronRight, FolderHeart, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import EditPlaylistModal from "./EditPlaylistModal";

function PlaylistList() {
  const { accessToken } = useAuthStore();
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    null,
  );

  // --- API HOOKS ---
  const {
    data: playlists,
    isLoading,
    isError,
  } = usePlaylists(accessToken || "");
  const { mutate: deletePlaylist, isPending: isDeleting } = useDeletePlaylist();

  // --- HANDLERS ---
  const handleDelete = (playlistId: string) => {
    deletePlaylist({ playlistId, token: accessToken || "" });

    if (selectedPlaylist?.id === playlistId) {
      setSelectedPlaylist(null);
    }
  };

  // --- RENDER STATES ---
  if (isLoading) {
    return (
      <div className="text-sm text-stone-500 animate-pulse">
        Đang tải danh sách playlist...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-sm text-red-500">
        Đã có lỗi xảy ra khi tải danh sách. Vui lòng thử lại!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left List of Playlists */}
      <div className="md:col-span-1 space-y-3">
        <span className="text-sm font-mono text-stone-500 tracking-wide">
          CHỌN TUYỂN TẬP
        </span>
        {!playlists || playlists.length === 0 ? (
          <div className="p-8 text-center bg-stone-900/20 border border-stone-850 rounded-xl text-stone-500 text-xs">
            Chưa có danh sách phát nào. Thêm một cái bằng nút phía trên!
          </div>
        ) : (
          playlists.map((playlist) => {
            return (
              <div
                key={playlist.id}
                onClick={() => setSelectedPlaylist(playlist)}
                className={`group mt-2 relative flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                  selectedPlaylist?.id === playlist.id
                    ? "bg-amber-950/20 border border-amber-500/40 shadow-lg"
                    : "bg-stone-900/20 border border-stone-850 hover:bg-stone-900/30 hover:border-amber-950/40"
                }`}
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  {/* Thumbnail */}
                  <div className="w-11 h-11 rounded-lg bg-gradient-to-br border border-white/5 shadow-md ${matchingColor.glow} shrink-0 flex items-center justify-center p-1.5">
                    {playlist.thumbnailUrl ? (
                      <img
                        src={playlist.thumbnailUrl}
                        alt={playlist.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      // Fallback icon
                      <FolderHeart className="w-5 h-5 text-stone-400" />
                    )}
                  </div>

                  {/* Text */}
                  <div className="overflow-hidden">
                    <span className="text-md font-semibold tracking-wide text-stone-200 truncate block">
                      {playlist.name}
                    </span>
                    <span className="text-[15px] text-stone-400 font-mono tracking-wide mt-0.5 truncate block">
                      {playlist.songs.length} bài hát •{" "}
                      {new Date(playlist.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingPlaylist(playlist);
                    }}
                    className="cursor-pointer p-1.5 rounded-full text-stone-600 hover:text-amber-400 opacity-0 group-hover:opacity-100 transition-all"
                    title="Sửa playlist này"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(playlist.id);
                    }}
                    disabled={isDeleting}
                    className="cursor-pointer p-1.5 rounded-full text-stone-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    title="Xóa playlist này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-stone-600 group-hover:text-amber-500 transition-colors" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Right Detail of Selected Playlist */}

      {editingPlaylist && (
        <EditPlaylistModal
          playlist={editingPlaylist}
          token={accessToken || ""}
          onClose={() => setEditingPlaylist(null)}
          onSuccessEdit={(updatedData) => {
            if (selectedPlaylist?.id === editingPlaylist.id) {
              setSelectedPlaylist({
                ...selectedPlaylist,
                name: updatedData.name,
                description: updatedData.description,
              });
            }
          }}
        />
      )}
    </div>
  );
}

export default PlaylistList;

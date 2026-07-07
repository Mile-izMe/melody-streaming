"use client";

import { useUpdatePlaylist } from "@/hooks";
import {
  PlaylistInput,
  UpdatePlaylistInput,
  updatePlaylistSchema,
} from "@/libs";
import { Playlist } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface EditPlaylistModalProps {
  playlist: Playlist;
  token: string;
  onClose: () => void;
  onSuccessEdit?: (updatedData: PlaylistInput) => void;
}

export default function EditPlaylistModal({
  playlist,
  token,
  onClose,
  onSuccessEdit,
}: EditPlaylistModalProps) {
  const cUpdatePlaylist = useTranslations("playlists.update_playlist");
  const updateSchema = updatePlaylistSchema(cUpdatePlaylist);
  const { mutate: updatePlaylist, isPending: isUpdating } = useUpdatePlaylist();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdatePlaylistInput>({
    resolver: zodResolver(updateSchema),
  });

  // Đảm bảo form luôn nhận data mới nhất nếu prop playlist thay đổi
  useEffect(() => {
    reset({
      name: playlist.name,
      description: playlist.description || "",
    });
  }, [playlist, reset]);

  const onEditSubmit = (data: PlaylistInput) => {
    updatePlaylist(
      {
        playlistId: playlist.id,
        data,
        token,
      },
      {
        onSuccess: () => {
          if (onSuccessEdit) onSuccessEdit(data);
          onClose();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 text-stone-500 hover:text-stone-300"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-semibold text-stone-100 mb-6">
          Chỉnh sửa danh sách phát
        </h3>

        <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-stone-400 mb-1.5">
              TÊN DANH SÁCH
            </label>
            <input
              {...register("name")}
              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-2.5 text-sm text-stone-200 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
              placeholder="Nhập tên playlist..."
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">
                {errors.name.message as string}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono text-stone-400 mb-1.5">
              MÔ TẢ
            </label>
            <textarea
              {...register("description")}
              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-2.5 text-sm text-stone-200 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all resize-none h-24"
              placeholder="Thêm mô tả..."
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-stone-400 mb-1.5">
              ẢNH BÌA (TÙY CHỌN)
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("thumbnailUrl")}
              className="w-full text-sm text-stone-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-stone-800 file:text-stone-300 hover:file:bg-stone-700 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-stone-800/50">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2 text-sm text-stone-400 hover:text-stone-200 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="cursor-pointer px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

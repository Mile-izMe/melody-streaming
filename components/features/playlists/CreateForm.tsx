"use client";

import { ApiError } from "@/libs";
import { playlistApi } from "@/libs/api/playlist";
import {
  createPlaylistSchema,
  PlaylistInput,
} from "@/libs/validations/playlist";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, ImageIcon, Music } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  onClose: () => void;
}

function CreateForm({ onClose }: Props) {
  const cForm = useTranslations("playlists.create_form");
  const schema = createPlaylistSchema(cForm);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [thumbnailError, setThumbnailError] = useState("");
  const [serverError, setServerError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { accessToken } = useAuthStore();

  const form = useForm<PlaylistInput>({
    resolver: zodResolver(schema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setThumbnailError(cForm("invalid_type"));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setThumbnailError(cForm("too_large"));
      return;
    }
    setThumbnailError("");
    setThumbnailPreview(URL.createObjectURL(file)); // preview local, không cần upload
  };

  // ── Submit Handler ──────────────────────
  const handleCreate = async (data: PlaylistInput) => {
    if (!accessToken) return;

    setServerError("");

    try {
      await playlistApi.createPlaylist(data, accessToken);
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        setServerError(error.detail);
      } else {
        setServerError(cForm("generic_error"));
      }
    }
  };

  const inputCls = (hasError: boolean) =>
    `w-full px-3 py-2 bg-stone-950/60 border rounded-lg text-stone-200 text-xs 
     focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500/50 
     placeholder:text-stone-600 transition-all ${hasError ? "border-red-500/60" : "border-stone-800"}`;

  return (
    <div className="bg-stone-900/40 border border-amber-950/30 rounded-xl p-5 backdrop-blur-md">
      <h3 className="text-sm font-semibold tracking-wide text-stone-300 mb-4">
        {cForm("title")}
      </h3>
      <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1 relative">
            <Music className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500" />
            <input
              type="text"
              required
              placeholder={cForm("name_placeholder")}
              {...register("name")}
              className={`${inputCls(!!errors.name)} pl-9`}
            />
            {errors.name && (
              <span className="text-xs text-red-400">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-1 relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500" />
            <input
              type="text"
              placeholder={cForm("description_placeholder")}
              {...register("description")}
              className={`${inputCls(!!errors.description)} pl-9`}
            />
            {errors.description && (
              <span className="text-xs text-red-400">
                {errors.description.message}
              </span>
            )}
          </div>
        </div>

        {/* Custom high-end Colors selection */}
        <div className="flex items-center gap-4">
          <div
            onClick={() => inputRef.current?.click()}
            className="cursor-pointer w-20 h-20 rounded-xl overflow-hidden border border-stone-800 bg-stone-900 flex items-center justify-center hover:border-amber-900/50 transition-all shrink-0 relative group"
          >
            {thumbnailPreview ? (
              <Image
                src={thumbnailPreview}
                alt={cForm("cover_alt")}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <ImageIcon className="w-6 h-6 text-stone-600" />
            )}
            <div className="cursor-pointer absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="cursor-pointer text-[10px] text-white font-mono">
                {cForm("choose_cover")}
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-1">
            <p className="text-xs text-stone-400">{cForm("cover_label")}</p>
            <p className="text-[10px] text-stone-600">{cForm("cover_hint")}</p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-[11px] text-amber-400 hover:text-amber-300 transition-colors"
            >
              {thumbnailPreview ? cForm("change_cover") : cForm("choose_cover")}
            </button>
            {thumbnailError && (
              <p className="text-[11px] text-red-400">{thumbnailError}</p>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer px-3.5 py-1.5 rounded text-stone-400 hover:text-stone-300 text-xs"
          >
            {cForm("cancel")}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer px-4 py-2 bg-linear-to-r from-amber-700 to-amber-900 border border-amber-900/30 text-stone-100 rounded text-xs font-semibold"
          >
            {cForm("submit")}
          </button>
        </div>
      </form>

      {serverError && (
        <p className="text-xs text-red-400 text-center">{serverError}</p>
      )}
    </div>
  );
}

export default CreateForm;

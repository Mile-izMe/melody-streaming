"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Locale, useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  ApiError,
  SongInput,
  SongRequest,
  createSongSchema,
  songApi,
} from "@/libs";
import { useAuthStore } from "@/store/authStore";
import AudioZone from "./AudioZone";
import SongMetaFields from "./SongMetaFields";
import CoverPicker from "./CoverPicker";

export default function UploadForm() {
  const tForm = useTranslations("upload.form");
  const tValidation = useTranslations("upload.validation");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioError, setAudioError] = useState("");
  const [serverError, setServerError] = useState("");
  const [uploadProgress, setUploadProgress] = useState<
    "idle" | "presign" | "uploading" | "saving" | "done"
  >("idle");

  const { accessToken } = useAuthStore();
  const router = useRouter();
  const { locale } = useParams<{ locale: Locale }>();
  const schema = createSongSchema(tValidation);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SongInput>({
    resolver: zodResolver(schema),
  });

  const handleAudioSelect = (file: File) => {
    setAudioError("");
    // Auto-populate title from filename
    const cleanTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    setValue("title", cleanTitle);
    setAudioFile(file);
  };

  const onSubmit = async (data: SongInput) => {
    if (!audioFile) {
      setAudioError(tForm("audio_required"));
      return;
    }
    if (!accessToken) return;

    setServerError("");

    try {
      // ── Step 1: Get presign URL for audio ────────────────
      setUploadProgress("presign");
      const audioPresign = await songApi.getPresignUrl(
        {
          fileName: audioFile.name,
          contentType: audioFile.type,
        },
        accessToken,
      );

      // ── Step 2: Upload audio to S3 ───────────────────────
      setUploadProgress("uploading");
      await songApi.uploadDirect(audioPresign.presignUrl, audioFile);

      // ── Step 3: Presign + upload cover (optional) ─────────────
      let thumbnailKey: string | undefined;
      if (coverFile) {
        const coverPresign = await songApi.getPresignUrl(
          {
            fileName: coverFile.name,
            contentType: coverFile.type,
          },
          accessToken,
        );
        await songApi.uploadDirect(coverPresign.presignUrl, coverFile);
        thumbnailKey = coverPresign.objectKey;
      }

      // ── Step 4: Save metadata to DB ───────────────────────
      setUploadProgress("saving");
      await songApi.createSong(
        {
          title: data.title,
          artist: data.artist,
          lyrics: data.lyrics,
          objectKey: audioPresign.objectKey,
          thumbnailUrl: thumbnailKey,
        } satisfies SongRequest,
        accessToken,
      );

      setUploadProgress("done");
      router.push(`/${locale}/`);
    } catch (error) {
      setUploadProgress("idle");
      if (error instanceof ApiError) {
        setServerError(error.detail);
      } else {
        setServerError(tForm("generic_error"));
      }
    }
  };

  const progressLabel: Record<typeof uploadProgress, string> = {
    idle: tForm("submit_idle"),
    presign: tForm("submit_presign"),
    uploading: tForm("submit_uploading"),
    saving: tForm("submit_saving"),
    done: tForm("submit_done"),
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Audio dropzone */}
      <AudioZone onFileSelect={handleAudioSelect} selectedFile={audioFile} />
      {audioError && <p className="text-xs text-red-400">{audioError}</p>}

      {/* Metadata fields */}
      <SongMetaFields register={register} errors={errors} />

      {/* Cover picker */}
      <CoverPicker onFileSelect={setCoverFile} selectedFile={coverFile} />

      {/* Server error */}
      {serverError && (
        <p className="text-xs text-red-400 text-center">{serverError}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || uploadProgress !== "idle"}
        className="w-full py-3 flex items-center justify-center gap-2 bg-linear-to-r from-amber-700 to-amber-950 text-stone-100 rounded-xl font-medium text-sm border border-amber-900/40 hover:from-amber-600 hover:to-amber-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
      >
        {(isSubmitting || uploadProgress !== "idle") && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        {progressLabel[uploadProgress]}
      </button>
    </form>
  );
}

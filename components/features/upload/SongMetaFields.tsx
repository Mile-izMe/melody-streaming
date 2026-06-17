import { SongInput } from "@/libs";
import { Music, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface Props {
  register: UseFormRegister<SongInput>;
  errors: FieldErrors<SongInput>;
}

function SongMetaFields({ register, errors }: Props) {
  const t = useTranslations("upload.song_meta");

  const inputCls = (hasError: boolean) =>
    `w-full px-3 py-2 bg-stone-950/60 border rounded-lg text-stone-200 text-xs 
     focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500/50 
     placeholder:text-stone-600 transition-all ${hasError ? "border-red-500/60" : "border-stone-800"}`;

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        {/* Title */}
        <div className="space-y-1.5 w-full flex flex-col">
          <label className="text-xs text-stone-400 font-medium">
            {t("title_label")}
          </label>
          <div className="relative">
            <Music className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500" />
            <input
              {...register("title")}
              type="text"
              placeholder={t("title_placeholder")}
              className={`${inputCls(!!errors.title)} pl-9`}
            />
          </div>
          {errors.title && (
            <span className="text-xs text-red-400">{errors.title.message}</span>
          )}
        </div>

        {/* Artist */}
        <div className="space-y-1.5 w-full flex flex-col">
          <label className="text-xs text-stone-400 font-medium">
            {t("artist_label")}
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500" />

            <input
              {...register("artist")}
              type="text"
              placeholder={t("artist_placeholder")}
              className={`${inputCls(!!errors.artist)} pl-9`}
            />
            {errors.artist && (
              <span className="text-xs text-red-400">
                {errors.artist.message}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Lyrics */}
      <div className="space-y-1.5 flex flex-col">
        <label className="text-xs text-stone-400 font-medium">
          {t("lyrics_label")}{" "}
          <span className="text-stone-600">({t("lyrics_optional")})</span>
        </label>
        <textarea
          {...register("lyrics")}
          rows={3}
          placeholder={t("lyrics_placeholder")}
          className={`${inputCls(!!errors.lyrics)} resize-none`}
        />
      </div>
    </div>
  );
}

export default SongMetaFields;

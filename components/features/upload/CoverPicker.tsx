"use client";

import { useRef, useState } from "react";
import { ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface Props {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

const PRESET_COVERS = [
  {
    id: "tokyo_neon",
    url: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "luxury_wood",
    url: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "bamboo_mist",
    url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80",
  },
];

export default function CoverPicker({ onFileSelect, selectedFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>("");
  const [error, setError] = useState("");
  const t = useTranslations("upload.cover_picker");

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError(t("invalid_type"));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(t("too_large"));
      return;
    }
    setError("");
    setPreview(URL.createObjectURL(file));
    onFileSelect(file);
  };

  const handlePreset = (url: string) => {
    setPreview(url);
    onFileSelect(null); // preset không phải File — handle riêng ở UploadForm
  };

  return (
    <div className="space-y-2 flex flex-col">
      <label className="text-xs text-stone-400 font-medium">
        {t("label")} <span className="text-stone-600">({t("optional")})</span>
      </label>

      <div className="flex items-center gap-4">
        {/* Preview */}
        <div className="w-16 h-16 rounded-xl overflow-hidden border border-stone-800 shrink-0 bg-stone-900 flex items-center justify-center">
          {preview ? (
            <Image
              src={preview}
              alt={t("preview_alt")}
              width={64}
              height={64}
              unoptimized
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="w-5 h-5 text-stone-600" />
          )}
        </div>

        {/* Upload button */}
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="px-4 py-2 text-xs font-medium rounded-lg border border-stone-700 text-stone-300 hover:border-amber-900/60 hover:text-amber-300 transition-all"
          >
            {preview || selectedFile ? t("replace") : t("choose_from_device")}
          </button>
          <span className="text-[10px] text-stone-600">{t("formats")}</span>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </div>

      {/* Preset covers */}
      <div className="flex gap-2 pt-1">
        {PRESET_COVERS.map((cov) => (
          <button
            key={cov.id}
            type="button"
            onClick={() => handlePreset(cov.url)}
            className={`relative flex-1 h-12 rounded-lg overflow-hidden border transition-all ${
              preview === cov.url
                ? "border-amber-500 border-2"
                : "border-stone-800 opacity-60 hover:opacity-100"
            }`}
          >
            <Image
              src={cov.url}
              alt={t(`presets.${cov.id}`)}
              width={200}
              height={48}
              unoptimized
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-stone-300 py-0.5 text-center">
              {t(`presets.${cov.id}`)}
            </span>
          </button>
        ))}
      </div>

      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}

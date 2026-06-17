"use client";

import { Check, FileAudio } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useRef, useState } from "react";

interface Props {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

function AudioZone({ onFileSelect, selectedFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const t = useTranslations("upload.audio_zone");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
        dragActive
          ? "border-amber-500 bg-amber-950/15"
          : selectedFile
            ? "border-amber-950/80 bg-stone-950/30"
            : "border-stone-800 hover:border-amber-900/60 bg-stone-950/10"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleChange}
      />
      <span className="absolute top-2 right-2 flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 text-[9px] font-mono border border-amber-900/40">
        <Check className="w-3 h-3" />
        <span>{t("badge")}</span>
      </span>
      <div className="p-3 rounded-full bg-amber-950/20 text-amber-500 mb-2 border border-amber-900/20">
        <FileAudio className="w-6 h-6 animate-pulse" />
      </div>
      <p className="text-stone-300 text-xs font-medium">
        {selectedFile ? (
          <span className="text-amber-400">{selectedFile.name}</span>
        ) : (
          t("prompt")
        )}
      </p>
      <p className="text-stone-500 text-[10px] mt-1">{t("limit")}</p>
    </div>
  );
}

export default AudioZone;

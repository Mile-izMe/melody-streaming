"use client";

import { Upload } from "lucide-react";
import { useRef, useState } from "react";

interface Props {
  label: string;
  onFileSelect: (file: File) => void;
}

export default function AvatarPicker({ label, onFileSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>("");
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Chỉ chấp nhận file ảnh");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Ảnh tối đa 5MB");
      return;
    }

    setError("");

    setPreview(URL.createObjectURL(file));
    onFileSelect(file);
  };

  return (
    <div className="space-y-2 flex flex-col pt-1">
      <span className="text-xs text-stone-400 font-medium">{label}</span>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-stone-800 shrink-0">
          {preview ? (
            <img
              src={preview}
              alt="Avatar preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-stone-900 flex items-center justify-center">
              <Upload className="w-5 h-5 text-stone-600" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="px-4 py-2 text-xs font-medium rounded-lg border border-stone-700 text-stone-300 hover:border-amber-900/60 hover:text-amber-300 transition-all"
          >
            {preview ? "Đổi ảnh" : "Chọn ảnh"}
          </button>
          <span className="text-[10px] text-stone-600">
            JPG, PNG, WebP · Tối đa 5MB
          </span>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}

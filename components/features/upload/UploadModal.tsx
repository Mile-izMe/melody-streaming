// components/features/upload/UploadModal.tsx
"use client";

import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import UploadForm from "./UploadForm";

interface Props {
  onClose: () => void;
}

export default function UploadModal({ onClose }: Props) {
  const t = useTranslations("upload.modal");

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-9999 isolate flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-stone-950/85" onClick={onClose} />

      {/* Modal */}
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden overflow-y-auto rounded-2xl border border-amber-950/60 bg-stone-900/90 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
          <div>
            <h2 className="mt-1 text-2xl font-sans font-semibold tracking-tight text-stone-100">
              {t("title")}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label={t("close_label")}
            className="rounded-full border border-stone-800 bg-stone-950/45 p-1.5 text-stone-400 transition-colors hover:text-amber-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <div className="px-8 pb-8">
          <UploadForm />
        </div>
      </div>
    </div>,
    document.body,
  );
}

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import UploadModal from "./UploadModal";

function Information() {
  const [openUploadModal, setUploadModalOpen] = useState(false);
  const t = useTranslations("upload.information");

  return (
    <div className="max-w-xl mx-auto bg-stone-900/40 p-8 rounded-2xl border border-amber-950/20 text-center space-y-5 backdrop-blur-md">
      <span className="text-[9px] font-mono tracking-widest text-[#d4af37] block">
        {t("badge")}
      </span>
      <h2 className="text-2xl font-sans font-semibold text-stone-200">
        {t("title")}
      </h2>
      <p className="text-stone-400 text-xs leading-relaxed">
        {t("description")}
      </p>
      <button
        onClick={() => setUploadModalOpen(true)}
        className="cursor-pointer px-6 py-3 bg-linear-to-r from-amber-700 to-amber-950 border border-amber-900/30 text-stone-100 text-xs font-bold rounded-full hover:from-amber-600 hover:to-amber-900 shadow-md transition-all duration-300"
      >
        {t("cta")}
      </button>
      {openUploadModal && (
        <UploadModal onClose={() => setUploadModalOpen(false)} />
      )}
    </div>
  );
}

export default Information;

"use client";

import { Library, LogIn } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

function ModalLibrary() {
  const router = useRouter();
  const t = useTranslations("playlists.modal_library");

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center max-w-xl mx-auto my-12">
      <div className="w-16 h-16 rounded-full bg-amber-950/20 border border-amber-500/30 flex items-center justify-center text-amber-500 mb-6 animate-pulse">
        <Library className="w-7 h-7" />
      </div>

      <span className="text-[10px] font-mono tracking-[0.3em] text-amber-500 uppercase">
        {t("badge")}
      </span>
      <h2 className="text-2xl font-sans font-semibold text-stone-200 tracking-tight mt-2">
        {t("title")}
      </h2>

      <p className="text-stone-400 text-xs mt-3 leading-relaxed">
        {t("description")}
      </p>

      <button
        onClick={() => router.push("/authentication")}
        className="cursor-pointer mt-8 flex items-center space-x-2 px-6 py-3 rounded-full bg-linear-to-r from-amber-700 to-amber-950 text-stone-100 font-semibold text-xs border border-amber-900/40 hover:from-amber-600 hover:to-amber-900 shadow-lg hover:shadow-amber-950/30 active:scale-95 transition-all duration-300"
      >
        <LogIn className="w-4 h-4" />
        <span>{t("cta")}</span>
      </button>
    </div>
  );
}

export default ModalLibrary;

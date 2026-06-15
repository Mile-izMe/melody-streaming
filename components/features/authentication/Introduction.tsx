"use client";

import {
  ArrowLeft,
  AudioWaveform,
  Headphones,
  Mic2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function Introduction() {
  const t = useTranslations("authentication.introduction");
  const router = useRouter();
  return (
    <>
      {/* Navigation Back Button */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-800/10 rounded-full blur-3xl pointer-events-none" />
      <button
        onClick={() => router.push("/")}
        className="cursor-pointer absolute top-4 right-4 z-10 p-2 rounded-full bg-stone-950/40 border border-stone-800 text-stone-400 hover:text-amber-400 hover:border-amber-900/50 transition-all duration-300"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>
      <div className="w-full md:w-[45%] bg-stone-950/65 p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-amber-950/30 overflow-y-auto">
        <div>
          {/* Tagline */}
          <div className="flex items-center space-x-2 text-amber-500 mb-4">
            <Headphones className="w-4 h-4" />
            <span className="text-xs font-mono tracking-widest uppercase">
              {t("tagline")}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-sans font-medium text-stone-200 tracking-tight leading-snug">
            {t("title_main")} <br />
            <span className="text-amber-500">{t("title_accent")}</span>
          </h3>

          {/* Description */}
          <p className="text-stone-400 text-xs mt-3 leading-relaxed">
            {t("description")}
          </p>

          {/* Feature List */}
          <div className="mt-6 space-y-3.5">
            <div className="flex items-start space-x-2 text-stone-400 text-xs">
              <AudioWaveform className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-300">
                  {t("features.hires_audio_title")}
                </strong>{" "}
                {t("features.hires_audio_description")}
              </div>
            </div>
            <div className="flex items-start space-x-2 text-stone-400 text-xs">
              <Mic2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-300">
                  {t("features.for_artists_title")}
                </strong>{" "}
                {t("features.for_artists_description")}
              </div>
            </div>
            <div className="flex items-start space-x-2 text-stone-400 text-xs">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-300">
                  {t("features.smart_discovery_title")}
                </strong>{" "}
                {t("features.smart_discovery_description")}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info Box */}
        <div className="mt-8 pt-4 border-t border-stone-900">
          <div className="w-full flex items-center justify-between text-left text-xs bg-amber-950/20 border border-amber-950/60 rounded-lg p-3 text-amber-400">
            <span className="font-medium flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              {t("security_notice")}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

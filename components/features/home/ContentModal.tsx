import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

function ContentModal() {
  const t = useTranslations("ui.content_modal");

  return (
    <div className="relative rounded-3xl overflow-hidden h-72 sm:h-96 border border-amber-950/20 bg-stone-900/40 p-6 sm:p-12 flex flex-col justify-end shadow-2xl">
      {/* Background Visual Graphic with light mist */}
      <div
        className="absolute inset-0 bg-cover bg-center mix-blend-luminosity opacity-40 select-none pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1542332213-9b5a5a3fda35?auto=format&fit=crop&w=1600&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/70 to-transparent" />

      {/* Ambient Top Glow */}
      <div className="absolute top-0 left-0 w-80 h-40 bg-amber-500/5 blur-3xl rounded-full" />

      {/* Live floating stats for authentic look */}
      <div className="absolute top-6 right-6 flex items-center space-x-2 bg-stone-950/60 border border-amber-950/40 px-3 py-1.5 rounded-full backdrop-blur-md">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
        <span className="text-[9px] font-mono tracking-widest text-[#d4af37] select-none">
          <span className="font-bold">2,480</span> {t("listening_now")}
        </span>
      </div>

      {/* Content */}
      <div className="relative space-y-3 max-w-xl text-left">
        <div className="flex items-center space-x-2 text-amber-500/90 font-mono text-[14px] tracking-[0.3em]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t("badge_label")}</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-sans font-bold text-stone-100 tracking-tight leading-none">
          MELODY ー{" "}
          <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent font-medium">
            STREAM
          </span>
        </h2>

        <p className="text-md sm:text-md text-stone-300 font-sans leading-relaxed">
          {t("description")}
        </p>

        <div className="pt-4 flex flex-wrap gap-3">
          {/* {songs.length > 0 && (
            <button
              onClick={() => onPlaySong(songs[0])}
              className="flex items-center space-x-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-amber-700 to-amber-950 border border-amber-900/40 hover:from-amber-600 hover:to-amber-900 text-stone-100 font-bold text-xs shadow-lg active:scale-95 transition-all duration-300"
            >
              <Play className="w-4 h-4 fill-stone-100" />
              <span>PHÁT NHẠC THIỀN ĐỊNH</span>
            </button>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default ContentModal;

"use client";

import { usePlayerStore } from "@/store/playerStore";
import { Languages } from "lucide-react";
import "./index.css";

export default function LyricModal() {
  const { currentSong, currentTime, duration, isExpanded } = usePlayerStore();

  if (!currentSong || !isExpanded) return null;

  const linesCount = currentSong.lyrics?.length ?? 0;
  const currentLyricIndex = Math.min(
    Math.floor((currentTime / (duration || 1)) * linesCount),
    linesCount - 1,
  );

  return (
    <div className="max-w-7xl mx-auto h-[calc(100%-80px)] grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 py-6 overflow-hidden">
      {/* Left Column: Big Album Art + Glassmorphic Visualizer */}
      <div className="flex flex-col items-center justify-center space-y-6 overflow-hidden px-4">
        <div className="relative group w-52 h-52 sm:w-64 sm:h-64 rounded-2xl overflow-hidden shadow-2xl shadow-amber-950/40 p-[1px] bg-gradient-to-br from-amber-600/40 to-stone-900 border border-amber-900/30">
          {currentSong.thumbnailUrl ? (
            <img
              src={currentSong.thumbnailUrl}
              alt={currentSong.title}
              className="w-full h-full object-cover rounded-2xl transition-transform duration-[6s] group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-stone-900 rounded-2xl flex items-center justify-center text-stone-700 text-5xl font-bold">
              {currentSong.title.charAt(0)}
            </div>
          )}

          {/* Overlay shadow */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-60" />

          {/* Glowing Ambient Light Backing */}
          <div className="absolute inset-0 bg-amber-500/10 blur-xl scale-90 pointer-events-none -z-10 mix-blend-screen opacity-50" />
        </div>

        <div className="text-center">
          {/* <span className="text-[10px] font-mono tracking-[0.25em] text-amber-500 uppercase">
            {currentSong.genre} • {currentSong.year || 2026}
          </span> */}
          <h3 className="text-2xl font-sans font-semibold text-stone-100 tracking-tight mt-1">
            {currentSong.title}
          </h3>
          <p className="text-sm text-stone-400 font-sans mt-1">
            {currentSong.artist}
          </p>
        </div>

        {/* Simulated Live Audio Equalizer Waveform */}
        {/* <div className="flex items-end justify-center space-x-1.5 h-16 w-64 pt-2">
          {visualizerHeights.map((h, i) => (
            <div
              key={i}
              className="w-1 rounded-t-full transition-all duration-100 bg-gradient-to-t from-amber-700 via-amber-500 to-amber-300"
              style={{
                height: `${h}px`,
                opacity: isPlaying ? 0.35 + h / 80 : 0.2,
              }}
            />
          ))}
        </div> */}
      </div>

      {/* Right Column - Lyrics Scroll */}
      <div className="flex flex-col overflow-hidden border-l border-amber-950/20 pl-0 md:pl-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-stone-300">
            <Languages className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="text-xs font-mono tracking-widest uppercase">
              Lyrics
            </span>
          </div>
        </div>

        {/* Scrolling Lyrics Screen */}
        <div className="flex-1 overflow-y-auto max-h space-y-5 pr-2 custom-scrollbar">
          {currentSong.lyrics && currentSong.lyrics.length > 0 ? (
            currentSong.lyrics.map((line, idx) => {
              const isCurrent = idx === currentLyricIndex;
              return (
                <div
                  key={idx}
                  className={`transition-all duration-500 origin-left py-1 text-center md:text-left ${
                    isCurrent
                      ? "text-lg text-amber-400 font-sans font-medium scale-102 filter drop-shadow-[0_0_8px_rgba(212,175,55,0.25)]"
                      : "text-sm text-stone-500 hover:text-stone-300 cursor-pointer"
                  }`}
                >
                  {line}
                </div>
              );
            })
          ) : (
            <div className="text-center text-stone-500 text-sm py-12 font-sans italic">
              Không tìm thấy lời ca khúc này.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

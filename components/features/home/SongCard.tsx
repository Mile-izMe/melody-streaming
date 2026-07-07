"use client";

import { formatTimeSong } from "@/libs/common/formatTimeSong";
import { useAuthStore } from "@/store/authStore";
import { Song } from "@/types";
import { Heart, Play } from "lucide-react";
import { useState } from "react";

interface SongCardProps {
  song: Song;
  isCurrent: boolean;
  isPlaying: boolean;
  onPlay: () => void;
}

export default function SongCard({
  song,
  isCurrent,
  isPlaying,
  onPlay,
}: SongCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const user = useAuthStore();

  return (
    <div
      key={song.id}
      className="group relative flex flex-col bg-stone-900/10 hover:bg-amber-950/5 border border-stone-900 hover:border-amber-950/40 rounded-2xl p-4 transition-all duration-500 ease-in-out shadow-lg"
    >
      {/* Cover */}
      <div className="relative aspect-square rounded-xl overflow-hidden p-[1px] bg-stone-950 border border-stone-800/60 shadow-inner group-hover:shadow-amber-500/5 transition-all">
        {song.thumbnailUrl ? (
          <img
            src={song.thumbnailUrl}
            alt={song.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover rounded-xl transition-all duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-stone-800 flex items-center justify-center">
            <span className="text-stone-500 text-lg font-bold">
              {song.title.charAt(0)}
            </span>
          </div>
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-stone-950/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center space-x-2">
          {/* Play */}
          <button
            onClick={onPlay}
            className="cursor-pointer w-10 h-10 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center hover:bg-amber-400 transform scale-90 group-hover:scale-100 transition-all duration-300"
            title="Phát nhạc"
          >
            {isCurrent && isPlaying ? (
              <span className="flex space-x-1 items-end justify-center h-4 py-0.5">
                <span className="w-0.5 h-3 bg-stone-950 animate-pulse" />
                <span
                  className="w-0.5 h-2 bg-stone-950 animate-pulse"
                  style={{ animationDelay: "0.1s" }}
                />
                <span
                  className="w-0.5 h-3.5 bg-stone-950 animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                />
              </span>
            ) : (
              <Play className="w-4 h-4 fill-stone-950 text-stone-950 translate-x-[1px]" />
            )}
          </button>

          {/* Like */}
          {user.user?.isLoggedIn ? (
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`cursor-pointer w-10 h-10 rounded-full flex items-center justify-center hover:bg-stone-900 border border-stone-800 text-stone-300 transition-colors ${
                isLiked
                  ? "text-rose-500 border-rose-950/40 bg-rose-950/20"
                  : "bg-stone-950/80"
              }`}
            >
              <Heart
                className={`w-4 h-4 ${isLiked ? "fill-current text-rose-500" : ""}`}
              />
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="mt-3.5 text-left leading-normal flex-1 flex flex-col justify-between">
        <div>
          <span
            onClick={onPlay}
            className={`text-sm font-semibold tracking-wide truncate block cursor-pointer transition-colors ${
              isCurrent
                ? "text-amber-400 font-bold"
                : "text-stone-200 group-hover:text-amber-500"
            }`}
          >
            {song.title}
          </span>
          <span className="text-[14px] text-stone-400 truncate block mt-0.5">
            {song.artist}
          </span>
        </div>

        {/* Year / Info Footer Line inside Card */}
        <div className="flex items-center justify-between text-[12px] font-mono text-stone-500 mt-2.5 pt-2 border-t border-stone-800/50">
          <span>HLS</span>
          {formatTimeSong(song.duration || 0) && (
            <span>{formatTimeSong(song.duration || 0)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

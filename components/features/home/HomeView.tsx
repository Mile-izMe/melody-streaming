"use client";

import { CursorPage } from "@/libs";
import { usePlayerStore } from "@/store/playerStore";
import { useSongStore } from "@/store/songStore";
import { Song } from "@/types";
import { useEffect, useState } from "react";
import SongCard from "./SongCard";
import { ChevronDown, Loader2 } from "lucide-react";

export interface HomeViewProps {
  initialData: CursorPage<Song>;
}

export default function HomeView({ initialData }: HomeViewProps) {
  const { songs, fetchMore, hasMore, isLoading, hydrate } = useSongStore();
  const { playSong, currentSong, isPlaying } = usePlayerStore();
  const [expanded, setExpanded] = useState(false);

  // Hydrate store from server data
  useEffect(() => {
    if (songs.length === 0) {
      hydrate(initialData);
    }
  }, []);

  // Display first 5 songs by default, with option to expand
  const visibleSongs = expanded ? songs : songs.slice(0, 5);

  const handleLoadMore = async () => {
    if (!expanded) {
      setExpanded(true);
      return;
    }
    await fetchMore();
  };

  return (
    <div className="space-y-4 mt-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-stone-100 tracking-tight">
          Âm nhạc
        </h3>
        <span className="text-sm text-stone-500 font-mono tracking-wide">
          {songs.length} nhạc phẩm đề xuất
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {visibleSongs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            isCurrent={currentSong?.id === song.id}
            isPlaying={isPlaying && currentSong?.id === song.id}
            onPlay={() => playSong(song)}
          />
        ))}
      </div>

      {(!expanded || hasMore) && (
        <div className="flex justify-center pt-4">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="text-sm cursor-pointer flex items-center gap-2 px-6 py-2.5 rounded-full border border-stone-800 text-stone-400 font-mono tracking-widest hover:border-amber-900/50 hover:text-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
            {isLoading ? "Đang tải..." : "Xem thêm"}
          </button>
        </div>
      )}

      {expanded && !hasMore && (
        <p className="text-center text-stone-600 text-sm py-2 font-mono">
          ── Hết danh sách ──
        </p>
      )}
    </div>
  );
}

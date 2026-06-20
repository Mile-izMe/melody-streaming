"use client";

import { usePlayerStore } from "@/store/playerStore";
import { useSongStore } from "@/store/songStore";
import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { formatTimeSong } from "@/libs/common/formatTimeSong";
import { LyricModal } from "../features/home";

function AudioPlayer() {
  const {
    currentSong,
    streamUrl,
    isPlaying,
    duration,
    currentTime,
    isExpanded,
    togglePlay,
    playSong,
    setCurrentTime,
    setDuration,
    setExpanded,
  } = usePlayerStore();
  const { songs } = useSongStore();

  const audioRef = useRef<HTMLAudioElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  // ── Load HLS stream when streamUrl changes ───────────────
  useEffect(() => {
    if (!streamUrl || !audioRef.current) return;

    // Destroy old HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(streamUrl);
      hls.attachMedia(audioRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (isPlaying) audioRef.current?.play().catch(() => {});
      });
    } else if (audioRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari native HLS
      audioRef.current.src = streamUrl;
      audioRef.current.play().catch(() => {});
    }

    return () => {
      hlsRef.current?.destroy();
    };
  }, [streamUrl]);

  // ── Sync play/pause ───────────────────────────────────────
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // ── Volume ────────────────────────────────────────────────
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // ── Loop ──────────────────────────────────────────────────
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.loop = isLooping;
  }, [isLooping]);

  const handleNext = () => {
    if (!currentSong || songs.length === 0) return;
    const idx = songs.findIndex((s) => s.id === currentSong.id);
    const next = isShuffle
      ? songs[Math.floor(Math.random() * songs.length)]
      : songs[(idx + 1) % songs.length];
    playSong(next);
  };

  const handlePrev = () => {
    if (!currentSong || songs.length === 0) return;
    const idx = songs.findIndex((s) => s.id === currentSong.id);
    const prev = songs[(idx - 1 + songs.length) % songs.length];
    playSong(prev);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const val = parseFloat(e.target.value);
    audioRef.current.currentTime = (val / 100) * duration;
    setProgress(val);
  };

  if (!currentSong) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-500 bg-stone-950/90 backdrop-blur-2xl border-t border-amber-950/20 shadow-2xl ${
        isExpanded ? "h-[65vh]" : "h-24"
      }`}
    >
      <audio
        ref={audioRef}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
        onTimeUpdate={() => {
          const t = audioRef.current?.currentTime ?? 0;
          setCurrentTime(t);
          setProgress((t / (audioRef.current?.duration ?? 1)) * 100);
        }}
        onEnded={handleNext}
      />

      {/* ── Expanded panel ── */}
      {isExpanded && <LyricModal />}

      {/* ── Control bar ── */}
      <div className="max-w-7xl mx-auto h-24 flex items-center justify-between px-4 sm:px-6">
        {/* Left — song info */}
        <div className="flex items-center gap-3 w-[30%]">
          <div
            onClick={() => setExpanded(!isExpanded)}
            className="relative w-12 h-12 rounded-xl overflow-hidden cursor-pointer border border-amber-950/20 shrink-0 group"
          >
            {currentSong.thumbnailUrl ? (
              <img
                src={currentSong.thumbnailUrl}
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-stone-900 flex items-center justify-center text-stone-600 text-lg font-bold">
                {currentSong.title.charAt(0)}
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-white" />
              ) : (
                <ChevronUp className="w-4 h-4 text-white" />
              )}
            </div>
          </div>
          <div className="hidden sm:block overflow-hidden">
            <p className="text-xs font-semibold text-stone-200 truncate">
              {currentSong.title}
            </p>
            <p className="text-[10px] text-stone-400 truncate">
              {currentSong.artist}
            </p>
          </div>
        </div>

        {/* Center — controls + seeker */}
        <div className="flex flex-col items-center gap-2 w-[40%]">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setIsShuffle(!isShuffle)}
              className={`cursor-pointer transition-colors ${isShuffle ? "text-amber-400" : "text-stone-500 hover:text-amber-400"}`}
            >
              <Shuffle className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrev}
              className="cursor-pointer text-stone-400 hover:text-amber-400 transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={togglePlay}
              className="cursor-pointer w-10 h-10 rounded-full bg-gradient-to-tr from-amber-700 to-amber-950 hover:from-amber-600 hover:to-amber-900 text-stone-100 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-stone-100" />
              ) : (
                <Play className="w-4 h-4 fill-stone-100 translate-x-[1px]" />
              )}
            </button>
            <button
              onClick={handleNext}
              className="cursor-pointer text-stone-400 hover:text-amber-400 transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsLooping(!isLooping)}
              className={`cursor-pointer transition-colors ${isLooping ? "text-amber-400" : "text-stone-500 hover:text-amber-400"}`}
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          {/* Seeker */}
          <div className="w-full flex items-center gap-2">
            <span className="text-[9px] font-mono text-stone-500 w-8 text-right">
              {formatTimeSong(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={progress || 0}
              onChange={handleSeek}
              className="flex-1 h-1 bg-stone-800 rounded-full appearance-none cursor-pointer accent-amber-500"
            />
            <span className="text-[9px] font-mono text-stone-500 w-8">
              {formatTimeSong(duration)}
            </span>
          </div>
        </div>

        {/* Right — volume */}
        <div className="flex items-center justify-end gap-3 w-[30%]">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-stone-400 hover:text-amber-400 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-20 h-1 bg-stone-800 rounded-full appearance-none cursor-pointer accent-amber-500 hidden md:block"
          />
        </div>
      </div>
    </div>
  );
}

export default AudioPlayer;

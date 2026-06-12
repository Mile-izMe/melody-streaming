"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NavigationBack() {
  const router = useRouter();
  return (
    <>
      {/* Decorative Ambient Gold Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-800/10 rounded-full blur-3xl pointer-events-none" />
      {/* Close Button */}
      <button
        onClick={() => router.push("/")}
        className="cursor-pointer absolute top-4 right-4 z-10 p-2 rounded-full bg-stone-950/40 border border-stone-800 text-stone-400 hover:text-amber-400 hover:border-amber-900/50 transition-all duration-300"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>
    </>
  );
}

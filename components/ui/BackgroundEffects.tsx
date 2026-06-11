import { useMouseParallax, useParticleCanvas } from "@/hooks";
import { useRef } from "react";

function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const mousePos = useMouseParallax(0.05); // Custom hook for mouse parallax position
  useParticleCanvas(canvasRef, mousePos); // Custom hook to manage particle canvas rendering

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-stone-950">
      {/* Dynamic Render Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full pointer-events-none"
      />

      {/* Layer of Cinematic Fog / Japanese Mist */}
      <div
        className="absolute inset-[0_-20%] bottom-0 h-[40%] pointer-events-none mix-blend-overlay opacity-30 select-none bg-gradient-to-t from-stone-900/60 to-transparent animate-pulse"
        style={{ filter: "blur(45px)", animationDuration: "12s" }}
      />
      <div
        className="absolute inset-[0_-10%] bottom-10 h-[25%] pointer-events-none mix-blend-screen opacity-20 select-none bg-gradient-to-t from-[#c5a880]/15 to-transparent"
        style={{ filter: "blur(30px)", animationDuration: "18s" }}
      />

      {/* Luxurious Wooden Texture Overlay (Subtle scanline grid / grains) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 20px),
                            repeating-linear-gradient(90deg, #fff, #fff 1px, transparent 1px, transparent 20px)`,
        }}
      />
    </div>
  );
}

export default BackgroundEffects;

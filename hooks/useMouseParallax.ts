"use client";

import { useEffect, useState } from "react";

export function useMouseParallax(multiplier: number = 0.05) {
  // Implementation for mouse parallax effect
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Slow down the movement coordinates for smooth parallax
      setMousePos({
        x: (e.clientX - window.innerWidth / 2) * multiplier,
        y: (e.clientY - window.innerHeight / 2) * multiplier,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [multiplier]);

  return mousePos;
}

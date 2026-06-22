"use client";

import { useEffect, RefObject } from "react";

export interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  fadeSpeed: number;
  color: string;
  depth: number;
}

export function useParticleCanvas(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  mousePos: { x: number; y: number },
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Particle[] = [];
    const maxParticles = 60;

    const createParticle = (isInitial = false): Particle => {
      const depth = Math.random() * 1.2 + 0.3; // 3D depth layer
      return {
        x: Math.random() * width,
        y: isInitial ? Math.random() * height : height + 20,
        size: (Math.random() * 2.5 + 0.5) * depth,
        speedX: (Math.random() * 0.4 - 0.2) * depth,
        speedY: -(Math.random() * 0.8 + 0.2) * depth,
        opacity: Math.random() * 0.5 + 0.1,
        fadeSpeed: Math.random() * 0.002 + 0.001,
        depth,
        color:
          Math.random() > 0.4
            ? `rgba(${212}, ${175}, ${55}, ` // Gold #D4AF37
            : `rgba(${197}, ${168}, ${128}, `, // Warm Wood-Bronze #C5A880
      };
    };

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle(true));
    }

    const resizeHandler = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resizeHandler);

    // Draw & Update loops
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render 3D dynamic auroras and gradient glow spots first
      const gradient1 = ctx.createRadialGradient(
        width / 2 + mousePos.x * 2,
        height / 3 + mousePos.y * 2,
        10,
        width / 2,
        height / 3,
        width * 0.8,
      );
      gradient1.addColorStop(0, "rgba(30, 20, 15, 0.45)");
      gradient1.addColorStop(0.5, "rgba(12, 9, 7, 0.95)");
      gradient1.addColorStop(1, "rgba(5, 4, 3, 1)");

      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, width, height);

      // Subtle dynamic spot of warm luxury golden light
      const goldGlow = ctx.createRadialGradient(
        width * 0.75 - mousePos.x * 1.5,
        height * 0.2 - mousePos.y * 1.5,
        50,
        width * 0.75,
        height * 0.2,
        width * 0.5,
      );
      goldGlow.addColorStop(0, "rgba(212, 175, 55, 0.075)");
      goldGlow.addColorStop(0.5, "rgba(197, 168, 128, 0.02)");
      goldGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = goldGlow;
      ctx.fillRect(0, 0, width, height);

      // Update and draw particles
      particles.forEach((p, idx) => {
        const parallaxOffsetX = mousePos.x * (p.depth - 0.5);
        const parallaxOffsetY = mousePos.y * (p.depth - 0.5);

        p.y += p.speedY;
        p.x += p.speedX + mousePos.x * 0.005;

        // Slow hover oscillation
        p.x += Math.sin(p.y * 0.01) * 0.15;

        ctx.beginPath();
        ctx.arc(
          p.x + parallaxOffsetX,
          p.y + parallaxOffsetY,
          p.size,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = p.color + p.opacity + ")";
        ctx.fill();

        if (p.y < -20 || p.x < -20 || p.x > width + 20) {
          particles[idx] = createParticle(false);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeHandler);
      cancelAnimationFrame(animationFrameId);
    };
  }, [canvasRef, mousePos]); // Dependency array cập nhật theo mousePos
}

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

const BRAND_COLORS = [
  { r: 62, g: 123, b: 255 }, // blue
  { r: 47, g: 205, b: 168 }, // teal
  { r: 217, g: 167, b: 91 }, // gold
];

const DOT_SPACING = 30;
const BASE_RADIUS = 1.3;
const MAX_RADIUS = 3.4;
const HOVER_RANGE = 170;
const BASE_ALPHA = 0.16;

/**
 * "Get in Touch" backdrop — a dot-matrix field instead of soft color
 * blobs. A dense, evenly spaced grid of tiny dots covers the section in a
 * quiet neutral tone; dots gently breathe in and out on their own, and any
 * dot near the pointer swells and tints into a brand color (blue, teal, or
 * gold, cycling across the grid) with a soft glow, so the whole backdrop
 * feels like a responsive signal field reacting to the visitor rather than
 * a static texture. Rendered on canvas for performance at this density.
 * Falls back to a static, evenly-lit grid for prefers-reduced-motion.
 */
export default function ContactSignalBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const pointer = { x: -9999, y: -9999, active: false };

    function resize() {
      if (!canvas || !container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / DOT_SPACING) + 1;
      rows = Math.ceil(height / DOT_SPACING) + 1;
    }

    function handlePointerMove(event: PointerEvent) {
      const rect = container!.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      // Only "activate" the field while the pointer is actually within this
      // section's bounds — tracked on window so it still works while the
      // pointer is over content (cards, text) stacked above the canvas.
      pointer.active = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
      pointer.x = x;
      pointer.y = y;
    }

    function handlePointerLeave() {
      pointer.active = false;
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerleave', handlePointerLeave);

    let rafId = 0;
    const start = performance.now();

    function draw(now: number) {
      if (!ctx) return;
      const t = reduceMotion ? 0 : (now - start) / 1000;
      ctx.clearRect(0, 0, width, height);

      let colorCursor = 0;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * DOT_SPACING;
          const y = row * DOT_SPACING;

          // Gentle ambient breathing, offset per-dot so it ripples rather
          // than pulsing in unison.
          const wave = reduceMotion ? 0 : Math.sin(t * 0.9 + (row + col) * 0.35) * 0.5 + 0.5;

          let radius = BASE_RADIUS + wave * 0.6;
          let alpha = BASE_ALPHA + wave * 0.08;
          let color: { r: number; g: number; b: number } | null = null;

          if (pointer.active) {
            const dx = x - pointer.x;
            const dy = y - pointer.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < HOVER_RANGE) {
              const proximity = 1 - dist / HOVER_RANGE;
              radius = BASE_RADIUS + proximity * (MAX_RADIUS - BASE_RADIUS);
              alpha = BASE_ALPHA + proximity * 0.75;
              color = BRAND_COLORS[colorCursor % BRAND_COLORS.length];
            }
          }

          colorCursor++;

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          if (color) {
            ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
            if (radius > BASE_RADIUS + 0.4) {
              ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.55)`;
              ctx.shadowBlur = 8;
            } else {
              ctx.shadowBlur = 0;
            }
          } else {
            ctx.shadowBlur = 0;
            ctx.fillStyle = `rgba(147, 167, 193, ${alpha})`;
          }
          ctx.fill();
        }
      }
      ctx.shadowBlur = 0;

      if (!reduceMotion || pointer.active) {
        rafId = requestAnimationFrame(draw);
      }
    }

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [reduceMotion]);

  return (
    <div ref={containerRef} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />
      {/* Soft vignette so the dot field fades toward the section edges
          instead of ending on a hard rectangle. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, transparent 35%, rgba(10,20,32,0.9) 100%)',
        }}
      />
    </div>
  );
}

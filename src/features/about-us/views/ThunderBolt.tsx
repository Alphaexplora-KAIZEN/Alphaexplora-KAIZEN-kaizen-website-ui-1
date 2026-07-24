import { useEffect, useRef } from 'react';

interface ThunderBoltProps {
  /** Strikes only spawn while true; existing strikes still fade out after. */
  active: boolean;
}

interface Point {
  x: number;
  y: number;
}

interface Bolt {
  points: Point[];
  /** Branch is a shorter secondary crack off the main bolt, drawn thinner/fainter. */
  branch: Point[] | null;
  opacity: number;
  thickness: number;
}

const STRIKE_INTERVAL_MS = 550;
const SEGMENTS = 6;
const FADE_STEP = 0.05;
const THICKNESS_STEP = 0.09;
const BASE_THICKNESS = 2.2;

/**
 * Renders a small transparent canvas that draws real procedural lightning —
 * a chain of randomly-offset line segments spanning the element, redrawn
 * each frame with fading opacity/thickness — rather than a fixed CSS shape.
 * Technique adapted from "Make it flash ⚡️ in HTML Canvas" (dev.to,
 * soorajsnblaze333): draw a segment, use its end as the next segment's
 * start, keep repeating, then fade the whole bolt out over subsequent
 * frames. A short secondary branch is added off one interior point so each
 * strike doesn't look identical.
 */
export default function ThunderBolt({ active }: ThunderBoltProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    let bolts: Bolt[] = [];
    let lastStrike = 0;
    let rafId = 0;

    const spawnBolt = () => {
      const points: Point[] = [{ x: 0, y: height / 2 + (Math.random() - 0.5) * height * 0.4 }];
      for (let i = 1; i <= SEGMENTS; i++) {
        const x = (width / SEGMENTS) * i;
        const y = height / 2 + (Math.random() - 0.5) * height * 0.85;
        points.push({ x, y });
      }

      let branch: Point[] | null = null;
      if (points.length > 3) {
        const originIdx = 1 + Math.floor(Math.random() * (points.length - 3));
        const origin = points[originIdx];
        branch = [origin];
        let bx = origin.x;
        let by = origin.y;
        const branchSegments = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < branchSegments; i++) {
          bx += width / (SEGMENTS * 1.6);
          by += (Math.random() - 0.3) * height * 0.6;
          branch.push({ x: bx, y: by });
        }
      }

      bolts.push({ points, branch, opacity: 1, thickness: BASE_THICKNESS });
    };

    const drawPath = (points: Point[], opacity: number, thickness: number) => {
      if (points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = thickness;
      ctx.shadowColor = 'rgba(47, 205, 168, 0.9)';
      ctx.shadowBlur = 6;
      ctx.strokeStyle = `rgba(212, 251, 241, ${opacity})`;
      ctx.stroke();
    };

    const loop = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      if (activeRef.current && time - lastStrike > STRIKE_INTERVAL_MS && width > 0) {
        spawnBolt();
        lastStrike = time;
      }

      bolts = bolts.filter((bolt) => bolt.opacity > 0);
      for (const bolt of bolts) {
        drawPath(bolt.points, bolt.opacity, bolt.thickness);
        if (bolt.branch) drawPath(bolt.branch, bolt.opacity * 0.55, Math.max(0.5, bolt.thickness * 0.5));

        bolt.opacity -= FADE_STEP;
        bolt.thickness = Math.max(0.4, bolt.thickness - THICKNESS_STEP);
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

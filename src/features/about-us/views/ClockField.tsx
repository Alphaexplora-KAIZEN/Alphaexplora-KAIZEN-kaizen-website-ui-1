import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import MaterialIcon from '../../../shared/components/MaterialIcon';

export interface PointerState {
  x: number;
  y: number;
  active: boolean;
}

interface ClockFieldProps {
  pointerRef: MutableRefObject<PointerState>;
  count?: number;
  /** Tailwind text-color class applied to every clock glyph. */
  colorClassName?: string;
  /** Caps how large/opaque the field reads — smaller fields sit further back. */
  maxOpacity?: number;
  seed?: number;
}

interface ClockSeed {
  id: number;
  leftPct: number;
  topPct: number;
  size: number;
  rotate: number;
  opacity: number;
  vx: number;
  vy: number;
  spinSpeed: number;
  spinPhase: number;
}

// Same wandering feel as the "What We Do" hero's ParticleField: clocks
// drift the section under their own quiet velocity (no fixed rest point to
// spring back to), bounce off the section's edges, and get nudged away
// from the cursor when it comes near — rather than the old drift-and-spring
// physics that kept each icon tethered to one spot.
const MOUSE_DISTANCE = 170;
const PUSH_STRENGTH = 1.1;

function seedField(count: number, maxOpacity: number, seedValue: number): ClockSeed[] {
  // Deterministic pseudo-random layout (no Math.random) so the scatter is
  // stable across re-renders and server/client — just a simple hash walk.
  let seed = seedValue;
  function next() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    leftPct: 2 + next() * 96,
    topPct: 4 + next() * 92,
    size: 16 + next() * 26,
    rotate: next() * 40 - 20,
    opacity: maxOpacity * (0.45 + next() * 0.55),
    vx: (next() - 0.5) * 0.34,
    vy: (next() - 0.5) * 0.34,
    spinSpeed: (next() - 0.5) * 6,
    spinPhase: next() * Math.PI * 2,
  }));
}

/**
 * A dense field of small clock icons scattered behind the "On T.I.M.E."
 * content — now sharing the same wandering behaviour as the ambient
 * background of the "What We Do" hero (ParticleField): each clock drifts
 * continuously under its own small velocity and bounces off the section's
 * edges instead of orbiting a fixed rest point. The cursor still gently
 * pushes nearby clocks away, same as the hero's particles leaning off the
 * pointer. Physics run in refs and are applied via direct DOM transforms
 * in a single requestAnimationFrame loop, so cursor movement never
 * triggers a React re-render of the section.
 */
export default function ClockField({
  pointerRef,
  count = 48,
  colorClassName = 'text-teal-deep',
  maxOpacity = 0.62,
  seed = 42,
}: ClockFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);
  // Per-icon simulated state: offset from the icon's anchor point, and velocity.
  const state = useRef<{ x: number; y: number; vx: number; vy: number }[]>([]);
  const seeds = useMemo(() => seedField(count, maxOpacity, seed), [count, maxOpacity, seed]);

  useEffect(() => {
    state.current = seeds.map((s) => ({ x: 0, y: 0, vx: s.vx, vy: s.vy }));
  }, [seeds]);

  useEffect(() => {
    let frameId: number;
    const start = performance.now();

    function tick(now: number) {
      try {
        const container = containerRef.current;
        if (container) {
          const rect = container.getBoundingClientRect();
          const pointer = pointerRef.current;
          const t = (now - start) / 1000;

          seeds.forEach((seedItem, index) => {
            const s = state.current[index] ?? { x: 0, y: 0, vx: seedItem.vx, vy: seedItem.vy };

            // Free-roaming drift under its own velocity — no idle rest
            // point to spring back to, just like the hero's particles.
            s.x += s.vx;
            s.y += s.vy;

            const anchorX = (seedItem.leftPct / 100) * rect.width;
            const anchorY = (seedItem.topPct / 100) * rect.height;
            const half = seedItem.size / 2;
            const minX = -anchorX + half;
            const maxX = rect.width - anchorX - half;
            const minY = -anchorY + half;
            const maxY = rect.height - anchorY - half;

            if (s.x <= minX || s.x >= maxX) s.vx *= -1;
            if (s.y <= minY || s.y >= maxY) s.vy *= -1;
            s.x = Math.min(Math.max(s.x, minX), maxX);
            s.y = Math.min(Math.max(s.y, minY), maxY);

            // Cursor push: nudges the icon directly (no spring/damping),
            // same as the hero's particle-to-mouse interaction.
            const iconX = rect.left + anchorX + s.x;
            const iconY = rect.top + anchorY + s.y;
            if (pointer.active) {
              const dx = iconX - pointer.x;
              const dy = iconY - pointer.y;
              const dist = Math.hypot(dx, dy);
              if (dist < MOUSE_DISTANCE && dist > 0.01) {
                const pull = ((MOUSE_DISTANCE - dist) / MOUSE_DISTANCE) * PUSH_STRENGTH;
                s.x += (dx / dist) * pull;
                s.y += (dy / dist) * pull;
              }
            }

            state.current[index] = s;

            const el = iconRefs.current[index];
            if (el) {
              const spin = seedItem.rotate + Math.sin(t * 0.15 + seedItem.spinPhase) * seedItem.spinSpeed;
              el.style.transform = `translate3d(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px, 0) rotate(${spin.toFixed(1)}deg)`;
            }
          });
        }
      } catch {
        // Skip this frame's update; the loop below still reschedules so
        // animation resumes cleanly on the next frame.
      }

      frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [pointerRef, seeds]);

  return (
    <div ref={containerRef} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {seeds.map((seedItem, index) => (
        <span
          key={seedItem.id}
          ref={(el) => {
            iconRefs.current[index] = el;
          }}
          className={`absolute will-change-transform ${colorClassName}`}
          style={{
            left: `${seedItem.leftPct}%`,
            top: `${seedItem.topPct}%`,
            fontSize: seedItem.size,
            opacity: seedItem.opacity,
          }}
        >
          <MaterialIcon name="schedule" filled className="block" style={{ fontSize: seedItem.size }} />
        </span>
      ))}
    </div>
  );
}

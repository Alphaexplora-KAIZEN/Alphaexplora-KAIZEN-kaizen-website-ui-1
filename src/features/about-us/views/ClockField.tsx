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
}

interface ClockSeed {
  id: number;
  leftPct: number;
  topPct: number;
  size: number;
  rotate: number;
  opacity: number;
  // Mass affects how sluggishly a clock responds to the cursor's push and
  // how far it settles — heavier clocks drift less, giving the field some
  // depth instead of every icon moving identically.
  mass: number;
  // Slow independent bobbing/rotation so the field never sits perfectly
  // still even when the cursor is far away — the "floating in space" idle
  // motion, layered underneath the cursor-avoidance physics.
  driftAmpX: number;
  driftAmpY: number;
  driftSpeedX: number;
  driftSpeedY: number;
  driftPhaseX: number;
  driftPhaseY: number;
  spinSpeed: number;
}

// How far (in px) a clock reacts to the cursor, and how hard it gets
// shoved away when the cursor is right on top of it.
const REPEL_RADIUS = 150;
const PUSH_FORCE = 1.4;
// Spring pulling a clock back toward its resting drift position, and
// damping applied to velocity each frame — together these give the motion
// weight and inertia (drifts away, decelerates, eases back) instead of
// snapping straight to a target.
const SPRING_K = 0.05;
const DAMPING = 0.88;

function seedField(count: number): ClockSeed[] {
  // Deterministic pseudo-random layout (no Math.random) so the scatter is
  // stable across re-renders and server/client — just a simple hash walk.
  let seed = 42;
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
    opacity: 0.28 + next() * 0.34,
    mass: 0.6 + next() * 1.1,
    driftAmpX: 6 + next() * 14,
    driftAmpY: 6 + next() * 14,
    driftSpeedX: 0.15 + next() * 0.25,
    driftSpeedY: 0.15 + next() * 0.25,
    driftPhaseX: next() * Math.PI * 2,
    driftPhaseY: next() * Math.PI * 2,
    spinSpeed: (next() - 0.5) * 6,
  }));
}

/**
 * A dense field of small clock icons scattered behind the "On T.I.M.E."
 * content — standing in for the section's clock-punctuality theme instead
 * of plain glow blobs. Idle, each clock gently bobs and turns on its own
 * slow sine-wave path, like it's floating with no gravity holding it down.
 * When the cursor comes near, it gets pushed away with real inertia — it
 * accelerates off, decelerates, and eases back toward its floating rest
 * position once the cursor moves on — rather than snapping to a fixed
 * offset. Physics run in refs and are applied via direct DOM transforms in
 * a single requestAnimationFrame loop, so cursor movement never triggers a
 * React re-render of the section.
 */
export default function ClockField({ pointerRef, count = 48 }: ClockFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);
  // Per-icon simulated state: position offset from rest, and velocity.
  const state = useRef<{ x: number; y: number; vx: number; vy: number }[]>([]);
  const seeds = useMemo(() => seedField(count), [count]);

  useEffect(() => {
    state.current = seeds.map(() => ({ x: 0, y: 0, vx: 0, vy: 0 }));
  }, [seeds]);

  useEffect(() => {
    let frameId: number;
    const start = performance.now();

    function tick(now: number) {
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const pointer = pointerRef.current;
        const t = (now - start) / 1000;

        seeds.forEach((seed, index) => {
          const s = state.current[index] ?? { x: 0, y: 0, vx: 0, vy: 0 };

          // Idle floating rest position — a slow Lissajous-style bob, so
          // every icon quietly drifts on its own loop even with no cursor
          // nearby (the "zero gravity" feel).
          const driftX = Math.sin(t * seed.driftSpeedX + seed.driftPhaseX) * seed.driftAmpX;
          const driftY = Math.cos(t * seed.driftSpeedY + seed.driftPhaseY) * seed.driftAmpY;

          // Cursor avoidance: an outward force whose strength ramps up
          // sharply the closer the cursor gets, scaled by the icon's mass
          // so lighter icons flee faster than heavier ones. Pointer is
          // tracked in raw viewport coordinates (see Values.tsx), so the
          // icon's position needs to be expressed in the same space —
          // adding rect.left/rect.top, re-measured fresh every frame, so
          // this stays correct through scrolling and resizing too.
          const iconX = rect.left + (seed.leftPct / 100) * rect.width + s.x;
          const iconY = rect.top + (seed.topPct / 100) * rect.height + s.y;

          let ax = 0;
          let ay = 0;

          if (pointer.active) {
            const dx = iconX - pointer.x;
            const dy = iconY - pointer.y;
            const dist = Math.hypot(dx, dy);
            if (dist < REPEL_RADIUS && dist > 0.01) {
              const falloff = 1 - dist / REPEL_RADIUS;
              const force = (falloff * falloff * PUSH_FORCE) / seed.mass;
              ax += (dx / dist) * force;
              ay += (dy / dist) * force;
            }
          }

          // Spring back toward the idle drift position, plus damping —
          // this is what gives the motion inertia and weight instead of
          // a linear snap-back.
          ax += (driftX - s.x) * SPRING_K;
          ay += (driftY - s.y) * SPRING_K;

          s.vx = (s.vx + ax) * DAMPING;
          s.vy = (s.vy + ay) * DAMPING;
          s.x += s.vx;
          s.y += s.vy;
          state.current[index] = s;

          const el = iconRefs.current[index];
          if (el) {
            const spin = seed.rotate + Math.sin(t * 0.2 + seed.driftPhaseX) * seed.spinSpeed;
            el.style.transform = `translate3d(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px, 0) rotate(${spin.toFixed(1)}deg)`;
          }
        });
      }

      frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [pointerRef, seeds]);

  return (
    <div ref={containerRef} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {seeds.map((seed, index) => (
        <span
          key={seed.id}
          ref={(el) => {
            iconRefs.current[index] = el;
          }}
          className="absolute text-gold-deep will-change-transform"
          style={{
            left: `${seed.leftPct}%`,
            top: `${seed.topPct}%`,
            fontSize: seed.size,
            opacity: seed.opacity,
          }}
        >
          <MaterialIcon name="schedule" filled className="block" style={{ fontSize: seed.size }} />
        </span>
      ))}
    </div>
  );
}

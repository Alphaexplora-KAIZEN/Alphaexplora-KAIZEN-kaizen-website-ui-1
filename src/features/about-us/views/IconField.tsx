import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import MaterialIcon from '../../../shared/components/MaterialIcon';

export interface PointerState {
  x: number;
  y: number;
  active: boolean;
}

interface IconFieldProps {
  pointerRef: MutableRefObject<PointerState>;
  count?: number;
  /** Material Symbols glyph name, e.g. "schedule", "trending_up", "call". */
  icon: string;
  /** Tailwind text-color class applied to every glyph in the field. */
  colorClassName?: string;
  /** Caps how large/opaque the field reads — smaller fields sit further back. */
  maxOpacity?: number;
  seed?: number;
}

interface FieldSeed {
  id: number;
  leftPct: number;
  topPct: number;
  size: number;
  rotate: number;
  opacity: number;
  mass: number;
  driftAmpX: number;
  driftAmpY: number;
  driftSpeedX: number;
  driftSpeedY: number;
  driftPhaseX: number;
  driftPhaseY: number;
  spinSpeed: number;
}

const REPEL_RADIUS = 190;
const PUSH_FORCE = 2.6;
const SPRING_K = 0.02;
const DAMPING = 0.9;

function seedField(count: number, maxOpacity: number, seedValue: number): FieldSeed[] {
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
    size: 14 + next() * 24,
    rotate: next() * 40 - 20,
    opacity: maxOpacity * (0.35 + next() * 0.65),
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
 * A dense field of small icons scattered behind a section's content —
 * standing in for that section's theme instead of plain glow blobs (born
 * as the "On T.I.M.E." clock field, now themeable per section: growth
 * arrows behind the Story, phones/mail behind Contact). Idle, each icon
 * gently bobs and turns on its own slow sine-wave path, like it's floating
 * with no gravity holding it down. When the cursor comes near, it gets
 * pushed away with real inertia — accelerates off, decelerates, and eases
 * back toward its floating rest position once the cursor moves on — rather
 * than snapping to a fixed offset. Physics run in refs and are applied via
 * direct DOM transforms in a single requestAnimationFrame loop, so cursor
 * movement never triggers a React re-render of the section.
 */
export default function IconField({
  pointerRef,
  count = 48,
  icon,
  colorClassName = 'text-teal',
  maxOpacity = 0.12,
  seed = 42,
}: IconFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const state = useRef<{ x: number; y: number; vx: number; vy: number }[]>([]);
  const seeds = useMemo(() => seedField(count, maxOpacity, seed), [count, maxOpacity, seed]);

  useEffect(() => {
    state.current = seeds.map(() => ({ x: 0, y: 0, vx: 0, vy: 0 }));
  }, [seeds]);

  useEffect(() => {
    let frameId: number;
    const start = performance.now();

    function tick(now: number) {
      // A stray exception on any single frame (e.g. a transient 0-size rect
      // during a layout thrash) used to break the recursive
      // requestAnimationFrame chain entirely — the loop would silently stop
      // and never resume, leaving the field frozen or, combined with other
      // issues, gone for good. Catching per-frame errors here means the
      // field always keeps animating on the next frame no matter what.
      try {
        const container = containerRef.current;
        if (container) {
          const rect = container.getBoundingClientRect();
          const pointer = pointerRef.current;
          const t = (now - start) / 1000;

          seeds.forEach((s0, index) => {
            const s = state.current[index] ?? { x: 0, y: 0, vx: 0, vy: 0 };

            const driftX = Math.sin(t * s0.driftSpeedX + s0.driftPhaseX) * s0.driftAmpX;
            const driftY = Math.cos(t * s0.driftSpeedY + s0.driftPhaseY) * s0.driftAmpY;

            const iconX = rect.left + (s0.leftPct / 100) * rect.width + s.x;
            const iconY = rect.top + (s0.topPct / 100) * rect.height + s.y;

            let ax = 0;
            let ay = 0;

            if (pointer.active) {
              const dx = iconX - pointer.x;
              const dy = iconY - pointer.y;
              const dist = Math.hypot(dx, dy);
              if (dist < REPEL_RADIUS && dist > 0.01) {
                const falloff = 1 - dist / REPEL_RADIUS;
                const force = (falloff * falloff * PUSH_FORCE) / s0.mass;
                ax += (dx / dist) * force;
                ay += (dy / dist) * force;
              }
            }

            ax += (driftX - s.x) * SPRING_K;
            ay += (driftY - s.y) * SPRING_K;

            s.vx = (s.vx + ax) * DAMPING;
            s.vy = (s.vy + ay) * DAMPING;
            s.x += s.vx;
            s.y += s.vy;
            state.current[index] = s;

            const el = iconRefs.current[index];
            if (el) {
              const spin = s0.rotate + Math.sin(t * 0.2 + s0.driftPhaseX) * s0.spinSpeed;
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
      {seeds.map((s0, index) => (
        <span
          key={s0.id}
          ref={(el) => {
            iconRefs.current[index] = el;
          }}
          className={`absolute will-change-transform ${colorClassName}`}
          style={{
            left: `${s0.leftPct}%`,
            top: `${s0.topPct}%`,
            fontSize: s0.size,
            opacity: s0.opacity,
          }}
        >
          <MaterialIcon name={icon} filled className="block" style={{ fontSize: s0.size }} />
        </span>
      ))}
    </div>
  );
}

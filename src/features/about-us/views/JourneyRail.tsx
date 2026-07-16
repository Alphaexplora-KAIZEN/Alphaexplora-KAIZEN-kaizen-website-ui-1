import { type RefObject } from 'react';
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';

interface JourneyRailProps {
  targetRef: RefObject<HTMLElement | null>;
  labels: string[];
}

/** One waypoint label — its own component so its color transform is a
 * top-level hook call within a stable component instance, not inside a
 * loop in the parent's render. */
function RailLabel({ label, atPct, progress }: { label: string; atPct: number; progress: MotionValue<number> }) {
  const color = useTransform(
    progress,
    [Math.max(atPct / 100 - 0.06, 0), atPct / 100],
    ['rgba(148,163,184,0.5)', 'rgba(217,167,91,1)'],
  );

  return (
    <div className="absolute left-5 -translate-y-1/2 whitespace-nowrap" style={{ top: `${atPct}%` }}>
      <motion.span className="font-label-bold text-[11px] uppercase tracking-[0.16em]" style={{ color }}>
        {label}
      </motion.span>
    </div>
  );
}

/**
 * A fixed rail running down the left edge of the viewport for the length of
 * the About Us page — the "On T.I.M.E." line from Values, generalized into
 * the page's own spine. A gold fill and a traveling KaizenMark-style dot
 * track overall scroll progress continuously (not per-section triggers),
 * so the whole page reads as one smooth, connected journey rather than a
 * stack of independently-animating blocks. Labels tick from muted to gold
 * as the dot passes them. Desktop only — on narrow screens the space isn't
 * there to spare, and each section's own reveal motion carries the page.
 */
export default function JourneyRail({ targetRef, labels }: JourneyRailProps) {
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 24, mass: 0.4 });
  const fillHeight = useTransform(progress, [0, 1], ['0%', '100%']);
  const dotTop = useTransform(progress, [0, 1], ['0%', '100%']);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-8 top-1/2 z-30 hidden -translate-y-1/2 xl:block"
      style={{ height: '46vh' }}
    >
      <div className="relative h-full w-px bg-outline-variant/25">
        <motion.div className="absolute left-0 top-0 w-px bg-gradient-to-b from-gold to-teal" style={{ height: fillHeight }} />

        <motion.div
          className="absolute -left-[5px] h-[11px] w-[11px] rounded-full bg-gold shadow-glow ring-4 ring-background"
          style={{ top: dotTop, translateY: '-50%' }}
        />

        {labels.map((label, index) => (
          <RailLabel
            key={label}
            label={label}
            atPct={(index / Math.max(labels.length - 1, 1)) * 100}
            progress={progress}
          />
        ))}
      </div>
    </div>
  );
}

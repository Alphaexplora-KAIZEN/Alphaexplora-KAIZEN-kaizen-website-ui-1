import { useEffect, useId, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeUp, staggerContainer } from '../../../shared/utils/constants';
import Section from '../../../shared/components/Section';
import MaterialIcon from '../../../shared/components/MaterialIcon';
import ParticleField from './ParticleField';

const HERO_ID = 'wwd-page-intro';
const HEADLINE = 'What We Do At';
const HEADLINE_TYPOGRAPHY =
  'font-display-lg text-[clamp(18px,4.4vw,56px)] font-bold leading-[1.05] tracking-tight uppercase whitespace-nowrap';

const headlineStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.05 },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: '0.9em', rotateX: -70, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const BRUSH_RADIUS = 20; // "20px brush" — the reveal circle painted at the cursor
const BRUSH_SPACING = 4; // min px between dabs so a slow drag still reads as a continuous stroke
const MELT_SWEEP_MS = 1400; // time for the melt line to travel from the top of the headline to the bottom
const MELT_FADE_MS = 480; // how long each dab takes to melt away once the sweep line reaches it
const MELT_DRIP_PX = 10; // how far a dab drifts downward as it dissolves, like it's dripping
const MAX_DABS = 500; // safety cap so a long, wiggly stroke can't grow the mask forever

type Dab = { id: number; x: number; y: number };

/**
 * Wraps the real (animated) headline and overlays a second, teal-colored
 * copy of the same text, revealed only through an SVG mask built from
 * circles ("dabs") dropped wherever the cursor moves over it — a small
 * brush (BRUSH_RADIUS) that paints the letters teal as it passes over them. Leaving the
 * headline starts a top-to-bottom melt: each dab shrinks, drifts slightly
 * downward, and softens with a touch of blur as it fades, with a delay
 * proportional to its vertical position — so the teal reads as dripping
 * downward rather than all vanishing at once. Re-entering mid-melt cancels
 * the fade and resumes painting.
 */
function BrushPaintedHeadline({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskId = useId();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [dabs, setDabs] = useState<Dab[]>([]);
  const [melting, setMelting] = useState(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const nextIdRef = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setMelting(false);

    const last = lastPointRef.current;
    if (last) {
      const dx = x - last.x;
      const dy = y - last.y;
      if (Math.sqrt(dx * dx + dy * dy) < BRUSH_SPACING) return;
    }
    lastPointRef.current = { x, y };

    nextIdRef.current += 1;
    const id = nextIdRef.current;
    setDabs((prev) => {
      const next = [...prev, { id, x, y }];
      return next.length > MAX_DABS ? next.slice(next.length - MAX_DABS) : next;
    });
  };

  const handleLeave = () => {
    lastPointRef.current = null;
    setMelting(true);
  };

  const handleDabFaded = (id: number) => {
    setDabs((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div ref={containerRef} className="relative inline-block" onMouseMove={handleMove} onMouseLeave={handleLeave}>
      {children}

      {size.width > 0 && size.height > 0 && (
        <>
          <svg width="0" height="0" className="absolute" aria-hidden="true">
            <defs>
              <mask id={maskId} maskUnits="userSpaceOnUse" x={0} y={0} width={size.width} height={size.height}>
                {dabs.map((dab) => (
                  <motion.circle
                    key={dab.id}
                    cx={dab.x}
                    r={BRUSH_RADIUS}
                    fill="#fff"
                    initial={{ opacity: 1, cy: dab.y, scale: 1, filter: 'blur(0px)' }}
                    animate={
                      melting
                        ? { opacity: 0, cy: dab.y + MELT_DRIP_PX, scale: 0.35, filter: 'blur(2px)' }
                        : { opacity: 1, cy: dab.y, scale: 1, filter: 'blur(0px)' }
                    }
                    style={{ originX: `${dab.x}px`, originY: `${dab.y}px` }}
                    transition={
                      melting
                        ? {
                            duration: MELT_FADE_MS / 1000,
                            delay: (dab.y / size.height) * (MELT_SWEEP_MS / 1000),
                            ease: [0.4, 0, 1, 1],
                          }
                        : { duration: 0 }
                    }
                    onAnimationComplete={() => {
                      if (melting) handleDabFaded(dab.id);
                    }}
                  />
                ))}
              </mask>
            </defs>
          </svg>

          <div
            aria-hidden="true"
            className={`${HEADLINE_TYPOGRAPHY} pointer-events-none absolute inset-0 text-teal`}
            style={{ mask: `url(#${maskId})`, WebkitMask: `url(#${maskId})` }}
          >
            {HEADLINE.split(' ').map((word, i) => (
              <span key={`${word}-${i}`} className="inline-block mr-[0.28em] last:mr-0">
                {word}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const logoVariants = {
  hidden: { opacity: 0, scale: 0.6, y: 44, rotate: -5, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotate: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring' as const, stiffness: 110, damping: 15, mass: 0.8, delay: 0.4 },
  },
};

/**
 * The page's opening statement. Previously just a badge, headline, and
 * subheading floating on the plain page background — every other page on
 * the site opens with a proper hero (a photo, a mesh backdrop, something to
 * look at), so this felt thin by comparison. It now sits on the same
 * grid + brass mesh backdrop the homepage hero uses, closing with the
 * brand logo directly beneath the headline. The headline reveals
 * word-by-word with a slow blur-to-focus tilt (long duration, soft
 * ease-out curve) and the logo follows with a low-stiffness, low-damping
 * spring — a big, unmistakable settle rather than a quick snap. Its teal
 * glow only loops while actively hovered, rather than breathing on a
 * permanent timer. The headline itself gets painted teal by the cursor,
 * like a small brush, via BrushPaintedHeadline — moving the mouse over it
 * reveals a teal copy of the text through an animated mask, and leaving it
 * triggers a top-to-bottom melt where the paint fades away starting from
 * the top. The backdrop carries a canvas of drifting, connecting particles
 * (ParticleField) over the dialed-back mesh (bg-kaizen-mesh-wwd-hero) so the
 * bottom-right glow stays subtle alongside the particles and logo glow. A
 * scroll-down button closes it out, nudging visitors to whatever section
 * follows next in the page (rather than a specific service, so this keeps
 * working if the page order changes).
 */
export default function PageIntro() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const handleScrollToNext = () => {
    document.getElementById(HERO_ID)?.nextElementSibling?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Section
      id={HERO_ID}
      className="scroll-mt-[var(--wwd-sticky-offset)] relative overflow-hidden flex flex-col justify-center min-h-[calc(100dvh-5rem)] pt-24 pb-10 md:pt-16 md:pb-12"
    >
      <div className="absolute inset-0 bg-kaizen-mesh-wwd-hero pointer-events-none" />

      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <ParticleField />
      </div>

      <div className="max-w-container-max-width mx-auto px-6 relative">
        <motion.div
          ref={sectionRef}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="flex flex-col items-center text-center"
        >
          <BrushPaintedHeadline>
            <motion.h1
              variants={headlineStagger}
              aria-label={HEADLINE}
              style={{ perspective: 400 }}
              className={`${HEADLINE_TYPOGRAPHY} text-on-background mb-2`}
            >
              {HEADLINE.split(' ').map((word, i) => (
                <motion.span key={`${word}-${i}`} variants={wordVariants} className="inline-block mr-[0.28em] last:mr-0">
                  {word}
                </motion.span>
              ))}
            </motion.h1>
          </BrushPaintedHeadline>

          <motion.div variants={logoVariants} className="relative">
            <motion.img
              src="/assets/logo_with_name_white_Green.png"
              alt="Kaizen"
              className="w-full max-w-lg sm:max-w-2xl md:max-w-3xl h-auto cursor-pointer"
              whileHover={{
                filter: [
                  'drop-shadow(0 0 0px rgba(47,205,168,0))',
                  'drop-shadow(0 0 38px rgba(47,205,168,0.55))',
                  'drop-shadow(0 0 0px rgba(47,205,168,0))',
                ],
                scale: [1, 1.035, 1],
              }}
              transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>

          <motion.button
            type="button"
            variants={fadeUp}
            onClick={handleScrollToNext}
            aria-label="Scroll to the next section"
            className="group mt-10 md:mt-12 inline-flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant bg-surface/60 backdrop-blur-sm text-on-surface-variant transition-colors duration-300 hover:text-teal hover:border-teal/50 focus-ring animate-bounce"
          >
            <MaterialIcon
              name="keyboard_arrow_down"
              className="text-2xl transition-transform duration-300 group-hover:translate-y-0.5"
            />
          </motion.button>
        </motion.div>
      </div>
    </Section>
  );
}

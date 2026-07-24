import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'framer-motion';
import Section from '../../../shared/components/Section';
import MaterialIcon from '../../../shared/components/MaterialIcon';

export interface ServiceHighlight {
  id: string;
  icon: string;
  label: string;
}

export interface ServiceNotebookEntry {
  id: string;
  title: string;
  description: string;
  image: { src: string; alt: string };
  highlights: ServiceHighlight[];
  ctaLabel: string;
  onCtaClick: () => void;
  theme: {
    accent: string;
    bar?: string;
  };
}

interface ServiceNotebookProps {
  entries: ServiceNotebookEntry[];
  activeId: string;
  onSelect: (id: string) => void;
}

// A single, gentle ease used everywhere so every piece of the transition
// feels like it belongs to the same motion — no mixed easing, no bounce.
const EASE: [number, number, number, number] = [0.32, 0.72, 0, 1];
const SWAP_DURATION = 0.6;
const SWIPE_THRESHOLD = 70;

/**
 * All three services on one screen. The photo box and the copy box
 * physically swap sides on desktop every time you move to a new service —
 * Framer Motion's layout animation glides each box smoothly from its old
 * position to its new one, so the two of them visibly cross paths rather
 * than snapping. At the same time, the content inside each box softly
 * crossfades to the new service. Mobile always stacks photo above copy
 * (no swap, just the crossfade) since there's nowhere for a swap to go
 * in a single column. Content inside the copy panel (eyebrow, heading,
 * description, highlights, CTA) fades and lifts in with a light stagger
 * once it settles. Navigation lives entirely in QuickNav above (plus
 * swipe and the arrow keys) rather than duplicated controls here.
 * `prefers-reduced-motion` shortens all of this to a near-instant fade
 * and turns off the swap animation.
 */
export default function ServiceNotebook({ entries, activeId, onSelect }: ServiceNotebookProps) {
  const reduceMotion = useReducedMotion();
  const currentIndex = Math.max(
    0,
    entries.findIndex((entry) => entry.id === activeId),
  );

  // The photo and copy swap which side they're on every single time the
  // active service changes — a toggle that flips on every change,
  // regardless of whether you moved to the next tab or jumped straight
  // to one from QuickNav.
  const [imageOnRight, setImageOnRight] = useState(false);
  const [seenId, setSeenId] = useState(activeId);
  if (activeId !== seenId) {
    setSeenId(activeId);
    setImageOnRight((prev) => !prev);
  }

  function goTo(index: number) {
    const clamped = (index + entries.length) % entries.length;
    onSelect(entries[clamped].id);
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowRight') goTo(currentIndex + 1);
      if (event.key === 'ArrowLeft') goTo(currentIndex - 1);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, entries]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -SWIPE_THRESHOLD) goTo(currentIndex + 1);
    else if (info.offset.x > SWIPE_THRESHOLD) goTo(currentIndex - 1);
  }

  const active = entries[currentIndex];
  const swapTransition = { duration: reduceMotion ? 0 : SWAP_DURATION, ease: EASE };

  // Content stagger: once the copy has crossfaded in, its pieces reveal
  // one after another rather than popping in together.
  const contentContainerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.06,
        delayChildren: reduceMotion ? 0 : 0.18,
      },
    },
  };
  const contentItemVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0.15 : 0.45, ease: EASE },
    },
  };

  return (
    <Section
      id={active.id}
      className="scroll-mt-[var(--wwd-sticky-offset)] relative min-h-[calc(100dvh-5rem)] lg:h-[calc(100dvh-5rem)] flex flex-col overflow-hidden"
    >
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Showing {active.title}
      </div>

      <div className="relative flex-1 grid grid-cols-1 lg:grid-cols-2 items-stretch">
        {/* The photo box. On desktop, Framer Motion's layout animation
            glides it smoothly to whichever side it belongs on this time
            around; on mobile it always stays on top. */}
        <motion.div
          layout
          transition={swapTransition}
          className={`relative aspect-[4/3] lg:aspect-auto lg:h-full overflow-hidden ${
            imageOnRight ? 'lg:order-2' : 'lg:order-1'
          }`}
        >
          <AnimatePresence initial={false} mode="sync">
            <motion.div
              key={active.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: reduceMotion ? 0.15 : 0.5, ease: EASE, delay: reduceMotion ? 0 : 0.1 } }}
              exit={{ opacity: 0, transition: { duration: reduceMotion ? 0.1 : 0.3, ease: EASE } }}
              className="absolute inset-0"
            >
              <img
                src={active.image.src}
                alt={active.image.alt}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 via-navy-deep/5 to-transparent" />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* The copy box. Glides to whichever side the photo isn't on,
            in lockstep with it, same duration, same ease. */}
        <motion.div
          layout
          transition={swapTransition}
          className={`relative min-h-[600px] sm:min-h-[640px] lg:min-h-0 lg:h-full overflow-hidden ${
            imageOnRight ? 'lg:order-1' : 'lg:order-2'
          }`}
        >
          {/* A thin accent line along the seam between photo and copy,
              tinted to the active service's color. */}
          <div
            aria-hidden="true"
            className={`pointer-events-none lg:hidden absolute left-0 right-0 top-0 h-px z-20 opacity-40 ${active.theme.bar ?? 'bg-teal'}`}
          />
          <div
            aria-hidden="true"
            className={`pointer-events-none hidden lg:block absolute left-0 top-0 bottom-0 w-px z-20 opacity-40 ${active.theme.bar ?? 'bg-teal'}`}
          />

          <AnimatePresence initial={false} mode="sync">
            <motion.div
              key={active.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: reduceMotion ? 0.15 : 0.5, ease: EASE, delay: reduceMotion ? 0 : 0.1 } }}
              exit={{ opacity: 0, transition: { duration: reduceMotion ? 0.1 : 0.3, ease: EASE } }}
              style={{ touchAction: 'pan-y' }}
              drag={reduceMotion ? false : 'x'}
              dragElastic={0.12}
              dragConstraints={{ left: 0, right: 0 }}
              dragTransition={{ bounceStiffness: 400, bounceDamping: 32 }}
              onDragEnd={handleDragEnd}
              className={`absolute inset-0 flex flex-col justify-center overflow-hidden px-6 py-14 sm:px-10 md:px-16 lg:py-16 xl:px-20 shadow-2xl shadow-black/20 ${
                reduceMotion ? '' : 'cursor-grab active:cursor-grabbing'
              }`}
            >
              <div className="pointer-events-none absolute inset-0 bg-kaizen-mesh" />
              <div
                className={`pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl opacity-10 ${active.theme.bar ?? 'bg-teal'}`}
              />

              <motion.div
                className="relative z-10"
                variants={contentContainerVariants}
                initial="hidden"
                animate="show"
              >
                <motion.span
                  variants={contentItemVariants}
                  className={`inline-flex items-center gap-2 font-mono text-[13px] uppercase tracking-[0.3em] mb-5 font-bold ${active.theme.accent}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${active.theme.bar ?? 'bg-teal'}`} />
                  Kaizen Specialty
                </motion.span>

                <motion.h2
                  variants={contentItemVariants}
                  className="font-display-lg text-[38px] sm:text-[46px] md:text-[52px] xl:text-[58px] font-bold leading-[1.05] tracking-tight text-on-surface mb-5"
                >
                  {active.title}
                </motion.h2>

                <motion.p
                  variants={contentItemVariants}
                  className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-lg text-justify"
                >
                  {active.description}
                </motion.p>

                <ul className="space-y-0 mb-8 border-t border-outline-variant max-w-lg">
                  {active.highlights.map((item) => (
                    <motion.li
                      key={item.id}
                      variants={contentItemVariants}
                      className="flex items-center gap-4 py-3.5 border-b border-outline-variant"
                    >
                      <MaterialIcon name={item.icon} filled className={`text-2xl shrink-0 ${active.theme.accent}`} />
                      <span className="font-body-lg text-body-lg text-on-surface">{item.label}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.button
                  variants={contentItemVariants}
                  type="button"
                  onClick={active.onCtaClick}
                  className="group/link inline-flex items-center gap-2.5 font-label-bold text-lg text-on-surface hover:text-teal transition-colors focus-ring w-fit mb-4"
                >
                  {active.ctaLabel}
                  <MaterialIcon
                    name="arrow_forward"
                    filled
                    className="text-2xl transition-transform duration-300 group-hover/link:translate-x-1"
                  />
                </motion.button>

                <motion.div variants={contentItemVariants} className={`h-px w-14 ${active.theme.bar ?? 'bg-teal'}`} />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </Section>
  );
}

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeUp, staggerContainer } from '../../../shared/utils/constants';
import Section from '../../../shared/components/Section';
import MaterialIcon from '../../../shared/components/MaterialIcon';
import IconField, { type PointerState } from './IconField';
import type { CoreValue } from '../../../shared/models/types';

interface ValuesProps {
  coreValues: CoreValue[];
}

const VALUE_ICON: Record<string, string> = {
  trust: 'verified_user',
  integrity: 'handshake',
  mastery: 'workspace_premium',
  efficiency: 'bolt',
};

const VALUE_LETTER: Record<string, string> = {
  trust: 'T',
  integrity: 'I',
  mastery: 'M',
  efficiency: 'E',
};

// How long the line takes to travel from one waypoint to the next, and how
// long it then pauses — tick lit, line stopped — before setting off again.
const TRAVEL_MS = 1500;
const HOLD_MS = 1500;

// Single shared curve + duration for every "lit" state change (tick dot,
// card border/glow, icon circle) so they animate in lockstep instead of
// each drifting slightly out of sync with its own timing.
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const LIT_TRANSITION = { duration: 0.4, ease: EASE };

/**
 * "The Values Behind Every Job" — redesigned as a row of ledger cards along
 * a T·I·M·E circuit rail, matching the rest of the About page's dark
 * "Ledger & Brass" theme instead of standing out as an inverted light
 * section.
 *
 * WHY THE REDESIGN: the previous version flipped this section alone to a
 * light "inverse" background (every other section on this page — Story,
 * Contact — inherits the site's dark navy background). That single choice
 * was the root cause of three separate bugs patched before this rewrite:
 * a floating light backdrop that needed CSS stacking-context workarounds
 * to stay visible, description text that was hard to read against a busy
 * icon field, and a translucent white panel bright enough to read as
 * "blinding" against the rest of the dark page. Matching the page's actual
 * dark theme and giving each value its own solid card (rather than relying
 * on a single big translucent panel for contrast) resolves all three at
 * the root instead of one more layer of patching.
 *
 * A rail above the cards travels to each waypoint in sequence, lighting a
 * tick mark and its card together, holding for a beat, then moving to the
 * next — until the whole word is lit, then it dims and loops. This rail,
 * its tick marks, the card border/glow, and the letter-circle glow all
 * animate on one shared duration/easing curve (`LIT_TRANSITION`) and the
 * rail now renders identically on mobile and desktop — previously mobile
 * had its own vertical rail that sat in a zero-height wrapper and never
 * actually appeared, so cards there lit up with no traveling indicator at
 * all. The dense field of small clock icons behind everything (this
 * section's "On T.I.M.E." theme) drifts away from the cursor, now at a low
 * enough opacity to read as ambient texture rather than compete with the
 * cards.
 */
export default function Values({ coreValues }: ValuesProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2, margin: '-80px' });

  // Raw VIEWPORT pixel pointer position, read directly by IconField's
  // animation loop rather than through React state. Deliberately not
  // pre-offset against any particular element's rect here — the listener
  // sits on a `display:contents` wrapper (so it doesn't disturb layout),
  // which has no box of its own to measure. IconField converts these to
  // section-local coordinates itself using its own container's rect,
  // which it already re-measures every frame.
  const pointerRef = useRef<PointerState>({ x: 0, y: 0, active: false });

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    // Scrolling the page while the cursor sits still causes most browsers
    // to re-dispatch a pointer move at the SAME screen coordinates (so
    // hover states stay correct as content slides underneath it). That
    // synthetic event has zero movementX/movementY — the pointer didn't
    // actually move, the page did. Treating it as real cursor motion made
    // the whole clock field think the cursor had just landed on top of a
    // dozen icons at once, shoving them away in a burst. Skipping
    // zero-movement events means the field only reacts to genuine cursor
    // motion.
    if (event.movementX === 0 && event.movementY === 0) return;
    pointerRef.current = {
      x: event.clientX,
      y: event.clientY,
      active: true,
    };
  }

  function handlePointerLeave() {
    pointerRef.current.active = false;
  }

  // T · I · M · E boot-up sequence. `fillTarget` drives how far the rail has
  // grown (updates immediately, so it starts traveling right away);
  // `litCount` drives which ticks/cards are lit, and only updates once the
  // rail has finished traveling to that waypoint — so a tick lights exactly
  // when the rail arrives, then both hold for HOLD_MS before the next leg.
  const [fillTarget, setFillTarget] = useState(0);
  const [litCount, setLitCount] = useState(0);

  useEffect(() => {
    if (!isInView) return undefined;
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    function travelTo(step: number) {
      if (cancelled) return;
      if (step > coreValues.length) {
        // Whole word is lit and has held for a beat — rather than dimming
        // right here (which stopped the rail short, at the last tick's
        // center), let it keep traveling to the very end of the line first.
        setFillTarget(step);
        timeoutId = setTimeout(() => {
          if (cancelled) return;
          // Rail has reached the end — hold there, then dim everything and,
          // after a travel-length breath, start the sequence over.
          timeoutId = setTimeout(() => {
            if (cancelled) return;
            setFillTarget(0);
            setLitCount(0);
            timeoutId = setTimeout(() => travelTo(1), TRAVEL_MS);
          }, HOLD_MS);
        }, TRAVEL_MS);
        return;
      }
      setFillTarget(step);
      timeoutId = setTimeout(() => {
        if (cancelled) return;
        setLitCount(step);
        timeoutId = setTimeout(() => travelTo(step + 1), HOLD_MS);
      }, TRAVEL_MS);
    }

    travelTo(1);
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [isInView, coreValues.length]);

  // Each waypoint tick sits at the CENTER of its grid column (e.g. with 4
  // equal columns: 12.5%, 37.5%, 62.5%, 87.5%) — not at the column's edge
  // (25%, 50%, 75%, 100%). Filling to `step / length` overshoots half a
  // column past every tick before stopping. Filling to the tick's own
  // center instead makes the rail stop exactly on it.
  const fillPercent =
    coreValues.length > 0 && fillTarget > 0
      ? fillTarget > coreValues.length
        ? 100
        : ((fillTarget - 0.5) / coreValues.length) * 100
      : 0;

  return (
    <Section
      divider
      className="relative isolate overflow-hidden min-h-screen flex flex-col justify-center py-section-gap-mobile md:py-section-gap-desktop bg-navy-deep"
    >
      {/* Pointer tracking lives on THIS wrapper, which is an ANCESTOR of
          both the clock backdrop and the content column below, so pointer
          moves anywhere in the section — including over the cards —
          bubble up to it (a `display:contents` wrapper doesn't affect
          event bubbling, only layout/boxes). */}
      <div onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave} className="contents">
        {/* Full-bleed backdrop — a scattered field of clock icons that
            drift away from the cursor. Covers the entire section
            (including its own top/bottom padding), so it runs edge to edge
            right up to the section's divider hairlines. Purely decorative
            (aria-hidden), sits behind everything else. `isolate` on the
            Section root above pins this backdrop's stacking context to
            THIS section permanently, regardless of what Framer Motion is
            doing to the section's transform during its scroll reveal. */}
        <div className="absolute inset-0 -z-10">
          <IconField
            pointerRef={pointerRef}
            count={70}
            icon="schedule"
            colorClassName="text-white"
            maxOpacity={0.22}
            seed={42}
          />
        </div>

        <div className="max-w-container-max-width mx-auto px-6 relative">
          <motion.div
            ref={sectionRef}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeUp}
            className="max-w-2xl mb-16 md:mb-20 space-y-3"
          >
            <span className="inline-flex items-center gap-2 font-label-bold text-label-bold text-teal uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-teal" />
              On T.I.M.E.
            </span>
            <h2 className="font-headline-md text-[34px] md:text-[44px] font-bold leading-[1.1] text-on-surface">
              The Values Behind Every Job
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="relative"
          >
            {/* Circuit rail — one horizontal rail across every breakpoint (previously
                mobile had its own vertical rail, which sat in a zero-height wrapper
                and never actually rendered — cards there just lit up with no
                traveling indicator). A single rail means mobile and desktop now
                show the exact same "boot-up" animation. */}
            <div className="relative h-10 mb-8">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-outline-variant/50" />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-px bg-teal transition-[width] ease-linear"
                style={{ width: `${fillPercent}%`, transitionDuration: `${TRAVEL_MS}ms` }}
              />
              {coreValues.map((value, index) => (
                <motion.span
                  key={value.id}
                  className="absolute top-1/2 h-2.5 w-2.5 rounded-full border border-teal/60 bg-navy-deep"
                  style={{ left: `${((index + 0.5) / coreValues.length) * 100}%` }}
                  animate={{
                    scale: index < litCount ? 1.4 : 1,
                    backgroundColor: index < litCount ? 'rgba(47,205,168,1)' : 'rgba(5,13,24,1)',
                    x: '-50%',
                    y: '-50%',
                  }}
                  transition={LIT_TRANSITION}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
              {coreValues.map((value, index) => {
                const isLit = index < litCount;
                return (
                  <motion.div
                    key={value.id}
                    variants={fadeUp}
                    custom={index * 0.1}
                    className="relative h-full"
                  >
                  <motion.div
                    animate={{
                      borderColor: isLit ? 'rgba(47,205,168,0.55)' : 'rgba(35,55,79,1)',
                      boxShadow: isLit
                        ? '0 0 0 1px rgba(47,205,168,0.15), 0 16px 32px -12px rgba(47,205,168,0.25)'
                        : '0 0 0 0 rgba(47,205,168,0)',
                    }}
                    transition={LIT_TRANSITION}
                    className="relative flex h-full md:flex-col items-start md:items-center gap-5 md:gap-0 md:text-center rounded-2xl border bg-surface-container p-7 md:p-9"
                  >
                    <motion.div
                      animate={{
                        scale: isLit ? 1.08 : 1,
                        borderColor: isLit ? 'rgba(47,205,168,1)' : 'rgba(47,205,168,0.35)',
                        boxShadow: isLit
                          ? '0 0 0 1px rgba(47,205,168,0.4), 0 0 24px 4px rgba(47,205,168,0.45)'
                          : '0 0 0 0 rgba(47,205,168,0)',
                      }}
                      transition={LIT_TRANSITION}
                      className="relative z-10 flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 bg-navy-deep md:mb-6 font-mono text-3xl text-teal"
                    >
                      {VALUE_LETTER[value.id] ?? '•'}
                      <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-teal-soft text-teal ring-4 ring-surface-container">
                        <MaterialIcon name={VALUE_ICON[value.id] ?? 'star'} filled className="text-[15px]" />
                      </span>
                    </motion.div>
                    <div className="pt-1 md:pt-0">
                      <p className="font-label-bold text-xl text-on-surface mb-2">{value.title}</p>
                      <p className="font-body-md text-body-md md:text-[17px] text-on-surface-variant md:max-w-[230px] md:mx-auto text-justify">
                        {value.description}
                      </p>
                    </div>
                  </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

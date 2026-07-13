import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useMotionTemplate, useSpring } from 'framer-motion';
import { fadeUp, staggerContainer } from '../../../shared/utils/constants';
import Section from '../../../shared/components/Section';
import MaterialIcon from '../../../shared/components/MaterialIcon';
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

// How long each letter holds the spotlight before the next one lights up,
// and how long the fully-lit word pauses before the sequence resets.
const STEP_MS = 700;
const RESET_PAUSE_MS = 900;

/**
 * "The Values Behind Every Job" as a roadmap: T · I · M · E sit as
 * lettered waypoints strung along a single line, icon badges pinned to
 * each one, with the title and description hanging below (to the side
 * on mobile, where the line turns vertical). Where the previous column
 * layout separated the four values with hairline rules, this version
 * makes the acronym read as one continuous path — a standard the team
 * moves along on every job, not four unrelated boxes.
 *
 * Two extra touches make the section feel alive rather than static:
 *
 * 1. A soft radial glow tracks the pointer across the section (desktop)
 *    or drifts on its own (touch), so the brass-mesh backdrop responds
 *    to the visitor instead of sitting inert.
 * 2. The T · I · M · E path "boots up" on a loop — each letter lights
 *    gold and the connecting line fills in behind it, one waypoint at a
 *    time, until the whole word is lit, then everything dims and the
 *    sequence starts over — spelling out the standard the way you'd
 *    watch a status board come online.
 */
export default function Values({ coreValues }: ValuesProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2, margin: '-80px' });

  // Pointer-reactive glow — follows the cursor within the section, and
  // drifts gently on its own so the background never feels dead on
  // touch devices that never fire pointermove.
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(35);
  const springX = useSpring(glowX, { stiffness: 40, damping: 20 });
  const springY = useSpring(glowY, { stiffness: 40, damping: 20 });
  const glowBackground = useMotionTemplate`radial-gradient(520px circle at ${springX}% ${springY}%, rgba(217,167,91,0.16), transparent 65%)`;

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    glowX.set(((event.clientX - rect.left) / rect.width) * 100);
    glowY.set(((event.clientY - rect.top) / rect.height) * 100);
  }

  useEffect(() => {
    if (!isInView) return undefined;
    let angle = 0;
    const id = setInterval(() => {
      angle += 0.4;
      glowX.set(50 + Math.sin(angle) * 22);
      glowY.set(35 + Math.cos(angle * 0.8) * 18);
    }, 60);
    return () => clearInterval(id);
  }, [isInView, glowX, glowY]);

  // T · I · M · E boot-up sequence — lights one letter at a time, holds on
  // the fully-lit word for a beat, then resets to blank and loops.
  const [litCount, setLitCount] = useState(0);

  useEffect(() => {
    if (!isInView) return undefined;
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    function runSequence(step: number) {
      if (cancelled) return;
      if (step > coreValues.length) {
        setLitCount(0);
        timeoutId = setTimeout(() => runSequence(0), STEP_MS);
        return;
      }
      setLitCount(step);
      const delay = step === coreValues.length ? RESET_PAUSE_MS : STEP_MS;
      timeoutId = setTimeout(() => runSequence(step + 1), delay);
    }

    runSequence(0);
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [isInView, coreValues.length]);

  const fillPercent = coreValues.length > 0 ? (litCount / coreValues.length) * 100 : 0;

  return (
    <Section divider className="py-section-gap-mobile md:py-section-gap-desktop">
      <div
        onPointerMove={handlePointerMove}
        className="relative overflow-hidden"
      >
        {/* Interactive backdrop — pointer-tracked glow plus a couple of
            slow-drifting brass motes for texture. Purely decorative
            (aria-hidden), sits behind everything else in the section. */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: glowBackground }}
        />
        <div className="pointer-events-none absolute -top-10 left-[8%] h-40 w-40 -z-10 rounded-full bg-teal/10 blur-3xl animate-float" />
        <div className="pointer-events-none absolute bottom-0 right-[10%] h-48 w-48 -z-10 rounded-full bg-gold/10 blur-3xl animate-float-delay" />

        <div className="max-w-container-max-width mx-auto px-6">
          <motion.div
            ref={sectionRef}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeUp}
            className="max-w-2xl mb-16 md:mb-20 space-y-3"
          >
            <span className="inline-flex items-center gap-2 font-label-bold text-label-bold text-gold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              On T.I.M.E.
            </span>
            <h2 className="font-headline-md text-headline-md text-on-background">The Values Behind Every Job</h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="relative"
          >
            {/* The path — horizontal on desktop, vertical down the left on
                mobile. A gold fill grows behind the boot-up sequence to
                show progress across the whole word, not just each badge. */}
            <div className="hidden md:block absolute left-0 right-0 top-8 h-px bg-gradient-to-r from-transparent via-outline-variant to-transparent" />
            <div
              className="hidden md:block absolute left-0 top-8 h-px bg-gold transition-[width] ease-linear"
              style={{ width: `${fillPercent}%`, transitionDuration: `${STEP_MS}ms` }}
            />
            <div className="md:hidden absolute left-8 top-2 bottom-2 w-px bg-outline-variant" />
            <div
              className="md:hidden absolute left-8 top-2 w-px bg-gold transition-[height] ease-linear"
              style={{ height: `${fillPercent}%`, transitionDuration: `${STEP_MS}ms` }}
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-y-10 md:gap-x-6">
              {coreValues.map((value, index) => {
                const isLit = index < litCount;
                return (
                  <motion.div
                    key={value.id}
                    variants={fadeUp}
                    custom={index * 0.1}
                    className="relative flex md:flex-col items-start md:items-center gap-5 md:gap-0 md:text-center"
                  >
                    <motion.div
                      animate={{
                        scale: isLit ? 1.08 : 1,
                        borderColor: isLit ? 'rgba(217,167,91,1)' : 'rgba(217,167,91,0.35)',
                        boxShadow: isLit
                          ? '0 0 0 1px rgba(217,167,91,0.4), 0 0 24px 4px rgba(217,167,91,0.45)'
                          : '0 0 0 0 rgba(217,167,91,0)',
                      }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 bg-background md:mb-6 font-mono text-2xl text-gold"
                    >
                      {VALUE_LETTER[value.id] ?? '•'}
                      <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-teal-soft text-teal ring-4 ring-background">
                        <MaterialIcon name={VALUE_ICON[value.id] ?? 'star'} filled className="text-[13px]" />
                      </span>
                    </motion.div>
                    <div className="pt-1 md:pt-0">
                      <p className="font-label-bold text-label-bold text-primary mb-1.5">{value.title}</p>
                      <p className="font-body-md text-body-md text-on-surface-variant md:max-w-[190px] md:mx-auto">
                        {value.description}
                      </p>
                    </div>
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

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { fadeUp } from '../../../shared/utils/constants';
import Section from '../../../shared/components/Section';
import MaterialIcon from '../../../shared/components/MaterialIcon';
import type { PropertyManagementData } from '../../../shared/models/types';

interface ProcessStepsProps {
  data: PropertyManagementData;
}

const STEP_ACCENT = ['text-teal', 'text-blue', 'text-teal'];

/**
 * The step-by-step tracker at top stays — it's a hairline rail with dots,
 * not a card. What changes is what used to sit below it: three identical
 * photo cards became a running list of numbered rows, each pairing its own
 * small photo with the step's copy. The self-advancing "visited" state still
 * drives which entry is marked complete, but that now shows as a filled
 * number and a gold rule instead of a ring around a card.
 */
export default function ProcessSteps({ data }: ProcessStepsProps) {
  const sectionRef1 = useRef(null);
  const isInView1 = useInView(sectionRef1, { once: true, amount: 0.2, margin: '-80px' });

  const [visited, setVisited] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isInView1) return;

    let cancelled = false;
    const timers: number[] = [];

    const runCycle = () => {
      if (cancelled) return;
      setVisited(new Set());

      data.steps.forEach((step, index) => {
        const timer = window.setTimeout(() => {
          if (cancelled) return;
          setVisited((current) => new Set(current).add(step.id));
        }, (index + 1) * 2000);
        timers.push(timer);
      });

      const totalDuration = (data.steps.length + 1) * 2000 + 4000;
      const resetTimer = window.setTimeout(() => {
        if (cancelled) return;
        runCycle();
      }, totalDuration);
      timers.push(resetTimer);
    };

    runCycle();

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView1]);

  return (
    <Section id="process" divider className="py-section-gap-mobile md:py-section-gap-desktop">
      <div className="max-w-container-max-width mx-auto px-6">
        <motion.div
          ref={sectionRef1}
          initial="hidden"
          animate={isInView1 ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="max-w-2xl mb-4 space-y-4"
        >
          <h2 className="font-headline-md text-headline-md text-primary">{data.processHeading}</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">{data.processSubheading}</p>
        </motion.div>

        {/* Progress tracker */}
        <div className="flex items-center mb-14 max-w-xl">
          {data.steps.map((step, index) => {
            const isVisited = visited.has(step.id);
            const isLast = index === data.steps.length - 1;
            return (
              <div key={step.id} className="flex items-center flex-1 last:flex-none">
                <motion.div
                  animate={{ scale: isVisited ? 1.1 : 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className={`relative w-10 h-10 rounded-full flex items-center justify-center font-headline-sm text-sm font-bold flex-shrink-0 transition-colors duration-300 ${
                    isVisited ? 'bg-blue text-white' : 'border-2 border-outline-variant text-on-surface-variant'
                  }`}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isVisited ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      >
                        <MaterialIcon name="check" filled className="text-lg" />
                      </motion.span>
                    ) : (
                      <motion.span key="number" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        {step.step}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
                {!isLast && (
                  <div className="flex-1 h-px mx-2 bg-outline-variant overflow-hidden">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: isVisited ? '100%' : '0%' }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full bg-blue"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="border-t border-outline-variant">
          {data.steps.map((step, index) => {
            const accent = STEP_ACCENT[index % STEP_ACCENT.length];
            const isVisited = visited.has(step.id);
            return (
              <StepRow key={step.id} step={step} accent={accent} isVisited={isVisited} />
            );
          })}
        </div>
      </div>
    </Section>
  );
}

function StepRow({
  step,
  accent,
  isVisited,
}: {
  step: PropertyManagementData['steps'][number];
  accent: string;
  isVisited: boolean;
}) {
  const rowRef = useRef(null);
  const isInView = useInView(rowRef, { once: true, amount: 0.2, margin: '-80px' });

  return (
    <motion.div
      ref={rowRef}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeUp}
      className={`border-b border-outline-variant py-8 grid grid-cols-1 sm:grid-cols-[auto_120px_1fr] gap-x-6 gap-y-4 items-center transition-colors duration-500 ${isVisited ? 'bg-blue/5' : ''}`}
    >
      <span className={`font-mono text-2xl ${accent}`}>{String(step.step).padStart(2, '0')}</span>

      <div className="relative h-20 w-full sm:w-[120px] overflow-hidden rounded-md order-3 sm:order-2">
        <img src={step.image.src} alt={step.image.alt} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
      </div>

      <div className="order-2 sm:order-3">
        <h3 className="font-headline-sm text-headline-sm text-primary mb-2 flex items-center gap-2">
          <MaterialIcon name={step.icon} filled className={`text-xl ${accent}`} />
          {step.title}
        </h3>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {step.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 font-body-md text-body-md text-on-surface-variant">
              <MaterialIcon name="check_circle" filled className={`text-[16px] ${accent}`} />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

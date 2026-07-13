import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { fadeUp, staggerContainer } from '../../../shared/utils/constants';
import MaterialIcon from '../../../shared/components/MaterialIcon';
import type { PropertyManagementData } from '../../../shared/models/types';

interface ProcessStepsProps {
  data: PropertyManagementData;
}

const STEP_THEMES = [
  {
    badgeBg: 'bg-teal',
    badgeText: 'text-on-primary',
    numberBg: 'bg-teal',
    topBar: 'bg-teal',
    ring: 'ring-teal',
    soft: 'bg-teal-soft',
    text: 'text-teal',
  },
  {
    badgeBg: 'bg-blue',
    badgeText: 'text-on-primary',
    numberBg: 'bg-blue',
    topBar: 'bg-blue',
    ring: 'ring-blue',
    soft: 'bg-blue/10',
    text: 'text-blue',
  },
  {
    badgeBg: 'bg-primary-container',
    badgeText: 'text-on-primary',
    numberBg: 'bg-primary-container',
    topBar: 'bg-primary-container',
    ring: 'ring-primary-container',
    soft: 'bg-primary-container/10',
    text: 'text-primary',
  },
];

export default function ProcessSteps({ data }: ProcessStepsProps) {
  const sectionRef1 = useRef(null);
  const isInView1 = useInView(sectionRef1, { once: true, amount: 0.2, margin: '-80px' });
  const sectionRef2 = useRef(null);
  const isInView2 = useInView(sectionRef2, { once: true, amount: 0.2, margin: '-80px' });

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
    <section
      id="process"
      className="py-section-gap-mobile md:py-section-gap-desktop bg-gradient-to-b from-teal-soft via-secondary-container/50 to-secondary-container/30"
    >
      <div className="max-w-container-max-width mx-auto px-6">
        <motion.div
          ref={sectionRef1}
          initial="hidden"
          animate={isInView1 ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="text-center max-w-2xl mx-auto mb-4 space-y-4"
        >
          <h2 className="font-headline-md text-headline-md text-primary">{data.processHeading}</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">{data.processSubheading}</p>
        </motion.div>

        <motion.p
          initial="hidden"
          animate={isInView1 ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="text-center font-label-bold text-label-bold text-primary/70 mb-10 flex items-center justify-center gap-2"
        >
          <MaterialIcon name="auto_awesome" className="text-lg" />
          Watch how the process comes together, step by step
        </motion.p>

        {/* Progress tracker */}
        <div className="flex items-center justify-center mb-12 max-w-xl mx-auto">
          {data.steps.map((step, index) => {
            const theme = STEP_THEMES[index % STEP_THEMES.length];
            const isVisited = visited.has(step.id);
            const isLast = index === data.steps.length - 1;
            return (
              <div key={step.id} className="flex items-center flex-1 last:flex-none">
                <motion.div
                  animate={{ scale: isVisited ? 1.1 : 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className={`relative w-11 h-11 rounded-full flex items-center justify-center font-headline-sm text-sm font-bold shadow-card flex-shrink-0 transition-colors duration-300 ${
                    isVisited ? theme.numberBg + ' text-on-primary' : 'bg-surface border-2 border-outline-variant text-on-surface-variant'
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
                  <div className="flex-1 h-1 mx-2 rounded-full bg-surface-container-high overflow-hidden">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: isVisited ? '100%' : '0%' }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className={`h-full ${theme.numberBg}`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <motion.div
          ref={sectionRef2}
          initial="hidden"
          animate={isInView2 ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-grid-gutter"
        >
          {data.steps.map((step, index) => {
            const theme = STEP_THEMES[index % STEP_THEMES.length];
            const isVisited = visited.has(step.id);
            return (
              <motion.div
                key={step.id}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className={`bg-surface rounded-3xl shadow-card hover:shadow-card-hover transition-all duration-300 relative overflow-hidden group ${
                  isVisited ? `ring-2 ${theme.ring}` : ''
                }`}
              >
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${theme.topBar} z-10`} />
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={step.image.src}
                    alt={step.image.alt}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                  {isVisited && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`absolute inset-0 ${theme.soft} mix-blend-multiply`}
                    />
                  )}
                  <span
                    className={`absolute top-4 right-4 w-9 h-9 rounded-full ${theme.numberBg} text-on-primary font-headline-sm text-sm font-bold flex items-center justify-center shadow-card`}
                  >
                    {isVisited ? <MaterialIcon name="check" filled className="text-lg" /> : step.step}
                  </span>
                  <div
                    className={`absolute bottom-3 left-6 w-14 h-14 ${theme.badgeBg} rounded-2xl flex items-center justify-center ${theme.badgeText} shadow-card`}
                  >
                    <MaterialIcon name={step.icon} filled className="text-2xl" />
                  </div>
                </div>
                <div className="p-card-padding pt-6">
                  <h3 className="font-headline-sm text-headline-sm text-primary mb-4 flex items-center gap-2">
                    {step.step}. {step.title}
                  </h3>
                  <ul className="space-y-3 font-body-md text-body-md text-on-surface-variant list-none relative z-10">
                    {step.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <MaterialIcon name="check_circle" filled className={`${theme.text} text-xl mt-0.5`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

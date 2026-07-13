import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { fadeUp } from '../../../shared/utils/constants';
import Section from '../../../shared/components/Section';
import MaterialIcon from '../../../shared/components/MaterialIcon';
import type { CleaningServicesData, CoreValue } from '../../../shared/models/types';

interface CoreValuesProps {
  data: CleaningServicesData;
}

const VALUE_STYLE: Record<string, { letter: string; icon: string; fact: string; chip: string }> = {
  trust: {
    letter: 'T',
    icon: 'verified_user',
    fact: "Every teammate is background-checked and insured before they ever touch your keys.",
    chip: 'text-blue',
  },
  integrity: {
    letter: 'I',
    icon: 'handshake',
    fact: 'What we quote is what we charge — no surprise add-ons after the job is done.',
    chip: 'text-teal',
  },
  mastery: {
    letter: 'M',
    icon: 'workspace_premium',
    fact: 'Every cleaner trains on our checklist system before working solo in the field.',
    chip: 'text-gold',
  },
  efficiency: {
    letter: 'E',
    icon: 'bolt',
    fact: 'Smart routing and checklists mean less time waiting, more time enjoying a clean space.',
    chip: 'text-teal-deep',
  },
};

const FALLBACK_STYLE = VALUE_STYLE.trust;

/**
 * The T.I.M.E. values used to be four identical flip-cards over a photo
 * slideshow — press one, it flips in a grid of four. Now the four letters
 * are the whole interface: press T, I, M, or E and a single wide stage
 * below crossfades to that value's icon, description, and supporting fact.
 * One large surface instead of four small boxed ones, closer to the
 * tab-and-stage pattern already used on the homepage's "What We Do" section.
 */
export default function CoreValues({ data }: CoreValuesProps) {
  const sectionRef1 = useRef(null);
  const isInView1 = useInView(sectionRef1, { once: true, amount: 0.2, margin: '-80px' });

  const slides = data.coreValuesBackgroundImages;
  const [slideIndex, setSlideIndex] = useState(0);
  const [activeId, setActiveId] = useState<string>(data.coreValues[0]?.id ?? '');

  useEffect(() => {
    if (slides.length < 2) return;
    const interval = setInterval(() => {
      setSlideIndex((current) => (current + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [slides.length]);

  const styleFor = (value: CoreValue) => VALUE_STYLE[value.id] ?? FALLBACK_STYLE;
  const activeValue = data.coreValues.find((v) => v.id === activeId) ?? data.coreValues[0];
  const activeStyle = activeValue ? styleFor(activeValue) : FALLBACK_STYLE;

  return (
    <Section seam className="relative min-h-screen flex items-center overflow-hidden bg-primary-container py-16">
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="sync">
          {slides.length > 0 && (
            <motion.img
              key={slides[slideIndex].src}
              src={slides[slideIndex].src}
              alt={slides[slideIndex].alt}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-primary-container/80 via-primary-container/55 to-primary-container/85" />
      </div>

      <div className="relative z-10 max-w-container-max-width mx-auto px-6 w-full">
        <motion.div
          ref={sectionRef1}
          initial="hidden"
          animate={isInView1 ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="text-center max-w-2xl mx-auto mb-10 space-y-4"
        >
          <h2 className="font-headline-md text-headline-md text-on-primary">{data.coreValuesHeading}</h2>
          <p className="font-body-md text-body-md text-primary-fixed-dim">
            {data.coreValuesSubheadingLine1}
            <br />
            {data.coreValuesSubheadingLine2}
          </p>
        </motion.div>

        {/* T.I.M.E. letters — the acronym itself is the tab bar */}
        <div className="flex items-stretch justify-center gap-0 mb-10 border-y border-on-primary/20 max-w-2xl mx-auto" role="tablist" aria-label="T.I.M.E. values">
          {data.coreValues.map((value, index) => {
            const style = styleFor(value);
            const isActive = activeId === value.id;
            return (
              <button
                key={value.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveId(value.id)}
                className={`relative flex-1 flex flex-col items-center gap-1 py-5 transition-colors duration-300 focus-ring ${
                  index > 0 ? 'border-l border-on-primary/20' : ''
                }`}
              >
                <span className={`font-headline-md text-3xl sm:text-4xl font-bold transition-colors duration-300 ${isActive ? 'text-on-primary' : 'text-on-primary/40'}`}>
                  {style.letter}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="time-letter-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
                    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Stage — the selected value's icon, title, description, and fact */}
        <AnimatePresence mode="wait">
          {activeValue && (
            <motion.div
              key={activeValue.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl mx-auto text-center"
            >
              <MaterialIcon name={activeStyle.icon} filled className={`text-4xl mb-4 ${activeStyle.chip}`} />
              <h3 className="font-headline-sm text-headline-sm text-on-primary mb-3">{activeValue.title}</h3>
              <p className="font-body-lg text-body-lg text-on-primary/90 mb-3">{activeValue.description}</p>
              <p className="font-body-md text-body-md text-primary-fixed-dim">{activeStyle.fact}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}

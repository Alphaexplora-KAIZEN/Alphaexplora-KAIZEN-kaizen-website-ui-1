import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { fadeUp, staggerContainer } from '../../../shared/utils/constants';
import MaterialIcon from '../../../shared/components/MaterialIcon';
import type { CleaningServicesData, CoreValue } from '../../../shared/models/types';

interface CoreValuesProps {
  data: CleaningServicesData;
}

const VALUE_STYLE: Record<
  string,
  { letter: string; icon: string; fact: string; ring: string; glow: string; chip: string; bar: string }
> = {
  trust: {
    letter: 'T',
    icon: 'verified_user',
    fact: 'Every teammate is background-checked and insured before they ever touch your keys.',
    ring: 'ring-blue',
    glow: 'bg-blue/30',
    chip: 'bg-blue text-white',
    bar: 'from-blue to-blue/60',
  },
  integrity: {
    letter: 'I',
    icon: 'handshake',
    fact: 'What we quote is what we charge — no surprise add-ons after the job is done.',
    ring: 'ring-teal',
    glow: 'bg-teal/30',
    chip: 'bg-teal text-white',
    bar: 'from-teal to-teal/60',
  },
  mastery: {
    letter: 'M',
    icon: 'workspace_premium',
    fact: 'Every cleaner trains on our checklist system before working solo in the field.',
    ring: 'ring-navy',
    glow: 'bg-navy/30',
    chip: 'bg-navy text-white',
    bar: 'from-navy to-navy/60',
  },
  efficiency: {
    letter: 'E',
    icon: 'bolt',
    fact: 'Smart routing and checklists mean less time waiting, more time enjoying a clean space.',
    ring: 'ring-teal-deep',
    glow: 'bg-teal-deep/30',
    chip: 'bg-teal-deep text-white',
    bar: 'from-teal-deep to-teal-deep/60',
  },
};

const FALLBACK_STYLE = VALUE_STYLE.trust;

export default function CoreValues({ data }: CoreValuesProps) {
  const sectionRef1 = useRef(null);
  const isInView1 = useInView(sectionRef1, { once: true, amount: 0.2, margin: '-80px' });
  const sectionRef2 = useRef(null);
  const isInView2 = useInView(sectionRef2, { once: true, amount: 0.2, margin: '-80px' });

  const slides = data.coreValuesBackgroundImages;
  const [slideIndex, setSlideIndex] = useState(0);
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (slides.length < 2) return;
    const interval = setInterval(() => {
      setSlideIndex((current) => (current + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [slides.length]);

  const toggleFlip = (id: string) => {
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const styleFor = (value: CoreValue) => VALUE_STYLE[value.id] ?? FALLBACK_STYLE;

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-primary-container py-16"
    >
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
        <div className="absolute inset-0 bg-gradient-to-b from-primary-container/75 via-primary-container/45 to-primary-container/80" />
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

          {/* Interactive T.I.M.E. letter strip — hover or tap a letter to spotlight its card */}
          <div className="flex items-center justify-center gap-3 sm:gap-5 pt-2" role="tablist" aria-label="T.I.M.E. values">
            {data.coreValues.map((value) => {
              const style = styleFor(value);
              const isActive = activeId === value.id;
              return (
                <button
                  key={value.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onMouseEnter={() => setActiveId(value.id)}
                  onMouseLeave={() => setActiveId((current) => (current === value.id ? null : current))}
                  onClick={() => {
                    setActiveId(value.id);
                    toggleFlip(value.id);
                  }}
                  className={`relative flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-full font-headline-sm text-lg sm:text-xl font-bold transition-all duration-300 focus-ring ${
                    isActive
                      ? `${style.chip} scale-110 shadow-[0_8px_24px_rgba(0,0,0,0.35)]`
                      : 'bg-on-primary/10 text-on-primary hover:bg-on-primary/20'
                  }`}
                >
                  {style.letter}
                  {isActive && (
                    <motion.span
                      layoutId="time-letter-ring"
                      className="absolute -inset-1.5 rounded-full ring-2 ring-white/40"
                      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-primary-fixed-dim/70 tracking-wide">
            Tap a letter or a card to flip it and see what it means for you
          </p>
        </motion.div>

        <motion.div
          ref={sectionRef2}
          initial="hidden"
          animate={isInView2 ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
        >
          {data.coreValues.map((value) => {
            const style = styleFor(value);
            const isFlipped = !!flipped[value.id];
            const isActive = activeId === value.id;

            return (
              <motion.div
                key={value.id}
                variants={fadeUp}
                className="[perspective:1200px]"
                onMouseEnter={() => setActiveId(value.id)}
                onMouseLeave={() => setActiveId((current) => (current === value.id ? null : current))}
              >
                <motion.div
                  role="button"
                  tabIndex={0}
                  aria-pressed={isFlipped}
                  aria-label={`${value.title} — tap to flip`}
                  onClick={() => toggleFlip(value.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      toggleFlip(value.id);
                    }
                  }}
                  animate={{ rotateY: isFlipped ? 180 : 0, scale: isActive ? 1.04 : 1 }}
                  transition={{ rotateY: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }, scale: { duration: 0.25 } }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="relative min-h-[240px] cursor-pointer outline-none"
                >
                  {/* Front face */}
                  <div
                    style={{ backfaceVisibility: 'hidden' }}
                    className={`absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl border p-8 text-center transition-shadow duration-300 bg-on-primary/10 backdrop-blur-sm ${
                      isActive ? `border-transparent ring-2 ${style.ring} shadow-[0_20px_45px_rgba(0,0,0,0.3)]` : 'border-on-primary/10'
                    }`}
                  >
                    <div className={`absolute top-0 left-6 right-6 h-1 rounded-full bg-gradient-to-r ${style.bar}`} />
                    <motion.div
                      animate={isActive ? { rotate: [0, -8, 8, -4, 0] } : { rotate: 0 }}
                      transition={{ duration: 0.5 }}
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${style.chip} shadow-soft`}
                    >
                      <MaterialIcon name={style.icon} filled className="text-[26px]" />
                    </motion.div>
                    <h3 className="font-headline-sm text-headline-sm text-on-primary">{value.title}</h3>
                    <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-primary-fixed-dim/80">
                      <MaterialIcon name="touch_app" className="text-[14px]" />
                      Tap to reveal
                    </span>
                  </div>

                  {/* Back face */}
                  <div
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    className={`absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl p-8 text-center ${style.chip} shadow-[0_20px_45px_rgba(0,0,0,0.3)]`}
                  >
                    <span className="font-headline-sm text-3xl font-bold opacity-90">{style.letter}</span>
                    <p className="font-body-md text-body-md leading-relaxed">{value.description}</p>
                    <p className="text-xs font-semibold uppercase tracking-wide opacity-80 pt-1">{style.fact}</p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

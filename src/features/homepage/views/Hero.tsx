import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { fadeUp, fadeUpLarge, staggerFast } from '../../../shared/utils/constants';
import MaterialIcon from '../../../shared/components/MaterialIcon';
import KaizenMark from '../../../shared/components/KaizenMark';
import type { HomepageData } from '../../../shared/models/types';

interface HeroProps {
  data: HomepageData;
}

const wordVariants = {
  hidden: { opacity: 0, y: '0.6em' },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

// How long each background photo holds before the slideshow crossfades to
// the next one.
const SLIDE_DURATION_MS = 5000;

/**
 * The homepage hero now shares the same full-bleed photo treatment as the
 * About Us (and every other inner-page) hero, rather than the old
 * overlapping "ledger stack" of three small photos. Instead of one static
 * background image, the three specialty photos already in the page data
 * (property management, cleaning, aircon care) slide-show through as a
 * slow, ambient crossfade — so the hero still communicates "one team,
 * three specialties" without needing a separate collage of cards.
 */
export default function Hero({ data }: HeroProps) {
  const words = data.headline.split(' ');
  const slides = data.services.length > 0
    ? data.services.map((service) => ({ id: service.id, image: service.image }))
    : [{ id: 'hero', image: data.heroImage }];
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const id = setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <section className="relative min-h-[calc(100vh-5rem)] flex items-center pt-section-gap-mobile md:pt-section-gap-desktop pb-section-gap-mobile md:pb-section-gap-desktop overflow-hidden bg-kaizen-grid">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30 z-10" />
        <div className="absolute inset-0 bg-kaizen-mesh z-10" />
        <AnimatePresence mode="sync">
          <motion.img
            key={slides[activeSlide].id}
            src={slides[activeSlide].image.src}
            alt={slides[activeSlide].image.alt}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1.14 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.2, ease: 'easeInOut' },
              scale: { duration: SLIDE_DURATION_MS / 1000 + 1.2, ease: 'linear' },
            }}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </AnimatePresence>

      </div>

      <div className="absolute top-[18%] right-[6%] z-10 hidden lg:block text-teal/60 animate-float">
        <KaizenMark size={64} />
      </div>

      <div className="max-w-container-max-width mx-auto px-6 w-full relative z-20">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-5xl">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={staggerFast}
            aria-label={data.headline}
            className="font-display-lg text-[40px] sm:text-[60px] md:text-[76px] lg:text-[88px] font-bold leading-[1.02] tracking-tight text-on-background mb-10 flex flex-wrap gap-x-5"
          >
            {words.map((word, i) => (
              <motion.span key={`${word}-${i}`} variants={wordVariants} className="inline-block">
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            variants={fadeUpLarge}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="font-body-lg text-base sm:text-lg text-on-surface-variant mb-12 max-w-2xl text-justify"
          >
            {data.subheadline}
          </motion.p>

          <motion.div variants={fadeUp} custom={0.4} initial="hidden" animate="visible" className="flex flex-col sm:flex-row gap-5">
            <a
              href={data.primaryHref}
              className="group bg-primary-container text-on-primary font-label-bold text-label-bold px-8 py-4 rounded-full transition-all duration-300 shadow-glow hover:shadow-glow-hover hover:bg-navy-deep hover:text-gold hover:scale-[1.02] flex items-center justify-center gap-2 focus-ring"
            >
              {data.primaryCta}
              <MaterialIcon
                name="arrow_forward"
                filled
                className="text-[20px] transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
            <a
              href={data.secondaryHref}
              className="bg-transparent border-2 border-gold/40 text-gold font-label-bold text-label-bold px-8 py-4 rounded-full hover:bg-gold/10 hover:border-gold transition-all duration-300 flex items-center justify-center focus-ring"
            >
              {data.secondaryCta}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

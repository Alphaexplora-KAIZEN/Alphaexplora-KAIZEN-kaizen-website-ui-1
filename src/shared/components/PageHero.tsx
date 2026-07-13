import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, fadeUpLarge, staggerFast } from '../utils/constants';
import MaterialIcon from './MaterialIcon';
import KaizenMark from './KaizenMark';

interface PageHeroProps {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryCta: string;
  primaryHref: string;
  secondaryCta: string;
  secondaryHref: string;
  image: { src: string; alt: string };
}

const wordVariants = {
  hidden: { opacity: 0, y: '0.6em' },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

/**
 * Full-bleed hero section shared by every landing page (Property Management,
 * Cleaning Services, Aircon Care). Only the copy, image, and CTA targets change
 * per page — the layout and motion are identical, so it lives here once.
 */
export default function PageHero({
  eyebrow,
  headline,
  subheadline,
  primaryCta,
  primaryHref,
  secondaryCta,
  secondaryHref,
  image,
}: PageHeroProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const bounds = imageRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const px = (event.clientX - bounds.left) / bounds.width - 0.5;
    const py = (event.clientY - bounds.top) / bounds.height - 0.5;
    setTilt({ x: px * 14, y: py * 14 });
  }

  function resetTilt() {
    setTilt({ x: 0, y: 0 });
  }

  const words = headline.split(' ');

  return (
    <section
      className="relative min-h-[calc(100vh-5rem)] flex items-center pt-section-gap-mobile md:pt-section-gap-desktop pb-section-gap-mobile md:pb-section-gap-desktop overflow-hidden bg-kaizen-grid"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      <div className="absolute inset-0 z-0" ref={imageRef}>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30 z-10" />
        <div className="absolute inset-0 bg-kaizen-mesh z-10" />
        <motion.img
          src={image.src}
          alt={image.alt}
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{
            scale: 1.08,
            opacity: 1,
            x: tilt.x,
            y: tilt.y,
          }}
          transition={{ opacity: { duration: 1 }, x: { type: 'spring', stiffness: 60, damping: 18 }, y: { type: 'spring', stiffness: 60, damping: 18 } }}
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="absolute top-[18%] right-[6%] z-10 hidden lg:block text-gold/70 animate-float">
        <KaizenMark size={64} />
      </div>

      <div className="max-w-container-max-width mx-auto px-6 w-full relative z-20">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-4xl">
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold font-label-bold text-label-bold mb-8"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            {eyebrow}
          </motion.span>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={staggerFast}
            aria-label={headline}
            className="font-display-lg text-[40px] sm:text-[60px] md:text-[76px] lg:text-[92px] font-bold leading-[1.05] tracking-tight text-on-background mb-8 flex flex-wrap gap-x-4"
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
            className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-xl text-justify"
          >
            {subheadline}
          </motion.p>

          <motion.div variants={fadeUp} custom={0.4} initial="hidden" animate="visible" className="flex flex-col sm:flex-row gap-4">
            <a
              href={primaryHref}
              className="group bg-primary-container text-on-primary font-label-bold text-label-bold px-8 py-4 rounded-full transition-all duration-300 shadow-glow hover:shadow-glow-hover hover:bg-navy-deep hover:text-gold hover:scale-[1.02] flex items-center justify-center gap-2 focus-ring"
            >
              {primaryCta}
              <MaterialIcon
                name="arrow_forward"
                filled
                className="text-[20px] transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
            <a
              href={secondaryHref}
              className="bg-transparent border-2 border-gold/40 text-gold font-label-bold text-label-bold px-8 py-4 rounded-full hover:bg-gold/10 hover:border-gold transition-all duration-300 flex items-center justify-center focus-ring"
            >
              {secondaryCta}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

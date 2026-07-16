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
 * Split-screen hero: copy sits in its own column on the left, and the
 * photo lives in a framed, rounded card on the right rather than
 * bleeding full-width behind the text. This replaces the earlier
 * full-bleed-photo-with-overlay treatment — the photo now reads as a
 * deliberate, bounded portrait rather than atmosphere behind the words,
 * which gives the layout more contrast between "things to read" and
 * "things to look at."
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
    setTilt({ x: px * 10, y: py * 10 });
  }

  function resetTilt() {
    setTilt({ x: 0, y: 0 });
  }

  const words = headline.split(' ');

  return (
    <section className="relative min-h-[calc(100vh-5rem)] flex items-center pt-section-gap-mobile md:pt-section-gap-desktop pb-section-gap-mobile md:pb-section-gap-desktop overflow-hidden bg-kaizen-grid">
      <div className="absolute inset-0 bg-kaizen-mesh pointer-events-none" />

      <div className="max-w-container-max-width mx-auto px-6 w-full relative z-20 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-10 items-center">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold font-label-bold text-label-bold mb-8"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-teal" />
            {eyebrow}
          </motion.span>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={staggerFast}
            aria-label={headline}
            className="font-display-lg text-[36px] sm:text-[52px] md:text-[64px] font-bold leading-[1.05] tracking-tight text-on-background mb-8 flex flex-wrap gap-x-3"
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

        <motion.div
          ref={imageRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={resetTilt}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[4/5] w-full max-w-md mx-auto lg:max-w-none rounded-[2rem] overflow-hidden border border-gold/25 shadow-ambient-hover"
        >
          <motion.img
            src={image.src}
            alt={image.alt}
            animate={{ x: tilt.x, y: tilt.y, scale: 1.1 }}
            transition={{ x: { type: 'spring', stiffness: 60, damping: 18 }, y: { type: 'spring', stiffness: 60, damping: 18 } }}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/60 via-transparent to-transparent" />
          <div className="absolute top-5 right-5 text-gold/80">
            <KaizenMark size={40} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeUp, staggerContainer } from '../../../shared/utils/constants';
import Section from '../../../shared/components/Section';
import MaterialIcon from '../../../shared/components/MaterialIcon';
import ParticleField from './ParticleField';

const HERO_ID = 'wwd-page-intro';
const HEADLINE = 'What We Do At';
const HEADLINE_TYPOGRAPHY =
  'font-display-lg text-[clamp(18px,4.4vw,56px)] font-bold leading-[1.05] tracking-tight uppercase whitespace-nowrap';

const headlineStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.05 },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: '0.9em', rotateX: -70, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const logoVariants = {
  hidden: { opacity: 0, scale: 0.6, y: 44, rotate: -5, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotate: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring' as const, stiffness: 110, damping: 15, mass: 0.8, delay: 0.4 },
  },
};

interface PageIntroProps {
  /** Called when the scroll-down button beneath the logo is pressed. */
  onJumpToPropertyManagement: () => void;
}

/**
 * The page's opening statement. Previously just a badge, headline, and
 * subheading floating on the plain page background — every other page on
 * the site opens with a proper hero (a photo, a mesh backdrop, something to
 * look at), so this felt thin by comparison. It now sits on the same
 * grid + brass mesh backdrop the homepage hero uses, closing with the
 * brand logo directly beneath the headline. The headline reveals
 * word-by-word with a slow blur-to-focus tilt (long duration, soft
 * ease-out curve) and the logo follows with a low-stiffness, low-damping
 * spring — a big, unmistakable settle rather than a quick snap. Its teal
 * glow only loops while actively hovered, rather than breathing on a
 * permanent timer. The backdrop carries a canvas of drifting, connecting
 * particles (ParticleField) over the dialed-back mesh
 * (bg-kaizen-mesh-wwd-hero) so the bottom-right glow stays subtle
 * alongside the particles and logo glow. The button beneath the logo
 * jumps straight to the Property Management service in the notebook
 * below, rather than just scrolling to whatever happens to sit next on
 * the page.
 */
export default function PageIntro({ onJumpToPropertyManagement }: PageIntroProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <Section
      id={HERO_ID}
      className="scroll-mt-[var(--wwd-sticky-offset)] relative overflow-hidden flex flex-col justify-center min-h-[calc(100dvh-5rem)] pt-24 pb-10 md:pt-16 md:pb-12"
    >
      <div className="absolute inset-0 bg-kaizen-mesh-wwd-hero pointer-events-none" />

      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <ParticleField />
      </div>

      <div className="max-w-container-max-width mx-auto px-6 relative">
        <motion.div
          ref={sectionRef}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="flex flex-col items-center text-center"
        >
          <motion.h1
            variants={headlineStagger}
            aria-label={HEADLINE}
            style={{ perspective: 400 }}
            className={`${HEADLINE_TYPOGRAPHY} text-on-background mb-2`}
          >
            {HEADLINE.split(' ').map((word, i) => (
              <motion.span key={`${word}-${i}`} variants={wordVariants} className="inline-block mr-[0.28em] last:mr-0">
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.div variants={logoVariants} className="relative">
            <motion.img
              src="/assets/logo_with_name_white_Green.png"
              alt="Kaizen"
              className="w-full max-w-lg sm:max-w-2xl md:max-w-3xl h-auto cursor-pointer"
              whileHover={{
                filter: [
                  'drop-shadow(0 0 0px rgba(47,205,168,0))',
                  'drop-shadow(0 0 38px rgba(47,205,168,0.55))',
                  'drop-shadow(0 0 0px rgba(47,205,168,0))',
                ],
                scale: [1, 1.035, 1],
              }}
              transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>

          <motion.div variants={fadeUp} className="mt-10 md:mt-12">
            <motion.button
              type="button"
              onClick={onJumpToPropertyManagement}
              aria-label="Jump to Property Management"
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{
                scale: 1.08,
                y: 0,
                transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
              }}
              whileTap={{ scale: 0.92, transition: { duration: 0.15, ease: 'easeOut' } }}
              className="group inline-flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant bg-surface/60 backdrop-blur-sm text-on-surface-variant transition-[color,border-color,box-shadow] duration-300 ease-out hover:text-teal hover:border-teal/50 hover:shadow-[0_0_22px_rgba(47,205,168,0.3)] focus-ring"
            >
              <MaterialIcon
                name="keyboard_arrow_down"
                className="text-2xl transition-transform duration-300 ease-out group-hover:translate-y-0.5"
              />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}

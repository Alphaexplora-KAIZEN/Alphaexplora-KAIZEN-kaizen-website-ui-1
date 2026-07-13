import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
  /**
   * Adds a soft top/bottom vignette — for sections with their own distinct
   * background tone (dark bands, tinted panels) — so entering/leaving the
   * section reads as a gradual dissolve instead of a hard color cut.
   */
  seam?: boolean;
  /**
   * Adds a faint, edge-faded hairline marking where this section begins.
   * Off by default for sections that already draw their own boundary
   * (a floating card, a bordered list) to avoid a doubled-up line.
   */
  divider?: boolean;
  /**
   * Whether the section itself fades/rises into place as it scrolls into
   * view. Kept on by default; sections that are already visible on load
   * (e.g. a page's hero) should pass `reveal={false}`.
   */
  reveal?: boolean;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * The consistent outer frame for every page section. Individual sections
 * still choreograph their own inner content (headings, cards, stats)
 * however they like — this wrapper only handles the things that should be
 * uniform site-wide: how a section arrives as you scroll to it, and how
 * cleanly it hands off to the one before and after it.
 */
export default function Section({
  id,
  className = '',
  children,
  seam = false,
  divider = false,
  reveal = true,
}: SectionProps) {
  const revealProps = reveal
    ? {
        initial: { opacity: 0, y: 28 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.15, margin: '-10% 0px -10% 0px' },
        transition: { duration: 0.7, ease: EASE },
      }
    : {};

  return (
    <motion.section
      id={id}
      {...revealProps}
      className={`relative ${seam ? 'section-seam' : ''} ${divider ? 'section-divider' : ''} ${className}`}
    >
      {children}
    </motion.section>
  );
}

/** Framer Motion variants shared across sections for consistent reveal motion. */
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

/** Slightly larger rise + fade, for hero-scale headlines. */
export const fadeUpLarge = {
  hidden: { opacity: 0, y: 36 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

/** A gentle scale + fade, good for cards and imagery. */
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

/** Tighter stagger for dense grids (e.g. icon rows, chip lists). */
export const staggerFast = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

/** Spring used for interactive hover/tap feedback on cards and buttons. */
export const springHover = { type: 'spring' as const, stiffness: 320, damping: 22 };

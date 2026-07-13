import { useRef } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { fadeUp, fadeUpLarge, staggerFast } from '../../../shared/utils/constants';
import MaterialIcon from '../../../shared/components/MaterialIcon';
import KaizenMark from '../../../shared/components/KaizenMark';
import type { HomepageData, ServiceTeaser } from '../../../shared/models/types';

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

// Fixed placement for the three-photo "ledger stack" signature element.
// Each entry is a card in the stack: offset, rotation, and z-index tuned by
// hand so they read as overlapping ledger entries rather than a grid.
const STACK_LAYOUT = [
  { top: '0%', left: '8%', rotate: -7, z: 30, w: 210, h: 260 },
  { top: '20%', left: '38%', rotate: 5, z: 20, w: 192, h: 244 },
  { top: '42%', left: '4%', rotate: -3, z: 10, w: 184, h: 226 },
];

interface StackCardProps {
  service: ServiceTeaser;
  layout: (typeof STACK_LAYOUT)[number];
  index: number;
}

/**
 * A single photo in the ledger stack. On top of the entrance drop and the
 * flatten-on-hover tilt, the card also tracks the cursor position within its
 * own bounds and leans into it — a light 3D effect (via rotateX/rotateY,
 * separate transform channels from the `rotate` used for the scattered
 * entrance) that rewards a closer look without asking for a click.
 */
function StackCard({ service, layout, index }: StackCardProps) {
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springX = useSpring(tiltX, { stiffness: 260, damping: 18 });
  const springY = useSpring(tiltY, { stiffness: 260, damping: 18 });

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    tiltY.set(px * 16);
    tiltX.set(py * -16);
  }

  function handlePointerLeave() {
    tiltX.set(0);
    tiltY.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate: layout.rotate }}
      transition={{ duration: 0.7, delay: 0.3 + index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ rotate: 0, scale: 1.05, zIndex: 40 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        top: layout.top,
        left: layout.left,
        width: layout.w,
        height: layout.h,
        zIndex: layout.z,
        rotateX: springX,
        rotateY: springY,
        transformPerspective: 900,
      }}
      className="absolute rounded-2xl overflow-hidden border border-gold/25 shadow-card bg-surface"
    >
      <img
        src={service.image.src}
        alt={service.image.alt}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/10 to-transparent" />
      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
        <span className="font-mono text-[11px] text-gold/90 bg-navy-deep/70 rounded px-1.5 py-0.5">
          0{index + 1}
        </span>
        <span className="font-label-bold text-label-bold text-on-primary truncate">{service.title}</span>
      </div>
    </motion.div>
  );
}

/**
 * The homepage gets its own hero rather than reusing the shared PageHero
 * used by inner pages. Instead of one full-bleed background photo, three
 * photos — one per specialty — are arranged as an overlapping "ledger
 * stack", each tagged with a mono index number, so the hero itself states
 * the brief: one team, three specialties. The stack also drifts gently
 * upward as the page scrolls past it, giving the hero a sense of depth
 * rather than sitting flat against the copy.
 */
export default function Hero({ data }: HeroProps) {
  const words = data.headline.split(' ');
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const stackY = useTransform(scrollYProgress, [0, 1], [0, -64]);
  const stackOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0.4]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-kaizen-grid flex flex-col justify-center min-h-[calc(100dvh-5rem)] pt-24 pb-10 md:pt-16 md:pb-12"
    >
      <div className="absolute inset-0 bg-kaizen-mesh pointer-events-none" />

      <div className="max-w-container-max-width mx-auto px-6 relative w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-8 items-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold font-label-bold text-label-bold mb-5"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
              </span>
              {data.eyebrow}
            </motion.span>

            <motion.h1
              initial="hidden"
              animate="visible"
              variants={staggerFast}
              aria-label={data.headline}
              className="font-display-lg text-[32px] sm:text-[46px] md:text-[56px] font-bold leading-[1.08] tracking-tight text-on-background mb-5 flex flex-wrap gap-x-3"
            >
              {words.map((word, i) => (
                <motion.span key={`${word}-${i}`} variants={wordVariants} className="inline-block">
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              variants={fadeUpLarge}
              custom={0.3}
              className="font-body-lg text-body-lg text-on-surface-variant mb-7 max-w-lg"
            >
              {data.subheadline}
            </motion.p>

            <motion.div variants={fadeUp} custom={0.4} className="flex flex-col sm:flex-row gap-4">
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

          {/* Ledger stack — desktop/tablet only */}
          <motion.div
            className="relative hidden md:block h-[380px]"
            style={{ y: stackY, opacity: stackOpacity }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -top-6 right-6 text-gold/60 z-40"
            >
              <KaizenMark size={44} />
            </motion.div>

            {data.services.map((service, index) => (
              <StackCard
                key={service.id}
                service={service}
                layout={STACK_LAYOUT[index % STACK_LAYOUT.length]}
                index={index}
              />
            ))}
          </motion.div>

          {/* Compact strip for mobile — same three photos, no overlap */}
          <div className="grid grid-cols-3 gap-3 md:hidden">
            {data.services.map((service, index) => (
              <div key={service.id} className="relative h-28 rounded-xl overflow-hidden border border-gold/20">
                <img src={service.image.src} alt={service.image.alt} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 to-transparent" />
                <span className="absolute bottom-1.5 left-1.5 font-mono text-[10px] text-gold/90">0{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

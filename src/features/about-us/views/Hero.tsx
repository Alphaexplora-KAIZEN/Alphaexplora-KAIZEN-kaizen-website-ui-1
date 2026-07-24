import { motion } from 'framer-motion';
import { fadeUp, fadeUpLarge } from '../../../shared/utils/constants';
import MaterialIcon from '../../../shared/components/MaterialIcon';
import ElectricBorder from '../../../shared/components/ElectricBorder';
import type { AboutUsData } from '../../../shared/models/types';
import heroBg from '../../../assets/property-management/Family_in_couch_2.png';

interface HeroProps {
  data: AboutUsData;
}

/** Small brand badges shown under the copy — static, not page-data driven. */
const badges = [
  { icon: 'verified', label: 'Professional Grade', effect: 'shine' as const },
  { icon: 'bolt', label: 'Efficiency Driven', effect: 'lightning' as const },
];

/**
 * The three service pillars shown in the hero stat row — static brand
 * copy (Property Management / Premium Cleaning / Technical Maintenance),
 * not page milestone data, since the tag+word pairing is fixed regardless
 * of what the milestones dataset contains.
 */
const PILLARS = [
  { tag: 'Property', value: 'Management', accent: 'text-teal', border: 'border-teal' },
  { tag: 'Premium', value: 'Cleaning', accent: 'text-gold', border: 'border-gold' },
  { tag: 'Technical', value: 'Maintenance', accent: 'text-blue', border: 'border-blue' },
];

/**
 * About Us hero — full-bleed photo treatment (family at home, dark
 * gradient overlay) sized to fill exactly one viewport (like the other
 * page heroes) rather than a tall image with copy crammed at the bottom.
 * The headline slot renders the full-color logo lockup instead of set
 * type, with a plain "ABOUT" eyebrow above it.
 */
export default function Hero({ data }: HeroProps) {
  const { headline, subheadline } = data;

  return (
    <section className="relative min-h-[calc(100vh-5rem)] flex items-center overflow-hidden bg-navy-deep">
      {/* Scoped styles for the "Efficiency Driven" hover effect. The badge
          is wrapped in <ElectricBorder>, whose canvas keeps tracing its
          crackling border continuously in the background (cheap for a
          single small badge), but its glow layers stay invisible until
          hover — so the reveal still reads as "hover turns this on",
          just with the ElectricBorder look instead of the old
          conic-gradient sweep. */}
      <style>{`
        .kz-electric-badge .eb-canvas-container,
        .kz-electric-badge .eb-layers {
          opacity: 0;
          transition: opacity 0.4s ease-out;
        }
        .kz-electric-badge:hover .eb-canvas-container,
        .kz-electric-badge:hover .eb-layers {
          opacity: 1;
        }
        .kz-electric-badge:hover .kz-electric-icon {
          filter: drop-shadow(0 0 6px #2fcda8);
        }
        .kz-electric-icon {
          transition: filter 0.3s ease-out;
        }
      `}</style>

      <img
        src={heroBg}
        alt="Family relaxing together at home, reflecting the peace of mind Kaizen provides"
        className="absolute inset-0 w-full h-full object-cover object-[85%_center]"
      />
      {/* Legibility overlays: dark from the left (behind text) fading toward the photo */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/85 to-navy-deep/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/10 to-transparent" />

      <div className="relative z-10 max-w-container-max-width mx-auto px-6 w-full py-16">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-3xl">
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2.5 text-teal font-label-bold text-[15px] uppercase tracking-[0.25em] mb-6"
          >
            <span className="h-2 w-2 rounded-full bg-teal" />
            <span className="font-bold">About Us</span>
          </motion.span>

          <motion.div
            variants={fadeUpLarge}
            initial="hidden"
            animate="visible"
            custom={0.15}
            className="mb-8"
          >
            <img
              src="/assets/logo_with_name_white_Green.png"
              alt={headline}
              className="w-full max-w-md sm:max-w-xl md:max-w-2xl h-auto"
            />
          </motion.div>

          <motion.p
            variants={fadeUpLarge}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="font-body-lg text-[20px] leading-relaxed text-on-surface-variant mb-10 max-w-2xl text-justify"
          >
            {subheadline}
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={0.4}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-4 mb-14"
          >
            {badges.map((badge) => {
              const isLightning = badge.effect === 'lightning';

              if (isLightning) {
                return (
                  <ElectricBorder
                    key={badge.label}
                    color="#2FCDA8"
                    speed={1.5}
                    chaos={0.08}
                    borderRadius={999}
                    className="kz-electric-badge inline-flex items-center gap-2.5 px-6 py-3 border border-white/25 bg-white/5 backdrop-blur-sm text-on-background font-label-bold text-[14px] uppercase tracking-wide"
                  >
                    <MaterialIcon name={badge.icon} filled className="kz-electric-icon relative text-[20px] text-teal" />
                    <span className="relative">{badge.label}</span>
                  </ElectricBorder>
                );
              }

              return (
                <span
                  key={badge.label}
                  className="group/badge relative inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-white/25 bg-white/5 backdrop-blur-sm text-on-background font-label-bold text-[14px] uppercase tracking-wide overflow-hidden"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[20deg] bg-gradient-to-r from-transparent via-blue/60 to-transparent transition-transform duration-1000 ease-out group-hover/badge:translate-x-full"
                  />

                  <MaterialIcon name={badge.icon} filled className="relative text-[20px] text-blue" />
                  <span className="relative">{badge.label}</span>
                </span>
              );
            })}
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          custom={0.5}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap gap-4 max-w-3xl"
        >
          {PILLARS.map((pillar) => (
            <div
              key={pillar.tag}
              className={`flex-1 min-w-[160px] bg-surface/70 backdrop-blur-sm border-l-4 ${pillar.border} rounded-lg px-5 py-4`}
            >
              <p className={`font-label-bold text-[12px] uppercase tracking-wide mb-1.5 ${pillar.accent}`}>
                {pillar.tag}
              </p>
              <p className="font-headline-sm text-[22px] font-semibold text-on-background leading-tight">
                {pillar.value}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

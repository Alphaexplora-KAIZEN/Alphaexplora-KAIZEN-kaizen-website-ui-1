import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeUp, staggerContainer } from '../../../shared/utils/constants';
import MaterialIcon from '../../../shared/components/MaterialIcon';
import Section from '../../../shared/components/Section';

const SERVICES = [
  {
    id: 'property-management',
    icon: 'apartment',
    label: 'Property Management',
    description: 'Market, lease, and maintain with full-cycle accountability.',
    accent: 'text-teal',
    ring: 'group-hover:border-teal/50',
  },
  {
    id: 'cleaning-services',
    icon: 'cleaning_services',
    label: 'Cleaning Services',
    description: 'Condo, home, office, and deep-cleaning, on T.I.M.E.',
    accent: 'text-blue',
    ring: 'group-hover:border-blue/50',
  },
  {
    id: 'aircon-care',
    icon: 'air',
    label: 'Aircon Care',
    description: 'Cleaning, chemical wash, and maintenance that lasts.',
    accent: 'text-gold',
    ring: 'group-hover:border-gold/50',
  },
];

/**
 * The page's opening statement. Previously just a badge, headline, and
 * subheading floating on the plain page background — every other page on
 * the site opens with a proper hero (a photo, a mesh backdrop, something to
 * look at), so this felt thin by comparison. It now sits on the same
 * grid + brass mesh backdrop the homepage hero uses, and closes with a row
 * of three preview chips — one per specialty — that double as a first,
 * inviting jump to each section below (the sticky QuickNav takes over that
 * job once you've scrolled past it).
 */
export default function PageIntro() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <Section className="snap-start scroll-mt-[var(--wwd-sticky-offset)] relative overflow-hidden bg-kaizen-grid flex flex-col justify-center min-h-[calc(100dvh-5rem)] pt-24 pb-10 md:pt-16 md:pb-12">
      <div className="absolute inset-0 bg-kaizen-mesh pointer-events-none" />

      <div className="max-w-container-max-width mx-auto px-6 relative">
        <motion.div
          ref={sectionRef}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="flex flex-col items-center text-center"
        >
          <motion.h1
            variants={fadeUp}
            className="font-display-lg text-[clamp(18px,4.4vw,56px)] font-bold leading-[1.05] tracking-tight text-on-background mb-6 whitespace-nowrap"
          >
            We Market. We Manage. We Maintain.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="font-body-lg text-xl text-on-surface-variant max-w-3xl mb-10 md:mb-12 text-center"
          >
            One team behind your property, your space, and your air, with property management, cleaning, and
            aircon care all held to the same standard of accountability. Pick a service below to see how it
            works.
          </motion.p>

          <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 w-full text-left">
            {SERVICES.map((service, index) => (
              <a
                key={service.id}
                href={`#${service.id}`}
                className={`group relative flex items-start gap-5 rounded-2xl border border-outline-variant bg-surface/60 backdrop-blur-sm p-6 transition-all duration-300 hover:-translate-y-0.5 hover:bg-surface focus-ring ${service.ring}`}
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-surface-container-low">
                  <MaterialIcon name={service.icon} filled className={`text-2xl ${service.accent}`} />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs text-on-surface-variant/70">0{index + 1}</span>
                    <span className="font-label-bold text-lg text-on-background">{service.label}</span>
                  </span>
                  <span className="block font-body-md text-base text-on-surface-variant leading-snug">
                    {service.description}
                  </span>
                </span>
                <MaterialIcon
                  name="arrow_downward"
                  className="absolute top-6 right-6 text-lg text-on-surface-variant/50 transition-transform duration-300 group-hover:translate-y-1"
                />
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}

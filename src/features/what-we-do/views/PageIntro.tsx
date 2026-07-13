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
    description: 'Market, lease, and maintain — full-cycle accountability.',
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
    <Section className="relative overflow-hidden bg-kaizen-grid flex flex-col justify-center min-h-[calc(100dvh-5rem)] pt-24 pb-10 md:pt-16 md:pb-12">
      <div className="absolute inset-0 bg-kaizen-mesh pointer-events-none" />

      <div className="max-w-container-max-width mx-auto px-6 relative">
        <motion.div
          ref={sectionRef}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold font-label-bold text-label-bold mb-4"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            What We Do
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="font-display-lg text-[32px] sm:text-[42px] md:text-[48px] font-bold leading-[1.08] tracking-tight text-on-background mb-4 max-w-3xl"
          >
            One Team for Your Property, Your Space, and Your Air.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-8 md:mb-10"
          >
            We Market. We Manage. We Maintain. Three specialties, one standard of care — pick a service below to
            see how it works.
          </motion.p>

          <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {SERVICES.map((service, index) => (
              <a
                key={service.id}
                href={`#${service.id}`}
                className={`group relative flex items-start gap-4 rounded-2xl border border-outline-variant bg-surface/60 backdrop-blur-sm p-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-surface focus-ring ${service.ring}`}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-container-low">
                  <MaterialIcon name={service.icon} filled className={`text-xl ${service.accent}`} />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[11px] text-on-surface-variant/70">0{index + 1}</span>
                    <span className="font-label-bold text-label-bold text-on-background">{service.label}</span>
                  </span>
                  <span className="block font-body-md text-sm text-on-surface-variant leading-snug">
                    {service.description}
                  </span>
                </span>
                <MaterialIcon
                  name="arrow_downward"
                  className="absolute top-5 right-5 text-base text-on-surface-variant/50 transition-transform duration-300 group-hover:translate-y-1"
                />
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}

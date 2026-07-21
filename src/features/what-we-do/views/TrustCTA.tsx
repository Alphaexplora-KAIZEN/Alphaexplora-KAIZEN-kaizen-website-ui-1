import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeUp, staggerContainer } from '../../../shared/utils/constants';
import Section from '../../../shared/components/Section';
import CountUp from '../../../shared/components/CountUp';

const STATS = [
  { id: 'retention', value: '98%', label: 'Tenant Retention Rate' },
  { id: 'support', value: '24/7', label: 'Dedicated Local Support' },
  { id: 'values', value: 'T.I.M.E.', label: 'Trust · Integrity · Mastery · Efficiency' },
];

export default function TrustCTA() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2, margin: '-80px' });

  return (
    <Section className="py-section-gap-mobile md:py-section-gap-desktop">
      <div className="max-w-container-max-width mx-auto px-6">
        <motion.div
          ref={sectionRef}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="relative overflow-hidden bg-navy-deep bg-grain rounded-[40px] px-8 py-16 md:px-16 md:py-20 text-center"
        >
          <div className="pointer-events-none absolute -top-32 -left-16 h-72 w-72 rounded-full bg-teal/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-teal/10 blur-3xl" />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="relative flex flex-wrap items-center justify-center gap-10 md:gap-16 mb-12"
          >
            {STATS.map((stat) => (
              <motion.div key={stat.id} variants={fadeUp} className="text-center">
                <p className="font-mono tabular-nums text-headline-md text-[32px] font-semibold text-blue">
                  <CountUp value={stat.value} active={isInView} />
                </p>
                <p className="font-body-md text-body-md text-primary-fixed-dim mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <h2 className="relative font-headline-md text-headline-md text-on-primary mb-4">
            As a family-owned business, we care for every space as if it were our own.
          </h2>
          <p className="relative font-body-md text-body-md text-primary-fixed-dim mb-8 max-w-xl mx-auto">
            Whichever service you need, our team is one call away.
          </p>
          <div className="relative flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+639196778350"
              className="inline-flex items-center justify-center gap-2 bg-blue text-white font-label-bold text-label-bold px-8 py-4 rounded-full hover:bg-navy hover:scale-[1.02] transition-all duration-300 shadow-glow hover:shadow-glow-hover focus-ring"
            >
              Call Property Management
            </a>
            <a
              href="tel:+639120875598"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-teal/40 text-teal font-label-bold text-label-bold px-8 py-4 rounded-full hover:bg-teal/10 hover:border-teal transition-all duration-300 focus-ring"
            >
              Call Cleaning & Aircon
            </a>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

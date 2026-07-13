import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeUp, staggerContainer } from '../../../shared/utils/constants';
import Section from '../../../shared/components/Section';
import CountUp from '../../../shared/components/CountUp';
import KaizenMark from '../../../shared/components/KaizenMark';
import MaterialIcon from '../../../shared/components/MaterialIcon';
import type { HomepageData } from '../../../shared/models/types';

interface StatsCTAProps {
  data: HomepageData;
}

/**
 * A full-bleed "ledger ribbon" — hairline gold rules top and bottom, mono
 * numerals for the stats — rather than a rounded floating card with glow
 * blobs. Stats and the closing CTA sit side by side as entries in the same
 * row, divided by hairlines, echoing the brand's ledger motif. The ambient
 * blobs drift slowly rather than sitting static, and a large, faint Kaizen
 * mark turns quietly in the background — the same mark that appears small
 * and sharp in the hero now reappears big and soft here, like a seal
 * closing out the page.
 */
export default function StatsCTA({ data }: StatsCTAProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2, margin: '-80px' });

  return (
    <Section seam className="relative py-16 md:py-20 bg-navy-deep bg-grain border-y border-gold/20 overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -left-16 h-64 w-64 rounded-full bg-gold/10 blur-3xl animate-float" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-teal/10 blur-3xl animate-float-delay" />
      <div className="pointer-events-none absolute -right-16 top-1/2 hidden -translate-y-1/2 text-gold/[0.06] lg:block">
        <KaizenMark size={240} />
      </div>

      <div className="max-w-container-max-width mx-auto px-6 relative">
        <motion.div
          ref={sectionRef}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="flex flex-col md:flex-row md:items-center gap-10 md:gap-0"
        >
          <div className="flex flex-wrap gap-10 md:gap-0 md:shrink-0">
            {data.trustStats.map((stat, index) => (
              <motion.div
                key={stat.id}
                variants={fadeUp}
                whileHover={{ y: -3 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className={`text-left ${index > 0 ? 'md:pl-10 md:ml-10 md:border-l md:border-gold/20' : ''}`}
              >
                <p className="font-mono tabular-nums text-headline-md text-[30px] font-semibold text-gold">
                  <CountUp value={stat.value} active={isInView} />
                </p>
                <p className="font-body-md text-body-md text-primary-fixed-dim mt-1 whitespace-nowrap">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={fadeUp}
            className="md:pl-10 md:ml-10 md:border-l md:border-gold/20 flex-1 flex flex-col md:flex-row md:items-center gap-6 md:gap-8"
          >
            <div className="flex-1">
              <h2 className="font-headline-md text-headline-md text-on-primary mb-2">{data.ctaHeadline}</h2>
              <p className="font-body-md text-body-md text-primary-fixed-dim max-w-md">{data.ctaSubheading}</p>
            </div>
            <a
              href={data.ctaHref}
              className="group inline-flex items-center justify-center gap-2 bg-gold text-navy-deep font-label-bold text-label-bold px-8 py-4 rounded-full hover:bg-primary-fixed hover:scale-[1.02] transition-all duration-300 shadow-glow hover:shadow-glow-hover focus-ring shrink-0 whitespace-nowrap"
            >
              {data.ctaLabel}
              <MaterialIcon
                name="arrow_forward"
                filled
                className="text-[20px] transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}

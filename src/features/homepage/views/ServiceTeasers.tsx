import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { fadeUp, staggerContainer } from '../../../shared/utils/constants';
import MaterialIcon from '../../../shared/components/MaterialIcon';
import type { HomepageData } from '../../../shared/models/types';

interface ServiceTeasersProps {
  data: HomepageData;
}

/**
 * Three specialties are a real, enumerable list — not an arbitrary set of
 * cards — so this reads as a "ledger" of entries: a mono index, a thumbnail,
 * and a hairline rule between rows, rather than three equal boxes in a grid.
 */
export default function ServiceTeasers({ data }: ServiceTeasersProps) {
  const sectionRef1 = useRef(null);
  const isInView1 = useInView(sectionRef1, { once: true, amount: 0.2, margin: '-80px' });
  const sectionRef2 = useRef(null);
  const isInView2 = useInView(sectionRef2, { once: true, amount: 0.2, margin: '-80px' });

  return (
    <section className="py-section-gap-mobile md:py-section-gap-desktop bg-surface-container-low">
      <div className="max-w-container-max-width mx-auto px-6">
        <motion.div
          ref={sectionRef1}
          initial="hidden"
          animate={isInView1 ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="max-w-2xl mb-12"
        >
          <span className="inline-flex items-center gap-2 font-label-bold text-label-bold text-gold uppercase tracking-wider mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            What we do
          </span>
          <h2 className="font-headline-md text-headline-md text-on-background mb-4">{data.servicesHeading}</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">{data.servicesSubheading}</p>
        </motion.div>

        <motion.div
          ref={sectionRef2}
          initial="hidden"
          animate={isInView2 ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="border-t border-gold/20"
        >
          {data.services.map((service, index) => (
            <motion.div key={service.id} variants={fadeUp}>
              <Link
                to={service.href}
                className="group flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8 py-7 px-2 -mx-2 rounded-2xl border-b border-gold/20 hover:bg-surface/60 transition-colors duration-300 focus-ring"
              >
                <span className="font-mono text-gold/60 text-sm w-8 shrink-0">0{index + 1}</span>

                <div className="relative w-full sm:w-32 h-24 sm:h-20 rounded-xl overflow-hidden shrink-0">
                  <img
                    src={service.image.src}
                    alt={service.image.alt}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                </div>

                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-soft text-teal">
                  <MaterialIcon name={service.icon} className="text-[22px]" />
                </span>

                <div className="flex-1 min-w-0">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">{service.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">{service.description}</p>
                </div>

                <span className="hidden sm:inline-flex items-center gap-2 font-label-bold text-label-bold text-gold shrink-0">
                  Learn more
                  <MaterialIcon
                    name="arrow_forward"
                    className="text-base transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

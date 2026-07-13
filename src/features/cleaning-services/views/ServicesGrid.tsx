import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeUp, staggerContainer } from '../../../shared/utils/constants';
import MaterialIcon from '../../../shared/components/MaterialIcon';
import type { CleaningServicesData } from '../../../shared/models/types';

interface ServicesGridProps {
  data: CleaningServicesData;
}

export default function ServicesGrid({ data }: ServicesGridProps) {
  const sectionRef1 = useRef(null);
  const isInView1 = useInView(sectionRef1, { once: true, amount: 0.2, margin: '-80px' });
  const sectionRef2 = useRef(null);
  const isInView2 = useInView(sectionRef2, { once: true, amount: 0.2, margin: '-80px' });

  return (
    <section id="services" className="py-section-gap-mobile md:py-section-gap-desktop bg-surface-container-low">
      <div className="max-w-container-max-width mx-auto px-6">
        <motion.div
          ref={sectionRef1}
          initial="hidden"
          animate={isInView1 ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="font-headline-md text-headline-md text-primary mb-4">{data.servicesHeading}</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">{data.servicesSubheading}</p>
        </motion.div>

        <motion.div
          ref={sectionRef2}
          initial="hidden"
          animate={isInView2 ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-grid-gutter"
        >
          {data.plans.map((plan) => (
            <motion.div
              key={plan.id}
              variants={fadeUp}
              className="bg-surface rounded-[24px] shadow-ambient hover:shadow-ambient-hover hover:scale-[1.02] transition-all duration-300 flex flex-col h-full border border-surface-variant relative overflow-hidden group"
            >
              {plan.badge && (
                <div className="absolute top-4 right-4 z-10 bg-primary-container text-on-primary font-label-sm text-label-sm px-4 py-1 rounded-full shadow-ambient">
                  {plan.badge}
                </div>
              )}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={plan.image.src}
                  alt={plan.image.alt}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/5 to-transparent" />
                <div className="absolute bottom-3 left-6 w-14 h-14 rounded-full bg-teal-soft flex items-center justify-center text-teal shadow-ambient">
                  <MaterialIcon name={plan.icon} className="text-[28px]" />
                </div>
              </div>
              <div className="p-card-padding pt-6 flex flex-col flex-grow">
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3">{plan.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6 flex-grow text-justify">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-on-surface-variant font-body-md text-body-md">
                      <MaterialIcon name="check_circle" filled className="text-teal text-[20px] mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href={data.bookingHref}
                  className={`w-full text-center font-label-bold text-label-bold px-6 py-3 rounded-full transition-all duration-300 focus-ring ${
                    plan.ctaStyle === 'filled'
                      ? 'bg-primary-container text-on-primary hover:bg-navy-deep'
                      : 'bg-transparent border-2 border-primary-container text-primary-container hover:bg-primary-container/5'
                  }`}
                >
                  {plan.ctaLabel}
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

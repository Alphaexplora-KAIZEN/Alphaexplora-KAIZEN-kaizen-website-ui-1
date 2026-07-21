import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeUp } from '../../../shared/utils/constants';
import Section from '../../../shared/components/Section';
import MaterialIcon from '../../../shared/components/MaterialIcon';
import type { CleaningServicesData } from '../../../shared/models/types';

interface ServicesGridProps {
  data: CleaningServicesData;
}

/**
 * The three cleaning plans used to sit in a repeated card grid — same photo
 * height, same padding, same rounded corners, three times over. Here they
 * read instead as entries in a running list: a large mono index, a wide
 * photo that alternates sides so the eye doesn't fall into a grid rhythm,
 * and a hairline rule marking where one plan ends and the next begins. The
 * "most popular" badge becomes a plain label in the copy instead of a
 * pill stamped on the corner of a card.
 */
export default function ServicesGrid({ data }: ServicesGridProps) {
  const sectionRef1 = useRef(null);
  const isInView1 = useInView(sectionRef1, { once: true, amount: 0.2, margin: '-80px' });

  return (
    <Section id="services" divider className="py-section-gap-mobile md:py-section-gap-desktop">
      <div className="max-w-container-max-width mx-auto px-6">
        <motion.div
          ref={sectionRef1}
          initial="hidden"
          animate={isInView1 ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="max-w-2xl mb-14 md:mb-20"
        >
          <h2 className="font-headline-md text-headline-md text-primary mb-4">{data.servicesHeading}</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">{data.servicesSubheading}</p>
        </motion.div>

        <div className="border-t border-outline-variant">
          {data.plans.map((plan, index) => {
            const reverse = index % 2 === 1;
            return (
              <PlanRow key={plan.id} plan={plan} index={index} bookingHref={data.bookingHref} reverse={reverse} />
            );
          })}
        </div>
      </div>
    </Section>
  );
}

function PlanRow({
  plan,
  index,
  bookingHref,
  reverse,
}: {
  plan: CleaningServicesData['plans'][number];
  index: number;
  bookingHref: string;
  reverse: boolean;
}) {
  const rowRef = useRef(null);
  const isInView = useInView(rowRef, { once: true, amount: 0.2, margin: '-80px' });

  return (
    <motion.div
      ref={rowRef}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeUp}
      className="border-b border-outline-variant py-10 md:py-14"
    >
      <div className={`grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-8 md:gap-14 items-center ${reverse ? 'md:[direction:rtl]' : ''}`}>
        <div className="relative h-52 md:h-72 overflow-hidden rounded-lg" style={reverse ? { direction: 'ltr' } : undefined}>
          <img
            src={plan.image.src}
            alt={plan.image.alt}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/50 to-transparent" />
        </div>

        <div style={reverse ? { direction: 'ltr' } : undefined}>
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-sm text-teal">{String(index + 1).padStart(2, '0')}</span>
            <MaterialIcon name={plan.icon} className="text-teal text-xl" />
            <h3 className="font-headline-sm text-headline-sm text-on-surface">{plan.title}</h3>
            {plan.badge && (
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-teal ml-1">{plan.badge}</span>
            )}
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6 max-w-xl">{plan.description}</p>

          <ul className="flex flex-wrap gap-x-8 gap-y-3 mb-8">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-on-surface-variant font-body-md text-body-md">
                <MaterialIcon name="check_circle" filled className="text-teal text-[18px]" />
                {feature}
              </li>
            ))}
          </ul>

          <a
            href={bookingHref}
            className="group inline-flex items-center gap-2 font-label-bold text-label-bold text-on-surface hover:text-primary transition-colors focus-ring"
          >
            {plan.ctaLabel}
            <MaterialIcon
              name="arrow_forward"
              filled
              className="text-[20px] transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

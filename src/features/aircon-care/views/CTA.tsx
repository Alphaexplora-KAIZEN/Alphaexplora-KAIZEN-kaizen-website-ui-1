import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeUp } from '../../../shared/utils/constants';
import Section from '../../../shared/components/Section';
import type { AirconCareData } from '../../../shared/models/types';

interface CTAProps {
  data: AirconCareData;
}

export default function CTA({ data }: CTAProps) {
  const sectionRef1 = useRef(null);
  const isInView1 = useInView(sectionRef1, { once: true, amount: 0.2, margin: '-80px' });

  return (
    <Section seam className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={data.ctaImage.src}
          alt={data.ctaImage.alt}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface-container-low/90 via-surface-container-low/55 to-surface-container-low/90" />
      </div>
      <motion.div
        ref={sectionRef1}
        initial="hidden"
        animate={isInView1 ? 'visible' : 'hidden'}
        variants={fadeUp}
        className="relative z-10 max-w-3xl mx-auto px-6 text-center space-y-8"
      >
        <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-teal">{data.ctaHeadline}</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant">{data.ctaSubheading}</p>
        <div className="pt-4">
          <a
            href={data.bookingHref}
            className="inline-block bg-primary-container text-on-primary rounded-full px-10 py-5 font-label-bold text-label-bold hover:bg-navy-deep transition-colors shadow-ambient text-lg focus-ring"
          >
            {data.ctaLabel}
          </a>
        </div>
      </motion.div>
    </Section>
  );
}

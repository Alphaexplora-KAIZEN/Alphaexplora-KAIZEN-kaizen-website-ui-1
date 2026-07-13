import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeUp } from '../../../shared/utils/constants';

export default function PageIntro() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section className="pt-section-gap-mobile md:pt-section-gap-desktop pb-10">
      <div className="max-w-container-max-width mx-auto px-6">
        <motion.div
          ref={sectionRef}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold font-label-bold text-label-bold mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            What We Do
          </span>
          <h1 className="font-display-lg text-[36px] sm:text-[48px] md:text-[56px] font-bold leading-[1.08] tracking-tight text-on-background mb-5">
            One Team for Your Property, Your Space, and Your Air.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            We Market. We Manage. We Maintain. Three specialties, one standard of care — pick a service below to
            see how it works.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

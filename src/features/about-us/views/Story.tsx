import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeUp, staggerContainer } from '../../../shared/utils/constants';
import type { AboutUsData } from '../../../shared/models/types';

interface StoryProps {
  data: AboutUsData;
}

export default function Story({ data }: StoryProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2, margin: '-80px' });

  return (
    <section className="py-section-gap-mobile md:py-section-gap-desktop">
      <div className="max-w-container-max-width mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-grid-gutter items-center">
        <motion.div
          ref={sectionRef}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="relative h-[320px] lg:h-[440px] rounded-[32px] overflow-hidden shadow-ambient order-2 lg:order-1"
        >
          <img src={data.storyImage.src} alt={data.storyImage.alt} className="absolute inset-0 w-full h-full object-cover" />
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="order-1 lg:order-2 space-y-6"
        >
          <h2 className="font-headline-md text-headline-md text-primary">{data.storyHeading}</h2>
          {data.storyParagraphs.map((paragraph) => (
            <p key={paragraph} className="font-body-lg text-body-lg text-on-surface-variant text-justify">
              {paragraph}
            </p>
          ))}

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="grid grid-cols-3 gap-4 pt-2"
          >
            {data.milestones.map((milestone) => (
              <motion.div
                key={milestone.id}
                variants={fadeUp}
                className="bg-surface rounded-2xl p-4 text-center shadow-ambient"
              >
                <p className="font-headline-sm text-headline-sm text-primary">{milestone.value}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">{milestone.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

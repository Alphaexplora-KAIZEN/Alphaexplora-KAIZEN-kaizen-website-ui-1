import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeUp, fadeUpLarge, staggerContainer } from '../../../shared/utils/constants';
import Section from '../../../shared/components/Section';
import MaterialIcon from '../../../shared/components/MaterialIcon';
import type { AboutUsData } from '../../../shared/models/types';

interface StoryProps {
  data: AboutUsData;
}

const MILESTONE_ICON: Record<string, string> = {
  retention: 'group',
  support: 'support_agent',
  values: 'workspace_premium',
};

/**
 * "Why Choose Kaizen" as a text-led dossier: two numbered reasons, drawn
 * straight from the story copy, sitting side by side on a hairline
 * divider, closed out by the milestone stats. No photo — the case for
 * Kaizen is made in words and numbers alone.
 */
export default function Story({ data }: StoryProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2, margin: '-80px' });

  return (
    <Section divider className="min-h-screen flex flex-col justify-center py-section-gap-mobile md:py-section-gap-desktop">
      <div className="max-w-container-max-width mx-auto px-6">
        <motion.div
          ref={sectionRef}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUpLarge}
          className="max-w-2xl space-y-3 mb-16 md:mb-20"
        >
          <span className="inline-flex items-center gap-2 font-label-bold text-label-bold text-blue uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-blue" />
            Family-run, since day one
          </span>
          <h2 className="font-display-lg-mobile text-display-lg-mobile lg:font-display-lg lg:text-display-lg text-primary">
            {data.storyHeading}
          </h2>
        </motion.div>

        {/* Two numbered reasons, on a shared divider */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 border-t border-outline-variant"
        >
          {data.storyParagraphs.map((paragraph, index) => (
            <motion.div
              key={paragraph}
              variants={fadeUp}
              custom={index * 0.15}
              className={`py-10 md:py-14 ${index === 0 ? 'md:pr-10 md:border-r border-b md:border-b-0 border-outline-variant' : 'md:pl-10'}`}
            >
              <span className="block font-mono text-sm text-teal mb-4">0{index + 1}</span>
              <p className="font-body-lg text-body-lg md:text-[19px] text-on-surface-variant">{paragraph}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Milestones — stat tiles closing the section */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6 mt-10 md:mt-14"
        >
          {data.milestones.map((milestone) => (
            <motion.div
              key={milestone.id}
              variants={fadeUp}
              className="flex items-center gap-5 rounded-2xl border border-outline-variant p-6 sm:p-8"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-teal-soft text-teal">
                <MaterialIcon name={MILESTONE_ICON[milestone.id] ?? 'star'} filled className="text-2xl" />
              </span>
              <span>
                <span className="block font-mono tabular-nums text-headline-sm text-2xl text-primary">
                  {milestone.value}
                </span>
                <span className="block font-label-sm text-label-sm text-on-surface-variant mt-1">
                  {milestone.label}
                </span>
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeUp, staggerContainer } from '../../../shared/utils/constants';
import MaterialIcon from '../../../shared/components/MaterialIcon';
import type { CoreValue } from '../../../shared/models/types';

interface ValuesProps {
  coreValues: CoreValue[];
}

const VALUE_ICON: Record<string, string> = {
  trust: 'verified_user',
  integrity: 'handshake',
  mastery: 'workspace_premium',
  efficiency: 'bolt',
};

/**
 * Calm, static presentation of the T.I.M.E. values for the About Us page.
 * The cleaning-services page has its own more playful, interactive version
 * of these same values (flip cards + autoplay background) which fits a
 * service page; About Us just needs to state them clearly.
 */
export default function Values({ coreValues }: ValuesProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2, margin: '-80px' });

  return (
    <section className="py-section-gap-mobile md:py-section-gap-desktop bg-surface-container-low">
      <div className="max-w-container-max-width mx-auto px-6">
        <motion.div
          ref={sectionRef}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="text-center max-w-2xl mx-auto mb-12 space-y-3"
        >
          <span className="inline-flex items-center gap-2 justify-center font-label-bold text-label-bold text-gold uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            On T.I.M.E.
          </span>
          <h2 className="font-headline-md text-headline-md text-on-background">The Values Behind Every Job</h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-grid-gutter"
        >
          {coreValues.map((value) => (
            <motion.div
              key={value.id}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="bg-surface rounded-2xl p-6 text-center shadow-ambient hover:shadow-ambient-hover transition-shadow duration-300"
            >
              <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-soft text-teal">
                <MaterialIcon name={VALUE_ICON[value.id] ?? 'star'} filled />
              </span>
              <p className="font-label-bold text-label-bold text-primary mb-1">{value.title}</p>
              <p className="font-body-md text-body-md text-on-surface-variant">{value.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

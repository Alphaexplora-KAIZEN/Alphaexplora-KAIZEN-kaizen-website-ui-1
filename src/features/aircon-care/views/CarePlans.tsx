import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { fadeUp, staggerContainer } from '../../../shared/utils/constants';
import MaterialIcon from '../../../shared/components/MaterialIcon';
import type { AirconCareData } from '../../../shared/models/types';

interface CarePlansProps {
  data: AirconCareData;
}

export default function CarePlans({ data }: CarePlansProps) {
  const sectionRef1 = useRef(null);
  const isInView1 = useInView(sectionRef1, { once: true, amount: 0.2, margin: '-80px' });
  const sectionRef2 = useRef(null);
  const isInView2 = useInView(sectionRef2, { once: true, amount: 0.2, margin: '-80px' });

  const [flippedId, setFlippedId] = useState<string | null>(null);

  const toggleFlip = (id: string) => {
    setFlippedId((current) => (current === id ? null : id));
  };

  return (
    <section id="plans" className="bg-surface-container-lowest py-section-gap-mobile md:py-section-gap-desktop">
      <div className="max-w-container-max-width mx-auto px-6">
        <motion.div
          ref={sectionRef1}
          initial="hidden"
          animate={isInView1 ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="text-center mb-4 space-y-4"
        >
          <h2 className="font-headline-md text-headline-md text-primary">{data.plansHeading}</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">{data.plansSubheading}</p>
        </motion.div>

        <motion.p
          initial="hidden"
          animate={isInView1 ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="text-center font-label-bold text-label-bold text-blue mb-12 flex items-center justify-center gap-2"
        >
          <MaterialIcon name="touch_app" className="text-lg" />
          Tap a card to see what's included
        </motion.p>

        <motion.div
          ref={sectionRef2}
          initial="hidden"
          animate={isInView2 ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          style={{ perspective: 1500 }}
        >
          {data.plans.map((plan) => {
            const highlight = plan.variant === 'highlight';
            const isFlipped = flippedId === plan.id;
            return (
              <motion.div
                key={plan.id}
                variants={fadeUp}
                className={`relative h-[420px] ${highlight ? 'md:-translate-y-4' : ''}`}
                style={{ perspective: 1200 }}
              >
                <motion.button
                  type="button"
                  onClick={() => toggleFlip(plan.id)}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -6 }}
                  className="w-full h-full text-left focus-ring rounded-[24px]"
                  style={{ transformStyle: 'preserve-3d' }}
                  aria-pressed={isFlipped}
                  aria-label={`${plan.title} card, tap to ${isFlipped ? 'hide' : 'reveal'} details`}
                >
                  {/* Front face */}
                  <div
                    className={`absolute inset-0 rounded-[24px] p-card-padding shadow-ambient hover:shadow-ambient-hover transition-shadow duration-300 flex flex-col h-full [backface-visibility:hidden] ${
                      highlight ? 'bg-navy-deep' : 'bg-blue/15 border border-blue/25'
                    }`}
                  >
                    {highlight && (
                      <motion.span
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute -top-3 right-6 bg-teal text-on-tertiary text-[11px] font-label-bold uppercase tracking-wide px-3 py-1 rounded-full shadow-soft"
                      >
                        Most Popular
                      </motion.span>
                    )}
                    <motion.div
                      whileHover={{ rotate: 12, scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                      className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
                        highlight ? 'bg-on-primary/10' : 'bg-blue/15'
                      }`}
                    >
                      <MaterialIcon
                        name={plan.icon}
                        className={`text-3xl ${highlight ? 'text-on-primary' : 'text-blue'}`}
                      />
                    </motion.div>
                    <h3 className={`font-headline-sm text-headline-sm mb-4 ${highlight ? 'text-on-primary' : 'text-primary'}`}>
                      {plan.title}
                    </h3>
                    <p
                      className={`font-body-md text-body-md flex-grow text-justify ${
                        highlight ? 'text-primary-fixed-dim' : 'text-on-surface-variant'
                      }`}
                    >
                      {plan.description}
                    </p>
                    <span
                      className={`mt-auto inline-flex items-center gap-2 font-label-bold text-label-bold ${
                        highlight ? 'text-on-primary' : 'text-blue'
                      }`}
                    >
                      See what's included
                      <MaterialIcon name="arrow_forward" className="text-base" />
                    </span>
                  </div>

                  {/* Back face */}
                  <div
                    className={`absolute inset-0 rounded-[24px] p-card-padding shadow-ambient flex flex-col h-full [backface-visibility:hidden] ${
                      highlight ? 'bg-navy-deep' : 'bg-blue/15 border border-blue/25'
                    }`}
                    style={{ transform: 'rotateY(180deg)' }}
                  >
                    <h3 className={`font-headline-sm text-headline-sm mb-6 ${highlight ? 'text-on-primary' : 'text-primary'}`}>
                      {plan.title}
                    </h3>
                    <ul className="space-y-4 mb-8">
                      <AnimatePresence>
                        {isFlipped &&
                          plan.features.map((feature, i) => (
                            <motion.li
                              key={feature}
                              initial={{ opacity: 0, x: -12 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 + i * 0.1, duration: 0.35 }}
                              className={`flex items-center gap-3 font-body-md text-body-md ${
                                highlight ? 'text-on-primary' : 'text-on-surface-variant'
                              }`}
                            >
                              <MaterialIcon
                                name="check_circle"
                                filled
                                className={`text-lg ${highlight ? 'text-primary' : 'text-blue'}`}
                              />
                              {feature}
                            </motion.li>
                          ))}
                      </AnimatePresence>
                    </ul>
                    <a
                      href={data.bookingHref}
                      onClick={(e) => e.stopPropagation()}
                      className={`w-full text-center py-3 rounded-full font-label-bold text-label-bold transition-colors mt-auto focus-ring ${
                        highlight
                          ? 'bg-on-primary text-primary-container hover:bg-primary-fixed'
                          : 'border border-blue/30 text-blue hover:bg-blue/10'
                      }`}
                    >
                      {plan.ctaLabel}
                    </a>
                  </div>
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

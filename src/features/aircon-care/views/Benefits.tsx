import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { fadeUp } from '../../../shared/utils/constants';
import Section from '../../../shared/components/Section';
import MaterialIcon from '../../../shared/components/MaterialIcon';
import type { AirconCareData } from '../../../shared/models/types';

interface BenefitsProps {
  data: AirconCareData;
}

export default function Benefits({ data }: BenefitsProps) {
  const sectionRef1 = useRef(null);
  const isInView1 = useInView(sectionRef1, { once: true, amount: 0.2, margin: '-80px' });
  const sectionRef2 = useRef(null);
  const isInView2 = useInView(sectionRef2, { once: true, amount: 0.2, margin: '-80px' });

  const [activeId, setActiveId] = useState(data.benefits[0]?.id);
  const activeBenefit = data.benefits.find((b) => b.id === activeId) ?? data.benefits[0];

  return (
    <Section seam className="bg-navy-deep py-section-gap-mobile md:py-section-gap-desktop">
      <div className="max-w-container-max-width mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-grid-gutter items-center">
        <motion.div
          ref={sectionRef1}
          initial="hidden"
          animate={isInView1 ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="lg:col-span-5 space-y-10"
        >
          <div>
            <h2 className="font-headline-md text-headline-md text-on-primary mb-4">{data.benefitsHeading}</h2>
            <p className="font-body-lg text-body-lg text-primary-fixed-dim">{data.benefitsSubheading}</p>
          </div>
          <div className="space-y-3">
            {data.benefits.map((benefit, index) => {
              const isActive = benefit.id === activeBenefit?.id;
              return (
                <motion.button
                  key={benefit.id}
                  type="button"
                  onClick={() => setActiveId(benefit.id)}
                  onMouseEnter={() => setActiveId(benefit.id)}
                  whileHover={{ x: 4 }}
                  className={`w-full flex gap-4 items-start text-left rounded-2xl p-4 transition-colors duration-300 focus-ring ${
                    isActive ? 'bg-on-primary/10' : 'hover:bg-on-primary/5'
                  }`}
                >
                  <motion.span
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      rotate: isActive ? 0 : 0,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center transition-colors duration-300 ${
                      isActive ? 'bg-teal' : 'bg-teal-soft'
                    }`}
                  >
                    <MaterialIcon
                      name={benefit.icon}
                      filled
                      className={`transition-colors duration-300 ${isActive ? 'text-on-tertiary' : 'text-teal'}`}
                    />
                  </motion.span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-label-bold text-label-bold text-teal">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h4 className="font-label-bold text-label-bold text-on-primary">{benefit.title}</h4>
                    </div>
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="font-body-md text-body-md text-primary-fixed-dim text-left md:text-justify overflow-hidden"
                        >
                          {benefit.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          ref={sectionRef2}
          initial="hidden"
          animate={isInView2 ? 'visible' : 'hidden'}
          variants={fadeUp}
          custom={0.15}
          className="lg:col-span-7 relative h-[400px] md:h-[600px] w-full rounded-[32px] overflow-hidden shadow-ambient mt-8 lg:mt-0"
        >
          <img
            src={data.benefitsImage.src}
            alt={data.benefitsImage.alt}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/60 via-navy-deep/0 to-transparent" />

          <AnimatePresence mode="wait">
            {activeBenefit && (
              <motion.div
                key={activeBenefit.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-6 left-6 right-6 md:left-8 md:right-auto md:max-w-sm bg-surface/95 backdrop-blur rounded-2xl p-5 shadow-card flex items-center gap-4"
              >
                <span className="w-11 h-11 rounded-full bg-teal flex items-center justify-center flex-shrink-0">
                  <MaterialIcon name={activeBenefit.icon} filled className="text-on-tertiary" />
                </span>
                <div>
                  <p className="font-label-bold text-label-bold text-primary">{activeBenefit.title}</p>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                    {String(data.benefits.findIndex((b) => b.id === activeBenefit.id) + 1).padStart(2, '0')} of{' '}
                    {String(data.benefits.length).padStart(2, '0')}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute top-6 right-6 flex gap-2">
            {data.benefits.map((benefit) => (
              <button
                key={benefit.id}
                type="button"
                aria-label={`Show ${benefit.title}`}
                onClick={() => setActiveId(benefit.id)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  benefit.id === activeBenefit?.id ? 'w-8 bg-on-primary' : 'w-2 bg-on-primary/40 hover:bg-on-primary/70'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}


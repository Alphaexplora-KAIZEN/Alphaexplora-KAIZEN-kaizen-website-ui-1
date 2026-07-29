import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeUp, staggerContainer } from '../../../shared/utils/constants';
import Section from '../../../shared/components/Section';
import MaterialIcon from '../../../shared/components/MaterialIcon';
import type { CleaningServicesData } from '../../../shared/models/types';

interface TargetSpacesProps {
  data: CleaningServicesData;
}

export default function TargetSpaces({ data }: TargetSpacesProps) {
  const sectionRef1 = useRef(null);
  const isInView1 = useInView(sectionRef1, { once: true, amount: 0.2, margin: '-80px' });
  const sectionRef2 = useRef(null);
  const isInView2 = useInView(sectionRef2, { once: true, amount: 0.2, margin: '-80px' });

  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <Section seam className="bg-navy-deep min-h-[85vh] flex flex-col">
      <motion.div
        ref={sectionRef1}
        initial="hidden"
        animate={isInView1 ? 'visible' : 'hidden'}
        variants={fadeUp}
        className="text-center max-w-2xl mx-auto px-6 pt-16 pb-10 space-y-3 shrink-0"
      >
        <h2 className="font-headline-md text-headline-md text-on-primary">{data.targetSpacesHeading}</h2>
        <p className="font-body-md text-body-md text-on-primary/80">{data.targetSpacesSubheading}</p>
      </motion.div>

      <motion.div
        ref={sectionRef2}
        initial="hidden"
        animate={isInView2 ? 'visible' : 'hidden'}
        variants={staggerContainer}
        className="flex flex-col md:flex-row flex-1 md:min-h-[520px]"
        onMouseLeave={() => setActiveId(null)}
      >
        {data.targetSpaces.map((space) => {
          const isActive = activeId === space.id;

          return (
            <motion.div
              key={space.id}
              variants={fadeUp}
              onMouseEnter={() => setActiveId(space.id)}
              onFocus={() => setActiveId(space.id)}
              onBlur={() => setActiveId(null)}
              onClick={() => setActiveId(isActive ? null : space.id)}
              tabIndex={0}
              role="button"
              aria-expanded={isActive}
              className="group relative flex-1 min-h-[250px] md:min-h-0 overflow-hidden cursor-pointer outline-none"
            >
              <img
                src={space.image.src}
                alt={space.image.alt}
                loading="lazy"
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                  isActive ? 'blur-0 scale-105' : 'blur-sm scale-100'
                }`}
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t from-navy-deep transition-opacity duration-700 ${
                  isActive ? 'via-navy-deep/40 to-navy-deep/0 opacity-95' : 'via-navy-deep/60 to-navy-deep/20 opacity-90'
                }`}
              />

              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface/90 backdrop-blur-sm flex items-center justify-center text-teal shadow-ambient shrink-0">
                <MaterialIcon name={space.icon} className="text-[20px] sm:text-[24px]" />
              </div>

              <div className="absolute bottom-4 sm:bottom-6 left-4 right-4 sm:left-5 sm:right-5">
                <p className="font-headline-sm text-lg sm:text-2xl text-on-primary leading-snug mb-1.5 sm:mb-2">
                  {space.label}
                </p>
                <p
                  className={`font-body-md text-sm sm:text-base text-on-primary/90 leading-relaxed transition-all duration-500 ease-out overflow-hidden ${
                    isActive
                      ? 'opacity-100 translate-y-0 max-h-20 sm:max-h-28 delay-150'
                      : 'opacity-0 translate-y-2 max-h-0'
                  }`}
                >
                  {space.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </Section>
  );
}

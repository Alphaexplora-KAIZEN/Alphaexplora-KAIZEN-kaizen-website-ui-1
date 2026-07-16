import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { fadeUp } from '../../../shared/utils/constants';
import MaterialIcon from '../../../shared/components/MaterialIcon';
import Section from '../../../shared/components/Section';
import type { HomepageData } from '../../../shared/models/types';

interface ServiceTeasersProps {
  data: HomepageData;
}

// How long a panel holds the spotlight before the next one takes over,
// while the visitor hasn't chosen one themselves.
const AUTO_ADVANCE_MS = 4500;

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/**
 * "What We Do" as three panels sharing one frame, laid shoulder to
 * shoulder like folders in a drawer. One is always open — its photo,
 * description, and link in full view — while the other two rest as
 * slim spines showing just a number, an icon, and a name. Hover or tap
 * a spine and it swaps places with the open panel; on mobile the same
 * interaction runs top-to-bottom instead of side-to-side.
 *
 * This replaces the earlier tab-and-stage layout. Where that version
 * kept the photo in a fixed frame and swapped its contents, this one
 * makes the three specialties visibly compete for the same shared
 * space — a more physical, "which one do you want to open" feel that
 * suits three services fighting for one homepage slot.
 */
export default function ServiceTeasers({ data }: ServiceTeasersProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2, margin: '-80px' });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const services = data.services;

  useEffect(() => {
    if (!isInView || isPaused) return undefined;
    const id = setTimeout(() => {
      setActiveIndex((i) => (i + 1) % services.length);
    }, AUTO_ADVANCE_MS);
    return () => clearTimeout(id);
  }, [isInView, isPaused, activeIndex, services.length]);

  return (
    <Section seam className="py-section-gap-mobile md:py-section-gap-desktop bg-surface-container-low overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <motion.div
          ref={sectionRef}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="max-w-2xl mb-8"
        >
          <span className="inline-flex items-center gap-2 font-label-bold text-label-bold text-gold uppercase tracking-wider mb-3">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
            </span>
            What we do
          </span>
          <h2 className="font-headline-md text-headline-md text-on-background mb-4">{data.servicesHeading}</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">{data.servicesSubheading}</p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
          custom={0.15}
          onMouseLeave={() => setIsPaused(false)}
          className="flex flex-col lg:flex-row gap-2 h-[820px] sm:h-[720px] lg:h-[640px] rounded-3xl overflow-hidden border border-gold/20 bg-surface p-1.5"
        >
          {services.map((service, index) => {
            const isActive = index === activeIndex;
            return (
              <motion.div
                key={service.id}
                layout
                transition={{ layout: { duration: 0.7, ease: EASE } }}
                style={{ flexGrow: isActive ? 8 : 1, flexBasis: 0 }}
                className="relative min-h-0 min-w-0 rounded-2xl overflow-hidden"
              >
                <div
                  role="button"
                  tabIndex={0}
                  aria-expanded={isActive}
                  aria-label={`Show ${service.title}`}
                  onMouseEnter={() => {
                    setIsPaused(true);
                    setActiveIndex(index);
                  }}
                  onFocus={() => {
                    setIsPaused(true);
                    setActiveIndex(index);
                  }}
                  onClick={() => {
                    setIsPaused(true);
                    setActiveIndex(index);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setIsPaused(true);
                      setActiveIndex(index);
                    }
                  }}
                  className="group absolute inset-0 h-full w-full cursor-pointer focus-ring"
                >
                  <img
                    src={service.image.src}
                    alt={service.image.alt}
                    className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out ${
                      isActive ? 'scale-100' : 'scale-110'
                    }`}
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-700 ${
                      isActive
                        ? 'from-navy-deep via-navy-deep/50 to-navy-deep/10 opacity-100'
                        : 'from-navy-deep/95 via-navy-deep/70 to-navy-deep/40 opacity-100'
                    }`}
                  />

                  {/* Number + icon — always visible, top of every panel */}
                  <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                    <span className="font-mono text-xs text-gold/80 tracking-wider">0{index + 1}</span>
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-500 ${
                        isActive ? 'bg-teal-soft text-teal' : 'bg-white/10 text-white/70'
                      }`}
                    >
                      <MaterialIcon name={service.icon} className="text-[18px]" />
                    </span>
                  </div>

                  {/* Collapsed label — vertical spine on desktop, horizontal on mobile */}
                  <span
                    className={`hidden lg:block absolute bottom-6 left-1/2 -translate-x-1/2 [writing-mode:vertical-rl] rotate-180 font-headline-sm text-base text-on-primary whitespace-nowrap transition-opacity duration-300 ${
                      isActive ? 'opacity-0 pointer-events-none' : 'opacity-100 delay-200'
                    }`}
                  >
                    {service.title}
                  </span>
                  <span
                    className={`lg:hidden absolute bottom-5 left-5 right-5 font-headline-sm text-lg text-on-primary transition-opacity duration-300 ${
                      isActive ? 'opacity-0 pointer-events-none' : 'opacity-100 delay-200'
                    }`}
                  >
                    {service.title}
                  </span>

                  {/* Expanded content — photo caption, description, link */}
                  <div
                    className={`absolute inset-x-0 bottom-0 p-6 sm:p-8 transition-all duration-500 ${
                      isActive ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 translate-y-3 pointer-events-none'
                    }`}
                  >
                    <h3 className="font-headline-md text-headline-md text-on-primary mb-3">{service.title}</h3>
                    <p className="font-body-md text-body-md text-on-primary/85 max-w-md mb-6">{service.description}</p>
                    <Link
                      to={service.href}
                      className="relative z-10 group/link inline-flex items-center gap-2 font-label-bold text-label-bold text-gold hover:text-primary-fixed transition-colors focus-ring rounded-full"
                    >
                      Learn more
                      <MaterialIcon
                        name="arrow_forward"
                        className="text-base transition-transform duration-300 group-hover/link:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </Section>
  );
}

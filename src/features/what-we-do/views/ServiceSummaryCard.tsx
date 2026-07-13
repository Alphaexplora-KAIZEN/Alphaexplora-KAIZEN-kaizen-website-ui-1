import { useRef, type ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeUp } from '../../../shared/utils/constants';
import MaterialIcon from '../../../shared/components/MaterialIcon';

export interface ServiceHighlight {
  id: string;
  icon: string;
  label: string;
}

interface ServiceSummaryCardProps {
  id: string;
  icon: string;
  title: string;
  description: string;
  image: { src: string; alt: string };
  highlights: ServiceHighlight[];
  ctaLabel: string;
  ctaHref: string;
  reverse?: boolean;
  theme: {
    badge: string;
    icon: string;
    chipBg: string;
    chipText: string;
  };
  children?: ReactNode;
}

/**
 * One concise, scannable summary of a service: what it is, three highlights,
 * and a single way to act on it. Replaces the old per-service stack of
 * hero + process/plans grid + why-choose/benefits + extra sections.
 */
export default function ServiceSummaryCard({
  id,
  icon,
  title,
  description,
  image,
  highlights,
  ctaLabel,
  ctaHref,
  reverse = false,
  theme,
}: ServiceSummaryCardProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2, margin: '-80px' });

  return (
    <section id={id} className="scroll-mt-28 py-8 md:py-10">
      <div className="max-w-container-max-width mx-auto px-6">
        <motion.div
          ref={sectionRef}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center bg-surface rounded-[32px] shadow-card overflow-hidden ${
            reverse ? 'md:[direction:rtl]' : ''
          }`}
        >
          <div className="relative h-56 md:h-full md:min-h-[320px]" style={reverse ? { direction: 'ltr' } : undefined}>
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className={`absolute top-5 left-5 w-14 h-14 rounded-2xl flex items-center justify-center shadow-card ${theme.badge}`}>
              <MaterialIcon name={icon} filled className="text-2xl" />
            </div>
          </div>

          <div className="p-card-padding md:pr-12 md:py-10" style={reverse ? { direction: 'ltr' } : undefined}>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-3">{title}</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">{description}</p>

            <ul className="space-y-3 mb-8">
              {highlights.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${theme.chipBg} ${theme.chipText}`}>
                    <MaterialIcon name={item.icon} filled className="text-lg" />
                  </span>
                  <span className="font-body-md text-body-md text-on-surface">{item.label}</span>
                </li>
              ))}
            </ul>

            <a
              href={ctaHref}
              className="group inline-flex items-center gap-2 bg-primary-container text-on-primary font-label-bold text-label-bold px-6 py-3.5 rounded-full transition-all duration-300 shadow-glow hover:shadow-glow-hover hover:bg-navy-deep hover:text-gold hover:scale-[1.02] focus-ring"
            >
              {ctaLabel}
              <MaterialIcon
                name="arrow_forward"
                filled
                className="text-[20px] transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

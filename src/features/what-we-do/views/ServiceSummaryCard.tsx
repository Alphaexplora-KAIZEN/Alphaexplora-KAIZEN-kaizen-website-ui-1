import { useRef, type ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeUp } from '../../../shared/utils/constants';
import Section from '../../../shared/components/Section';
import MaterialIcon from '../../../shared/components/MaterialIcon';

export interface ServiceHighlight {
  id: string;
  icon: string;
  label: string;
}

interface ServiceSummaryCardProps {
  id: string;
  index: number;
  count: number;
  icon: string;
  title: string;
  description: string;
  image: { src: string; alt: string };
  highlights: ServiceHighlight[];
  ctaLabel: string;
  ctaHref: string;
  reverse?: boolean;
  theme: {
    accent: string;
    bar?: string;
  };
  children?: ReactNode;
}

/**
 * One full-bleed editorial strip per service — a photo panel and a copy
 * panel sharing one row, alternating sides entry to entry, divided from
 * its neighbors by a hairline rather than sitting in its own boxed card.
 * The image runs edge to edge (no page gutter), carries a translucent
 * "01 / 03" waypoint tag in its lower corner, and gets a slow hover-zoom;
 * the copy panel keeps its own padding so text stays readable while the
 * photo bleeds past it.
 *
 * Both panels are pinned to the section's full height on desktop (a fixed
 * one-viewport height, not just a min-height), so the photo and the copy
 * block actually touch the section's top and bottom edges instead of
 * floating centered with gaps above and below. Mobile keeps a natural,
 * content-driven height so nothing gets clipped on short screens. Each
 * entry still fills one viewport so the three specialties read as three
 * unhurried screens rather than a long scroll.
 */
export default function ServiceSummaryCard({
  id,
  index,
  count,
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
    <Section
      id={id}
      className={`scroll-mt-36 relative min-h-[calc(100dvh-5rem)] lg:h-[calc(100dvh-5rem)] flex flex-col ${
        index > 1 ? 'border-t border-outline-variant' : ''
      }`}
    >
      <motion.div
        ref={sectionRef}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={fadeUp}
        className={`group grid grid-cols-1 lg:grid-cols-2 items-stretch flex-1 lg:h-full ${
          reverse ? 'lg:[direction:rtl]' : ''
        }`}
      >
        {/* Image panel — full-bleed, no page gutter, stretches to touch the
            section's top and bottom edges on desktop */}
        <div
          className="relative aspect-[4/3] lg:aspect-auto lg:h-full overflow-hidden"
          style={reverse ? { direction: 'ltr' } : undefined}
        >
          <img
            src={image.src}
            alt={image.alt}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 via-navy-deep/5 to-transparent" />
          <div className="absolute bottom-8 left-8 inline-flex items-center gap-2.5 bg-navy-deep/60 backdrop-blur-sm px-4 py-2">
            <MaterialIcon name={icon} filled className={`text-base ${theme.accent}`} />
            <span className={`font-mono text-xs uppercase tracking-[0.3em] ${theme.accent}`}>
              {String(index).padStart(2, '0')} / {String(count).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Copy panel — matches the photo's full height, text vertically
            centered within it and scaled up to hold its own beside a
            much taller image */}
        <div
          className="relative flex flex-col justify-center px-6 py-14 sm:px-10 md:px-16 lg:h-full lg:py-16 xl:px-20"
          style={reverse ? { direction: 'ltr' } : undefined}
        >
          <span
            className={`inline-flex items-center gap-2 font-label-bold text-label-bold uppercase tracking-[0.25em] mb-5 ${theme.accent}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${theme.bar ?? 'bg-gold'}`} />
            Kaizen Specialty
          </span>

          <h2 className="font-display-lg text-[38px] sm:text-[46px] md:text-[52px] xl:text-[58px] font-bold leading-[1.05] tracking-tight text-on-surface mb-5">
            {title}
          </h2>

          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-lg">{description}</p>

          <ul className="space-y-0 mb-8 border-t border-outline-variant max-w-lg">
            {highlights.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-3.5 border-b border-outline-variant">
                <MaterialIcon name={item.icon} filled className={`text-2xl shrink-0 ${theme.accent}`} />
                <span className="font-body-lg text-body-lg text-on-surface">{item.label}</span>
              </li>
            ))}
          </ul>

          <a
            href={ctaHref}
            className="group/link inline-flex items-center gap-2.5 font-label-bold text-lg text-on-surface hover:text-primary transition-colors focus-ring w-fit mb-4"
          >
            {ctaLabel}
            <MaterialIcon
              name="arrow_forward"
              filled
              className="text-2xl transition-transform duration-300 group-hover/link:translate-x-1"
            />
          </a>

          <div className={`h-px w-14 transition-all duration-700 group-hover:w-28 ${theme.bar ?? 'bg-gold'}`} />
        </div>
      </motion.div>
    </Section>
  );
}

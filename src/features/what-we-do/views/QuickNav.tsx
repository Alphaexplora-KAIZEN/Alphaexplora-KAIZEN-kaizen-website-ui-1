import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import MaterialIcon from '../../../shared/components/MaterialIcon';
import { useStickyOffset } from '../hooks/useStickyOffset';

const JUMP_LINKS = [
  { id: 'property-management', href: '#property-management', label: 'Property Management', icon: 'apartment' },
  { id: 'cleaning-services', href: '#cleaning-services', label: 'Cleaning Services', icon: 'cleaning_services' },
  { id: 'aircon-care', href: '#aircon-care', label: 'Aircon Care', icon: 'air' },
];

/**
 * A sticky wayfinder for the three service entries below. It used to be a
 * row of plain text links with no sense of where you actually were on the
 * page. Now it tracks scroll position — via IntersectionObserver against
 * each service's section — and slides a filled pill under whichever one is
 * currently in view, so the nav itself becomes a quiet progress marker as
 * you move through the page, not just a set of jump links.
 */
export default function QuickNav() {
  const [activeId, setActiveId] = useState<string>(JUMP_LINKS[0].id);
  const navRef = useRef<HTMLElement | null>(null);
  useStickyOffset(navRef);

  useEffect(() => {
    const sections = JUMP_LINKS
      .map((link) => document.getElementById(link.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (mostVisible) {
          setActiveId(mostVisible.target.id);
        }
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      ref={navRef}
      aria-label="Jump to a service"
      className="sticky top-16 z-30 bg-surface/90 backdrop-blur-md border-b border-outline-variant shadow-soft"
    >
      <div className="max-w-container-max-width mx-auto px-6 flex gap-1.5 sm:gap-2 py-3 overflow-x-auto no-scrollbar sm:justify-center">
        {JUMP_LINKS.map((link) => {
          const isActive = activeId === link.id;
          return (
            <a
              key={link.id}
              href={link.href}
              aria-current={isActive ? 'true' : undefined}
              className={`group relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2 font-label-bold text-label-bold transition-colors duration-300 focus-ring ${
                isActive ? 'text-navy-deep' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="quicknav-active-pill"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-gold"
                />
              )}
              <MaterialIcon
                name={link.icon}
                filled={isActive}
                className={`relative z-10 text-[18px] transition-transform duration-300 ${
                  isActive ? '' : 'group-hover:scale-110'
                }`}
              />
              <span className="relative z-10 whitespace-nowrap">{link.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}

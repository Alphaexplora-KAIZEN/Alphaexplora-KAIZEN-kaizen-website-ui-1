import { useRef } from 'react';
import { motion } from 'framer-motion';
import MaterialIcon from '../../../shared/components/MaterialIcon';
import { useStickyOffset } from '../hooks/useStickyOffset';

const JUMP_LINKS = [
  { id: 'property-management', label: 'Property Management', icon: 'apartment' },
  { id: 'cleaning-services', label: 'Cleaning Services', icon: 'cleaning_services' },
  { id: 'aircon-care', label: 'Aircon Care', icon: 'air' },
];

interface QuickNavProps {
  activeId: string;
  onSelect: (id: string) => void;
}

/**
 * A sticky wayfinder for the three services below. It used to track scroll
 * position across three separate sections and slide a pill under whichever
 * one was in view. Now that the three services live on a single flip-through
 * notebook screen (see ServiceNotebook) instead of a long scroll, this bar's
 * job changed from "track scroll position" to "drive which page is open" —
 * tapping a pill flips the notebook straight to that service.
 */
export default function QuickNav({ activeId, onSelect }: QuickNavProps) {
  const navRef = useRef<HTMLElement | null>(null);
  useStickyOffset(navRef);

  return (
    <nav
      ref={navRef}
      aria-label="Choose a service"
      className="sticky top-16 z-30 bg-surface/90 backdrop-blur-md border-b border-outline-variant shadow-soft"
    >
      <div className="max-w-container-max-width mx-auto px-6 flex gap-1.5 sm:gap-2 py-3 overflow-x-auto no-scrollbar sm:justify-center">
        {JUMP_LINKS.map((link) => {
          const isActive = activeId === link.id;
          return (
            <button
              key={link.id}
              type="button"
              onClick={() => onSelect(link.id)}
              aria-current={isActive ? 'true' : undefined}
              className={`group relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2 font-label-bold text-label-bold transition-colors duration-300 focus-ring ${
                isActive ? 'text-navy-deep' : 'text-on-surface-variant hover:text-teal'
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
            </button>
          );
        })}
      </div>
    </nav>
  );
}

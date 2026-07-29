import { useRef } from 'react';
import { motion } from 'framer-motion';
import MaterialIcon from '../../../shared/components/MaterialIcon';
import { useStickyOffset } from '../hooks/useStickyOffset';

const JUMP_LINKS = [
  { id: 'property-management', label: 'Property Management', shortLabel: 'Property', icon: 'apartment' },
  { id: 'cleaning-services', label: 'Cleaning Services', shortLabel: 'Cleaning', icon: 'cleaning_services' },
  { id: 'aircon-care', label: 'Aircon Care', shortLabel: 'Aircon Care', icon: 'air' },
];

interface QuickNavProps {
  activeId: string;
  onSelect: (id: string) => void;
  /**
   * Whether the service notebook section this bar navigates is currently
   * scrolled into view. Only meaningful on mobile (the parent always
   * passes `true` on desktop) — see useNotebookVisibility.
   */
  visible: boolean;
}

/**
 * A sticky wayfinder for the three services below. It used to track scroll
 * position across three separate sections and slide a pill under whichever
 * one was in view. Now that the three services live on a single flip-through
 * notebook screen (see ServiceNotebook) instead of a long scroll, this bar's
 * job changed from "track scroll position" to "drive which page is open" —
 * tapping a pill flips the notebook straight to that service.
 */
export default function QuickNav({ activeId, onSelect, visible }: QuickNavProps) {
  const navRef = useRef<HTMLElement | null>(null);
  useStickyOffset(navRef);

  return (
    <nav
      ref={navRef}
      aria-label="Choose a service"
      style={{ top: 'var(--wwd-navbar-offset, 4rem)' }}
      aria-hidden={!visible}
      className={`sticky z-30 bg-surface/90 backdrop-blur-md border-b border-outline-variant shadow-soft transition-[top,opacity] duration-300 ease-in-out ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="max-w-container-max-width mx-auto px-3 sm:px-6 grid grid-cols-3 gap-1 py-2.5 sm:flex sm:gap-2 sm:py-3 sm:justify-center">
        {JUMP_LINKS.map((link) => {
          const isActive = activeId === link.id;
          return (
            <button
              key={link.id}
              type="button"
              onClick={() => onSelect(link.id)}
              aria-current={isActive ? 'true' : undefined}
              className={`group relative flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 rounded-2xl sm:rounded-full px-1.5 py-2 sm:px-4 sm:py-2 font-label-bold text-label-bold transition-colors duration-300 focus-ring ${
                isActive ? 'text-navy-deep' : 'text-on-surface-variant hover:text-teal'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="quicknav-active-pill"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-2xl sm:rounded-full bg-gold"
                />
              )}
              <MaterialIcon
                name={link.icon}
                filled={isActive}
                className={`relative z-10 text-[19px] sm:text-[18px] transition-transform duration-300 ${
                  isActive ? '' : 'group-hover:scale-110'
                }`}
              />
              <span className="relative z-10 text-center leading-tight text-[10.5px] sm:text-label-bold sm:whitespace-nowrap">
                <span className="sm:hidden">{link.shortLabel}</span>
                <span className="hidden sm:inline">{link.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

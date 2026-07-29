import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { SiteBrand, NavLink } from '../models/types';
import MaterialIcon from './MaterialIcon';
import BookingModal from './BookingModal';
import { useScrollLock } from '../hooks/useScrollLock';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface NavbarProps {
  brand: SiteBrand;
  links: NavLink[];
}

export default function Navbar({ brand, links }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hideBar, setHideBar] = useState(false);
  const [forceHidden, setForceHidden] = useState(false);
  const lastScrollY = useRef(0);
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 767px)');
  useScrollLock(open);

  useEffect(() => {
    if (!isMobile) setHideBar(false);
  }, [isMobile]);

  useEffect(() => {
    if (open) setHideBar(false);
  }, [open]);

  // Other parts of the site (e.g. the What We Do page's hero scroll arrow
  // and its QuickNav service pills) want this bar to fade out immediately
  // — before their programmatic scroll starts — rather than waiting for
  // the scroll-driven heuristic below to catch up mid-flight. Fading it
  // out up front also lets QuickNav's sticky offset drop to 0 (see
  // useStickyOffset) before the scroll target is measured, so the jump
  // lands flush instead of landing short once the bar happens to hide
  // partway through the animation.
  useEffect(() => {
    const onForceHide = (event: Event) => {
      const detail = (event as CustomEvent<{ hidden: boolean }>).detail;
      setForceHidden(Boolean(detail?.hidden));
    };
    window.addEventListener('kaizen:force-hide-navbar', onForceHide);
    return () => window.removeEventListener('kaizen:force-hide-navbar', onForceHide);
  }, []);

  useEffect(() => {
    if (forceHidden && isMobile) setHideBar(true);
  }, [forceHidden, isMobile]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);

      if (!isMobile || open || forceHidden) {
        lastScrollY.current = y;
        return;
      }

      const delta = y - lastScrollY.current;
      if (y < 10) {
        setHideBar(false);
      } else if (delta > 4 && y > 80) {
        setHideBar(true);
      }
      lastScrollY.current = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMobile, open, forceHidden]);

  const isActive = (href: string) => href === location.pathname || (href === '/' && location.pathname === '');

  return (
    <nav
      data-site-navbar
      data-hidden={hideBar && isMobile ? 'true' : 'false'}
      style={{ pointerEvents: hideBar && isMobile ? 'none' : 'auto' }}
      className="fixed top-0 w-full z-50"
    >
      <motion.div
        animate={{ opacity: hideBar && isMobile ? 0 : 1 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className={`relative z-50 backdrop-blur-md transition-colors duration-300 ${
          scrolled ? 'bg-surface/95 shadow-[0_1px_0_rgba(47,205,168,0.12)]' : 'bg-surface/70'
        }`}
      >
        <div
          className={`grid grid-cols-[auto_1fr_auto] items-center w-full transition-all duration-300 ${
            scrolled ? 'h-16' : 'h-20'
          }`}
        >
          <Link to="/" className="group flex items-center gap-3.5 focus-ring rounded-lg pl-4 sm:pl-6">
            <img
              src="/assets/logo_with_name_white_Green.png"
              alt={brand.shortName}
              className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.04]"
            />
          </Link>

          <div />

          <div className="flex items-center justify-self-end gap-10 lg:gap-14">
            <div className="hidden md:flex gap-10 lg:gap-14 items-center">
              {links.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.id}
                    to={link.href}
                    className={`relative font-label-bold font-bold text-base md:text-lg pb-1 transition-colors duration-200 ${
                      active ? 'text-teal' : 'text-on-surface-variant hover:text-blue'
                    }`}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-active-underline"
                        className="absolute left-0 right-0 -bottom-0.5 h-[2px] rounded-full bg-teal"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setBookingOpen(true)}
              className="hidden md:inline-flex bg-primary-container text-on-primary font-label-bold text-label-bold px-6 py-3 rounded-full transition-all duration-200 hover:bg-navy-deep hover:text-teal hover:scale-[1.02] active:scale-95 focus-ring mr-4 sm:mr-6"
            >
              Contact Us
            </button>

            <button
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-full text-teal focus-ring mr-4 sm:mr-6"
            >
              <MaterialIcon name={open ? 'close' : 'menu'} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Pinned burger button: only rendered once the bar above starts hiding on scroll, so it stays reachable. */}
      <AnimatePresence>
        {hideBar && (
          <motion.button
            key="pinned-burger"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.15, ease: 'easeInOut' } }}
            exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeInOut' } }}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            style={{ pointerEvents: 'auto' }}
            className="md:hidden fixed top-3 right-4 sm:right-6 z-[60] flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-ambient-hover text-teal focus-ring"
          >
            <MaterialIcon name={open ? 'close' : 'menu'} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
            className="md:hidden fixed inset-0 z-40 bg-navy-deep/40 backdrop-blur-sm"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-16 left-4 right-4 z-50 rounded-2xl bg-surface-container-lowest shadow-ambient-hover overflow-hidden"
          >
            <div className="flex flex-col p-2">
              {links.map((link, i) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                >
                  <Link
                    to={link.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-xl px-4 py-3 text-label-bold font-label-bold transition-colors ${
                      isActive(link.href)
                        ? 'bg-teal-soft text-teal'
                        : 'text-on-surface-variant hover:bg-surface-container-low hover:text-teal'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setBookingOpen(true);
                }}
                className="mt-1 rounded-xl bg-primary-container px-4 py-3 text-center text-label-bold font-label-bold text-on-primary transition-transform active:scale-95"
              >
                Contact Us
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </nav>
  );
}

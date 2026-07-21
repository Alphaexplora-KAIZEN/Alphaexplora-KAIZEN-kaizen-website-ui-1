import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { SiteBrand, NavLink } from '../models/types';
import MaterialIcon from './MaterialIcon';
import BookingModal from './BookingModal';
import { useScrollLock } from '../hooks/useScrollLock';

interface NavbarProps {
  brand: SiteBrand;
  links: NavLink[];
}

export default function Navbar({ brand, links }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  useScrollLock(open);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) => href === location.pathname || (href === '/' && location.pathname === '');

  return (
    <nav
      data-site-navbar
      className={`fixed top-0 w-full z-50 backdrop-blur-md transition-all duration-300 ${
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
            src="/assets/logo_with_name_white_Blue_Green.png"
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

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mx-4 mb-4 rounded-2xl bg-surface-container-lowest shadow-ambient-hover overflow-hidden"
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
                        ? 'bg-primary-fixed text-on-primary-fixed'
                        : 'text-on-surface-variant hover:bg-surface-container-low hover:text-blue'
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

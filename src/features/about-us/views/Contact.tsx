import { useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { fadeUp, staggerContainer } from '../../../shared/utils/constants';
import Section from '../../../shared/components/Section';
import MaterialIcon from '../../../shared/components/MaterialIcon';
import ContactSignalBackdrop from './ContactSignalBackdrop';
import type { ContactInfo } from '../../../shared/models/types';

interface ContactProps {
  contactInfo: ContactInfo;
}

const ACCENTS = {
  blue: {
    text: 'text-blue',
    bg: 'bg-blue/12',
    ring: 'group-hover:border-blue/50',
    arrowHover: 'group-hover:text-blue',
    glow: 'rgba(62,123,255,0.28)',
  },
  teal: {
    text: 'text-teal',
    bg: 'bg-teal/12',
    ring: 'group-hover:border-teal/50',
    arrowHover: 'group-hover:text-teal',
    glow: 'rgba(47,205,168,0.28)',
  },
  gold: {
    text: 'text-gold',
    bg: 'bg-gold/12',
    ring: 'group-hover:border-gold/50',
    arrowHover: 'group-hover:text-gold',
    glow: 'rgba(217,167,91,0.28)',
  },
} as const;

type AccentKey = keyof typeof ACCENTS;

interface TileField {
  id: string;
  icon: string;
  label: string;
  value: string;
  href: string;
  accent: AccentKey;
  eyebrow: string;
}

/**
 * "Get in Touch" — rebuilt as a full-bleed two-column split that finally
 * uses the whole section instead of a narrow centered card. The left side
 * carries the pitch and the primary call action; the right side is a 2x2
 * grid of tilting, cursor-reactive channel tiles — each one leans toward
 * the pointer in 3D and lights up a soft directional glow, so choosing how
 * to reach us feels tactile rather than like scanning a list of links.
 */
export default function Contact({ contactInfo }: ContactProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15, margin: '-80px' });

  const fields: TileField[] = [
    {
      id: 'pm-phone',
      icon: 'apartment',
      eyebrow: 'Call',
      label: 'Property Management',
      value: contactInfo.propertyManagementPhone,
      href: contactInfo.propertyManagementPhoneHref,
      accent: 'blue',
    },
    {
      id: 'cs-phone',
      icon: 'cleaning_services',
      eyebrow: 'Call',
      label: 'Cleaning & Aircon Care',
      value: contactInfo.cleaningServicesPhone,
      href: contactInfo.cleaningServicesPhoneHref,
      accent: 'teal',
    },
    {
      id: 'email',
      icon: 'mail',
      eyebrow: 'Email',
      label: 'General Inquiries',
      value: contactInfo.email,
      href: contactInfo.emailHref,
      accent: 'gold',
    },
    {
      id: 'facebook',
      icon: 'thumb_up',
      eyebrow: 'Message',
      label: 'Facebook',
      value: contactInfo.facebookHandle,
      href: contactInfo.facebookUrl,
      accent: 'blue',
    },
  ];

  return (
    <Section
      id="contact"
      divider
      className="scroll-mt-24 min-h-screen flex flex-col justify-center py-section-gap-mobile md:py-section-gap-desktop overflow-hidden"
    >
      {/* Layered backdrop: brand color mesh, a minimal animated brand-glow
          scene (soft breathing/drifting blobs, replacing the old flat
          grid), and film grain for texture — all decorative and sat
          behind everything else in the section. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-kaizen-mesh" />
      <ContactSignalBackdrop />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-grain" />

      <div className="max-w-container-max-width mx-auto px-6 w-full">
        <motion.div
          ref={sectionRef}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch"
        >
          {/* Left — pitch, stat, primary CTA */}
          <div className="lg:col-span-5 flex flex-col">
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 font-label-bold text-label-bold text-teal uppercase tracking-wider mb-3"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-teal animate-pulse" />
              We're one call away
            </motion.span>

            <motion.h2
              variants={fadeUp}
              className="font-display-lg-mobile text-display-lg-mobile md:font-headline-md md:text-display-lg text-primary mb-4"
            >
              Get in Touch
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="font-body-lg text-body-lg text-on-surface-variant max-w-[38ch] mb-8"
            >
              Have a question or ready to book? Pick a channel below, and
              you'll reach a real person on the Kaizen team.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="relative flex items-center gap-4 rounded-2xl border border-teal/25 bg-teal/[0.08] px-5 py-4 mb-4"
            >
              <span className="relative shrink-0 inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal/15">
                <MaterialIcon name="bolt" filled className="text-2xl text-teal" />
                <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-teal" />
                </span>
              </span>
              <span className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-background leading-none">
                  Under 1 hour
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant/80 uppercase tracking-wider mt-1.5">
                  Average response, business hours
                </span>
              </span>
            </motion.div>

            <motion.a
              variants={fadeUp}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              href={contactInfo.propertyManagementPhoneHref}
              className="w-full inline-flex items-center justify-center gap-2 bg-primary-container text-on-primary font-label-bold text-label-bold px-6 py-4 rounded-full hover:bg-navy-deep hover:text-teal transition-colors duration-200 shadow-glow hover:shadow-glow-hover focus-ring"
            >
              <MaterialIcon name="call" className="text-lg" />
              Call Us Now
            </motion.a>
          </div>

          {/* Right — four wide rectangular rows, stacked, each reacting to
              the pointer */}
          <div className="lg:col-span-7 flex flex-col gap-4 h-full" style={{ perspective: 1000 }}>
            {fields.map((field, i) => (
              <ContactTile key={field.id} field={field} index={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

function ContactTile({ field, index }: { field: TileField; index: number }) {
  const accent = ACCENTS[field.accent];

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-60, 60], [10, -10]), { stiffness: 260, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-60, 60], [-10, 10]), { stiffness: 260, damping: 20 });

  function handlePointerMove(event: ReactPointerEvent<HTMLAnchorElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
    event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`);
  }

  function handlePointerLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      variants={fadeUp}
      custom={0.05 * index}
      href={field.href}
      target={field.href.startsWith('http') ? '_blank' : undefined}
      rel={field.href.startsWith('http') ? 'noopener noreferrer' : undefined}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={`group relative overflow-hidden flex flex-1 items-center gap-5 min-h-[92px] rounded-2xl border border-outline-variant bg-surface-container-low p-5 sm:p-6 transition-colors duration-300 focus-ring ${accent.ring}`}
    >
      {/* Spotlight that follows the pointer, revealed on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), ${accent.glow}, transparent 70%)`,
        }}
      />

      <span
        className={`relative shrink-0 inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl ${accent.bg} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}
        style={{ transform: 'translateZ(30px)' }}
      >
        <MaterialIcon name={field.icon} filled className={`text-2xl ${accent.text}`} />
      </span>

      <span className="relative min-w-0 flex-1" style={{ transform: 'translateZ(20px)' }}>
        <span
          className={`block font-label-sm text-label-sm uppercase tracking-wider mb-1 ${accent.text} opacity-80`}
        >
          {field.eyebrow} · {field.label}
        </span>
        <span className="block text-lg sm:text-xl font-semibold leading-snug text-on-background break-words">
          {field.value}
        </span>
      </span>

      <MaterialIcon
        name="arrow_forward"
        className={`relative shrink-0 text-xl text-on-surface-variant/50 transition-all duration-300 group-hover:translate-x-1 ${accent.arrowHover}`}
        style={{ transform: 'translateZ(20px)' }}
      />
    </motion.a>
  );
}

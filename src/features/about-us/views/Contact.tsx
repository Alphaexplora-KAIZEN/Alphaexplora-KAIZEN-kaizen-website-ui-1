import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeUp, staggerContainer } from '../../../shared/utils/constants';
import Section from '../../../shared/components/Section';
import MaterialIcon from '../../../shared/components/MaterialIcon';
import type { ContactInfo } from '../../../shared/models/types';

interface ContactProps {
  contactInfo: ContactInfo;
}

/**
 * "Get in Touch" as a CTA panel plus a card grid, instead of a single
 * ledger of four link rows. The two phone lines are the highest-intent
 * actions on this page, so they lead and get larger value text; email and
 * Facebook sit alongside as a lighter two-up grid. All four destinations
 * share one card treatment (same border, background, and hover state) so
 * the set reads as one consistent family rather than two different styles.
 */
export default function Contact({ contactInfo }: ContactProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2, margin: '-80px' });

  const callRows = [
    {
      id: 'pm-phone',
      icon: 'apartment',
      label: 'Property Management',
      value: contactInfo.propertyManagementPhone,
      href: contactInfo.propertyManagementPhoneHref,
    },
    {
      id: 'cs-phone',
      icon: 'cleaning_services',
      label: 'Cleaning & Aircon Care',
      value: contactInfo.cleaningServicesPhone,
      href: contactInfo.cleaningServicesPhoneHref,
    },
  ];

  const otherRows = [
    { id: 'email', icon: 'mail', label: 'Email', value: contactInfo.email, href: contactInfo.emailHref },
    {
      id: 'facebook',
      icon: 'thumb_up',
      label: 'Facebook',
      value: contactInfo.facebookHandle,
      href: contactInfo.facebookUrl,
    },
  ];

  return (
    <Section id="contact" divider className="scroll-mt-24 py-section-gap-mobile md:py-section-gap-desktop">
      <div className="max-w-container-max-width mx-auto px-6">
        <motion.div
          ref={sectionRef}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="max-w-2xl mb-12 space-y-4"
        >
          <span className="inline-flex items-center gap-2 font-label-bold text-label-bold text-gold uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            We're one call away
          </span>
          <h2 className="font-headline-md text-headline-md text-primary">Get in Touch</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Have a question or ready to book? Reach the Kaizen team directly.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4"
        >
          {/* Primary — phone lines, still first and given more visual weight
              via larger value text, but sharing the same card treatment as
              the cards beside them so the set reads as one consistent
              family rather than two different card styles. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {callRows.map((row, index) => (
              <motion.a
                key={row.id}
                variants={fadeUp}
                custom={index * 0.1}
                href={row.href}
                className="group relative flex flex-col justify-between gap-8 rounded-2xl border border-outline-variant bg-surface p-6 sm:p-7 overflow-hidden transition-all duration-300 hover:border-gold/40 hover:bg-surface-container-low focus-ring"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-soft text-teal shrink-0">
                    <MaterialIcon name={row.icon} filled className="text-xl" />
                  </span>
                  <MaterialIcon
                    name="call"
                    className="text-base text-on-surface-variant shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </div>
                <div>
                  <p className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider mb-2">
                    {row.label}
                  </p>
                  <p className="font-mono text-xl sm:text-2xl text-primary tabular-nums break-words">{row.value}</p>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Secondary — email + social, same card treatment as the phone
              lines above, differing only in content and text scale. */}
          <div className="flex flex-col gap-4">
            {otherRows.map((row, index) => (
              <motion.a
                key={row.id}
                variants={fadeUp}
                custom={index * 0.1 + 0.15}
                href={row.href}
                target={row.href.startsWith('http') ? '_blank' : undefined}
                rel={row.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group flex flex-1 items-center gap-4 rounded-2xl border border-outline-variant bg-surface p-5 sm:p-6 transition-all duration-300 hover:border-gold/40 hover:bg-surface-container-low focus-ring"
              >
                <MaterialIcon name={row.icon} filled className="text-teal text-xl shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-0.5">
                    {row.label}
                  </span>
                  <span className="block font-body-md text-body-md text-on-background break-words">{row.value}</span>
                </span>
                <MaterialIcon
                  name="arrow_forward"
                  className="text-xl text-on-surface-variant shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

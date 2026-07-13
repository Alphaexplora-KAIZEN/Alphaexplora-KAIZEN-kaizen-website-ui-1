import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeUp, staggerContainer } from '../../../shared/utils/constants';
import MaterialIcon from '../../../shared/components/MaterialIcon';
import type { ContactInfo } from '../../../shared/models/types';

interface ContactProps {
  contactInfo: ContactInfo;
}

export default function Contact({ contactInfo }: ContactProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2, margin: '-80px' });

  const cards = [
    {
      id: 'pm-phone',
      icon: 'call',
      label: 'Property Management',
      value: contactInfo.propertyManagementPhone,
      href: contactInfo.propertyManagementPhoneHref,
    },
    {
      id: 'cs-phone',
      icon: 'call',
      label: 'Cleaning & Aircon Care',
      value: contactInfo.cleaningServicesPhone,
      href: contactInfo.cleaningServicesPhoneHref,
    },
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
    <section id="contact" className="scroll-mt-24 py-section-gap-mobile md:py-section-gap-desktop bg-surface-container-low">
      <div className="max-w-container-max-width mx-auto px-6">
        <motion.div
          ref={sectionRef}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="text-center max-w-2xl mx-auto mb-12 space-y-4"
        >
          <h2 className="font-headline-md text-headline-md text-primary">Get in Touch</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Have a question or ready to book? Reach the Kaizen team directly.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-grid-gutter"
        >
          {cards.map((card) => (
            <motion.a
              key={card.id}
              variants={fadeUp}
              href={card.href}
              target={card.href.startsWith('http') ? '_blank' : undefined}
              rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="bg-surface rounded-2xl p-6 text-center shadow-ambient hover:shadow-ambient-hover hover:scale-[1.02] transition-all duration-300 focus-ring"
            >
              <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-soft text-teal">
                <MaterialIcon name={card.icon} filled />
              </span>
              <p className="font-label-bold text-label-bold text-primary mb-1">{card.label}</p>
              <p className="font-body-md text-body-md text-on-surface-variant break-words">{card.value}</p>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

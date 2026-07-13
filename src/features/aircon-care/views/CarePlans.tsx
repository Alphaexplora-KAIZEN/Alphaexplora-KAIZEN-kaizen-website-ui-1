import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { fadeUp } from '../../../shared/utils/constants';
import Section from '../../../shared/components/Section';
import MaterialIcon from '../../../shared/components/MaterialIcon';
import type { AirconCareData, CarePlan } from '../../../shared/models/types';

interface CarePlansProps {
  data: AirconCareData;
}

/**
 * The three plans used to be identical flip-cards in a grid — tap the front
 * to see the back. Here they're a single accordion-style ledger: one plan
 * per row, title and description always visible, tap to expand the feature
 * list beneath it inline. No card boxes, no 3D flip — just a running list
 * where the "Most Popular" plan is marked with a plain gold rule rather than
 * a badge stamped on a card corner.
 */
export default function CarePlans({ data }: CarePlansProps) {
  const sectionRef1 = useRef(null);
  const isInView1 = useInView(sectionRef1, { once: true, amount: 0.2, margin: '-80px' });

  const [openId, setOpenId] = useState<string | null>(data.plans[0]?.id ?? null);

  return (
    <Section id="plans" divider className="py-section-gap-mobile md:py-section-gap-desktop">
      <div className="max-w-container-max-width mx-auto px-6">
        <motion.div
          ref={sectionRef1}
          initial="hidden"
          animate={isInView1 ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="max-w-2xl mb-12 space-y-4"
        >
          <h2 className="font-headline-md text-headline-md text-primary">{data.plansHeading}</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">{data.plansSubheading}</p>
        </motion.div>

        <div className="border-t border-outline-variant">
          {data.plans.map((plan, index) => (
            <PlanRow
              key={plan.id}
              plan={plan}
              index={index}
              isOpen={openId === plan.id}
              onToggle={() => setOpenId((current) => (current === plan.id ? null : plan.id))}
              bookingHref={data.bookingHref}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}

function PlanRow({
  plan,
  index,
  isOpen,
  onToggle,
  bookingHref,
}: {
  plan: CarePlan;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  bookingHref: string;
}) {
  const highlight = plan.variant === 'highlight';

  return (
    <div className={`border-b border-outline-variant ${highlight ? 'bg-blue/5' : ''}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center gap-5 py-6 md:py-7 text-left focus-ring"
      >
        <span className="font-mono text-sm text-blue w-6 shrink-0">{String(index + 1).padStart(2, '0')}</span>
        <MaterialIcon name={plan.icon} filled className="text-blue text-2xl shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <h3 className="font-headline-sm text-headline-sm text-primary">{plan.title}</h3>
            {highlight && (
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-teal">Most Popular</span>
            )}
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-2xl hidden sm:block">
            {plan.description}
          </p>
        </div>
        <MaterialIcon
          name="expand_more"
          className={`text-2xl text-on-surface-variant shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <p className="font-body-md text-body-md text-on-surface-variant sm:hidden pb-4 -mt-2">{plan.description}</p>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pl-11 pb-8 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
              <ul className="flex flex-wrap gap-x-8 gap-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 font-body-md text-body-md text-on-surface-variant">
                    <MaterialIcon name="check_circle" filled className="text-blue text-lg" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href={bookingHref}
                className="group inline-flex items-center gap-2 font-label-bold text-label-bold text-on-surface hover:text-primary transition-colors focus-ring shrink-0"
              >
                {plan.ctaLabel}
                <MaterialIcon
                  name="arrow_forward"
                  filled
                  className="text-[18px] transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

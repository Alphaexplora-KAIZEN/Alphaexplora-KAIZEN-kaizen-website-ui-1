import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import pmProcessMarketImg from '../../../assets/property-management/process-market.jpg';
import PageLayout from '../../../shared/components/PageLayout';
import AsyncState from '../../../shared/components/AsyncState';
import BookingModal from '../../../shared/components/BookingModal';
import { useWhatWeDoViewModel } from '../viewModels/useWhatWeDoViewModel';
import PageIntro from './PageIntro';
import QuickNav from './QuickNav';
import ServiceNotebook, { type ServiceNotebookEntry } from './ServiceNotebook';
import TargetSpaces from '../../cleaning-services/views/TargetSpaces';
import TrustCTA from './TrustCTA';

const SERVICE_IDS = ['property-management', 'cleaning-services', 'aircon-care'];

/**
 * Condensed "What We Do" page.
 *
 * The three services used to be stacked end-to-end as separate full-screen
 * sections you scrolled past one at a time. They're now presented as a
 * single-screen notebook (see ServiceNotebook) that you flip through —
 * via the sticky QuickNav pills, the notebook's own side tabs and
 * prev/next arrows, a swipe, or the arrow keys — so all three specialties
 * live on one screen instead of a long scroll. Deep links from elsewhere
 * on the site (e.g. a footer link to /what-we-do#cleaning-services) still
 * open the notebook straight to that service.
 */
export default function WhatWeDo() {
  const { data, isLoading, error } = useWhatWeDoViewModel();
  const [bookingOpen, setBookingOpen] = useState(false);
  const location = useLocation();

  const [activeServiceId, setActiveServiceId] = useState<string>(() => {
    const fromHash = location.hash.replace('#', '');
    return SERVICE_IDS.includes(fromHash) ? fromHash : SERVICE_IDS[0];
  });

  useEffect(() => {
    const fromHash = location.hash.replace('#', '');
    if (SERVICE_IDS.includes(fromHash)) {
      setActiveServiceId(fromHash);
    }
    // Only react to the hash actually changing (e.g. a new deep link),
    // not to every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.hash]);

  return (
    <PageLayout>
      <AsyncState isLoading={isLoading} error={error} data={data}>
        {(pageData) => {
          const entries: ServiceNotebookEntry[] = [
            {
              id: 'property-management',
              title: 'Property Management',
              description:
                'From sourcing qualified tenants to full-cycle leasing and repairs, we manage your property from start to finish with complete accountability.',
              image: {
                src: pmProcessMarketImg,
                alt: 'Bright, well-styled kitchen photographed for a property listing',
              },
              ctaLabel: 'Get a Free Appraisal',
              onCtaClick: () => setBookingOpen(true),
              theme: { accent: 'text-teal', bar: 'bg-teal' },
              highlights: [
                { id: 'source', icon: 'photo_camera', label: 'Market & Source qualified tenants' },
                { id: 'manage', icon: 'vpn_key', label: 'Lease & Manage the full operational cycle' },
                { id: 'maintain', icon: 'handyman', label: 'Maintain & Repair to keep it in top condition' },
              ],
            },
            {
              id: 'cleaning-services',
              title: 'Cleaning Services',
              description:
                'On T.I.M.E. condo, home, office, and deep-cleaning services for modern living that are reliable, thorough, and on your schedule.',
              image: pageData.cleaningServices.heroImage,
              ctaLabel: 'Book a Cleaning',
              onCtaClick: () => setBookingOpen(true),
              theme: { accent: 'text-blue', bar: 'bg-blue' },
              highlights: [
                { id: 'condo', icon: 'apartment', label: 'Condo & Apartment Cleaning' },
                { id: 'deep', icon: 'cleaning_services', label: 'Deep Cleaning for move-ins & post-construction' },
                { id: 'housekeeping', icon: 'calendar_month', label: 'Regular Housekeeping, flexible scheduling' },
              ],
            },
            {
              id: 'aircon-care',
              title: 'Aircon Care',
              description:
                "Breathe clean, live better. Professional aircon maintenance that improves air quality, boosts efficiency, and extends your unit's lifespan.",
              image: pageData.airconCare.heroImage,
              ctaLabel: 'Book an Inspection',
              onCtaClick: () => setBookingOpen(true),
              theme: { accent: 'text-gold', bar: 'bg-gold' },
              highlights: [
                { id: 'general', icon: 'air', label: 'General Cleaning for optimal airflow' },
                { id: 'chemical', icon: 'water_drop', label: 'Chemical Wash for deep sanitization' },
                { id: 'pro', icon: 'handyman', label: 'Pro Maintenance & diagnostics' },
              ],
            },
          ];

          return (
            <>
              <PageIntro />
              <QuickNav activeId={activeServiceId} onSelect={setActiveServiceId} />

              <ServiceNotebook entries={entries} activeId={activeServiceId} onSelect={setActiveServiceId} />

              <TargetSpaces data={pageData.cleaningServices} />

              <TrustCTA />

              <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
            </>
          );
        }}
      </AsyncState>
    </PageLayout>
  );
}

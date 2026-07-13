import pmProcessMarketImg from '../../../assets/property-management/process-market.jpg';
import PageLayout from '../../../shared/components/PageLayout';
import AsyncState from '../../../shared/components/AsyncState';
import { useWhatWeDoViewModel } from '../viewModels/useWhatWeDoViewModel';
import PageIntro from './PageIntro';
import QuickNav from './QuickNav';
import ServiceSummaryCard from './ServiceSummaryCard';
import TargetSpaces from '../../cleaning-services/views/TargetSpaces';
import TrustCTA from './TrustCTA';

/**
 * Condensed "What We Do" page.
 *
 * The previous version stacked all three service pages end-to-end (hero +
 * process/plans grid + why-choose/benefits + target-spaces/values for each),
 * which made this the longest, heaviest page on the site and repeated the
 * "why choose us" story that already lives on About Us. This version keeps
 * one short intro, one focused summary entry per service (3 highlights + a
 * single call-to-action each, presented as a full-bleed alternating photo
 * strip — modeled on an editorial "our work" layout rather than a boxed
 * card grid), the "Spaces We Care For" showcase (moved here from About
 * Us — it's a better fit next to the services it illustrates), and one
 * shared trust/CTA band at the end.
 */
export default function WhatWeDo() {
  const { data, isLoading, error } = useWhatWeDoViewModel();

  return (
    <PageLayout>
      <AsyncState isLoading={isLoading} error={error} data={data}>
        {(pageData) => (
          <>
            <PageIntro />
            <QuickNav />

            <ServiceSummaryCard
              id="property-management"
              index={1}
              count={3}
              icon="apartment"
              title="Property Management"
              description="From sourcing qualified tenants to full-cycle leasing and repairs, we manage your property with complete accountability — start to finish."
              image={{
                src: pmProcessMarketImg,
                alt: 'Bright, well-styled kitchen photographed for a property listing',
              }}
              ctaLabel="Get a Free Appraisal"
              ctaHref={pageData.propertyManagement.bookingHref}
              theme={{ accent: 'text-teal', bar: 'bg-teal' }}
              highlights={[
                { id: 'source', icon: 'photo_camera', label: 'Market & Source qualified tenants' },
                { id: 'manage', icon: 'vpn_key', label: 'Lease & Manage the full operational cycle' },
                { id: 'maintain', icon: 'handyman', label: 'Maintain & Repair to keep it in top condition' },
              ]}
            />

            <ServiceSummaryCard
              id="cleaning-services"
              index={2}
              count={3}
              icon="cleaning_services"
              title="Cleaning Services"
              description="On T.I.M.E. condo, home, office, and deep-cleaning services for modern living — reliable, thorough, and on your schedule."
              image={pageData.cleaningServices.heroImage}
              ctaLabel="Book a Cleaning"
              ctaHref={pageData.cleaningServices.bookingHref}
              reverse
              theme={{ accent: 'text-blue', bar: 'bg-blue' }}
              highlights={[
                { id: 'condo', icon: 'apartment', label: 'Condo & Apartment Cleaning' },
                { id: 'deep', icon: 'cleaning_services', label: 'Deep Cleaning for move-ins & post-construction' },
                { id: 'housekeeping', icon: 'calendar_month', label: 'Regular Housekeeping, flexible scheduling' },
              ]}
            />

            <ServiceSummaryCard
              id="aircon-care"
              index={3}
              count={3}
              icon="air"
              title="Aircon Care"
              description="Breathe clean, live better. Professional aircon maintenance that improves air quality, boosts efficiency, and extends your unit's lifespan."
              image={pageData.airconCare.heroImage}
              ctaLabel="Book an Inspection"
              ctaHref={pageData.airconCare.bookingHref}
              theme={{ accent: 'text-gold', bar: 'bg-gold' }}
              highlights={[
                { id: 'general', icon: 'air', label: 'General Cleaning for optimal airflow' },
                { id: 'chemical', icon: 'water_drop', label: 'Chemical Wash for deep sanitization' },
                { id: 'pro', icon: 'handyman', label: 'Pro Maintenance & diagnostics' },
              ]}
            />

            <TargetSpaces data={pageData.cleaningServices} />

            <TrustCTA />
          </>
        )}
      </AsyncState>
    </PageLayout>
  );
}

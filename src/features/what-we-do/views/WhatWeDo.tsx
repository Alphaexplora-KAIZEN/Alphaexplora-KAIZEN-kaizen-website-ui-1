import PageLayout from '../../../shared/components/PageLayout';
import AsyncState from '../../../shared/components/AsyncState';
import { useWhatWeDoViewModel } from '../viewModels/useWhatWeDoViewModel';
import PageIntro from './PageIntro';
import ServiceSummaryCard from './ServiceSummaryCard';
import TrustCTA from './TrustCTA';

/**
 * Condensed "What We Do" page.
 *
 * The previous version stacked all three service pages end-to-end (hero +
 * process/plans grid + why-choose/benefits + target-spaces/values for each),
 * which made this the longest, heaviest page on the site and repeated the
 * "why choose us" story that already lives on About Us. This version keeps
 * one short intro, one focused summary card per service (3 highlights + a
 * single call-to-action each), and one shared trust/CTA band at the end.
 */
export default function WhatWeDo() {
  const { data, isLoading, error } = useWhatWeDoViewModel();

  return (
    <PageLayout>
      <AsyncState isLoading={isLoading} error={error} data={data}>
        {(pageData) => (
          <>
            <PageIntro />

            <ServiceSummaryCard
              id="property-management"
              icon="apartment"
              title="Property Management"
              description="From sourcing qualified tenants to full-cycle leasing and repairs, we manage your property with complete accountability — start to finish."
              image={pageData.propertyManagement.heroImage}
              ctaLabel="Get a Free Appraisal"
              ctaHref={pageData.propertyManagement.bookingHref}
              theme={{ badge: 'bg-teal text-on-primary', icon: 'text-on-primary', chipBg: 'bg-teal-soft', chipText: 'text-teal' }}
              highlights={[
                { id: 'source', icon: 'photo_camera', label: 'Market & Source qualified tenants' },
                { id: 'manage', icon: 'vpn_key', label: 'Lease & Manage the full operational cycle' },
                { id: 'maintain', icon: 'handyman', label: 'Maintain & Repair to keep it in top condition' },
              ]}
            />

            <ServiceSummaryCard
              id="cleaning-services"
              icon="cleaning_services"
              title="Cleaning Services"
              description="On T.I.M.E. condo, home, office, and deep-cleaning services for modern living — reliable, thorough, and on your schedule."
              image={pageData.cleaningServices.heroImage}
              ctaLabel="Book a Cleaning"
              ctaHref={pageData.cleaningServices.bookingHref}
              reverse
              theme={{ badge: 'bg-blue text-on-primary', icon: 'text-on-primary', chipBg: 'bg-blue/10', chipText: 'text-blue' }}
              highlights={[
                { id: 'condo', icon: 'apartment', label: 'Condo & Apartment Cleaning' },
                { id: 'deep', icon: 'cleaning_services', label: 'Deep Cleaning for move-ins & post-construction' },
                { id: 'housekeeping', icon: 'calendar_month', label: 'Regular Housekeeping, flexible scheduling' },
              ]}
            />

            <ServiceSummaryCard
              id="aircon-care"
              icon="air"
              title="Aircon Care"
              description="Breathe clean, live better. Professional aircon maintenance that improves air quality, boosts efficiency, and extends your unit's lifespan."
              image={pageData.airconCare.heroImage}
              ctaLabel="Book an Inspection"
              ctaHref={pageData.airconCare.bookingHref}
              theme={{ badge: 'bg-primary-container text-on-primary', icon: 'text-on-primary', chipBg: 'bg-primary-container/10', chipText: 'text-primary' }}
              highlights={[
                { id: 'general', icon: 'air', label: 'General Cleaning for optimal airflow' },
                { id: 'chemical', icon: 'water_drop', label: 'Chemical Wash for deep sanitization' },
                { id: 'pro', icon: 'handyman', label: 'Pro Maintenance & diagnostics' },
              ]}
            />

            <TrustCTA />
          </>
        )}
      </AsyncState>
    </PageLayout>
  );
}

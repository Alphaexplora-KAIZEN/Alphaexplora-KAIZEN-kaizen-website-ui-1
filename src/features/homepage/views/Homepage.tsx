import PageLayout from '../../../shared/components/PageLayout';
import AsyncState from '../../../shared/components/AsyncState';
import LedgerTape from '../../../shared/components/LedgerTape';
import { useHomepageViewModel } from '../viewModels/useHomepageViewModel';
import Hero from './Hero';
import ServiceTeasers from './ServiceTeasers';
import StatsCTA from './StatsCTA';

export default function Homepage() {
  const { data, isLoading, error } = useHomepageViewModel();

  return (
    <PageLayout>
      <AsyncState isLoading={isLoading} error={error} data={data}>
        {(pageData) => {
          // Ledger tape copy is assembled from real page content — the
          // eyebrow's three-part promise, the service names, and the trust
          // stats — rather than invented filler text.
          const tapeItems = [
            ...pageData.eyebrow.split('.').map((s) => s.trim()).filter(Boolean),
            ...pageData.services.map((s) => s.title),
            ...pageData.trustStats.map((s) => `${s.value} ${s.label}`),
          ];

          // A second tape, below the closing "Ready to experience the
          // Kaizen standard?" CTA — the same ledger-tape treatment,
          // reassembled from the service names, trust stats, and the
          // "We Market" half of the eyebrow, so the page closes on the
          // same running promise it opened with.
          const closingTapeItems = [
            'Cleaning Services',
            'Aircon Care',
            '98% Tenant Retention Rate',
            'We Market',
          ];

          return (
            <>
              <Hero data={pageData} />
              <LedgerTape items={tapeItems} />
              <StatsCTA data={pageData} />
              <LedgerTape items={closingTapeItems} />
              <ServiceTeasers data={pageData} />
            </>
          );
        }}
      </AsyncState>
    </PageLayout>
  );
}

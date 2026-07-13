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

          return (
            <>
              <Hero data={pageData} />
              <LedgerTape items={tapeItems} />
              <StatsCTA data={pageData} />
              <ServiceTeasers data={pageData} />
            </>
          );
        }}
      </AsyncState>
    </PageLayout>
  );
}

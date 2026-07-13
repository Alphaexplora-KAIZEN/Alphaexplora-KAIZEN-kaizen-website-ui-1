import PageLayout from '../../../shared/components/PageLayout';
import AsyncState from '../../../shared/components/AsyncState';
import { useHomepageViewModel } from '../viewModels/useHomepageViewModel';
import Hero from './Hero';
import ServiceTeasers from './ServiceTeasers';
import StatsCTA from './StatsCTA';

export default function Homepage() {
  const { data, isLoading, error } = useHomepageViewModel();

  return (
    <PageLayout>
      <AsyncState isLoading={isLoading} error={error} data={data}>
        {(pageData) => (
          <>
            <Hero data={pageData} />
            <ServiceTeasers data={pageData} />
            <StatsCTA data={pageData} />
          </>
        )}
      </AsyncState>
    </PageLayout>
  );
}

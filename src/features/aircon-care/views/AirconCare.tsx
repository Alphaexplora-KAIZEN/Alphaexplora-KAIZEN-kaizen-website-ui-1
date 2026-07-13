import PageLayout from '../../../shared/components/PageLayout';
import AsyncState from '../../../shared/components/AsyncState';
import { useAirconCareViewModel } from '../viewModels/useAirconCareViewModel';
import Hero from './Hero';
import CarePlans from './CarePlans';
import Benefits from './Benefits';
import CTA from './CTA';

export default function AirconCare() {
  const { data, isLoading, error } = useAirconCareViewModel();

  return (
    <PageLayout>
      <AsyncState isLoading={isLoading} error={error} data={data}>
        {(pageData) => (
          <>
            <Hero data={pageData} />
            <CarePlans data={pageData} />
            <Benefits data={pageData} />
            <CTA data={pageData} />
          </>
        )}
      </AsyncState>
    </PageLayout>
  );
}

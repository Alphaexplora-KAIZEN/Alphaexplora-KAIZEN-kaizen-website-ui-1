import PageLayout from '../../../shared/components/PageLayout';
import AsyncState from '../../../shared/components/AsyncState';
import { useCleaningServicesViewModel } from '../viewModels/useCleaningServicesViewModel';
import Hero from './Hero';
import ServicesGrid from './ServicesGrid';
import TargetSpaces from './TargetSpaces';
import CoreValues from './CoreValues';

export default function CleaningServices() {
  const { data, isLoading, error } = useCleaningServicesViewModel();

  return (
    <PageLayout>
      <AsyncState isLoading={isLoading} error={error} data={data}>
        {(pageData) => (
          <>
            <Hero data={pageData} />
            <ServicesGrid data={pageData} />
            <TargetSpaces data={pageData} />
            <CoreValues data={pageData} />
          </>
        )}
      </AsyncState>
    </PageLayout>
  );
}

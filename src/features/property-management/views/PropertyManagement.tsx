import PageLayout from '../../../shared/components/PageLayout';
import AsyncState from '../../../shared/components/AsyncState';
import { usePropertyManagementViewModel } from '../viewModels/usePropertyManagementViewModel';
import Hero from './Hero';
import ProcessSteps from './ProcessSteps';
import WhyChooseUs from './WhyChooseUs';

export default function PropertyManagement() {
  const { data, isLoading, error } = usePropertyManagementViewModel();

  return (
    <PageLayout>
      <AsyncState isLoading={isLoading} error={error} data={data}>
        {(pageData) => (
          <>
            <Hero data={pageData} />
            <ProcessSteps data={pageData} />
            <WhyChooseUs data={pageData} />
          </>
        )}
      </AsyncState>
    </PageLayout>
  );
}

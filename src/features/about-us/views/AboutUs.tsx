import PageLayout from '../../../shared/components/PageLayout';
import AsyncState from '../../../shared/components/AsyncState';
import { useAboutUsViewModel } from '../viewModels/useAboutUsViewModel';
import Hero from './Hero';
import Story from './Story';
import Values from './Values';
import Contact from './Contact';

/**
 * About Us used to also pull in the Property Management "Why Choose Us"
 * panel, the Cleaning Services "Core Values" flip-card section, and the
 * "Spaces We Care For" showcase. All three repeated content that already
 * lives elsewhere (trust stats in Story below, the spaces showcase now on
 * What We Do, next to the services it illustrates). Now it's: hero, story +
 * milestones, a calm values summary, and contact.
 */
export default function AboutUs() {
  const { data, isLoading, error } = useAboutUsViewModel();

  return (
    <PageLayout>
      <AsyncState isLoading={isLoading} error={error} data={data}>
        {(pageData) => (
          <>
            <Hero data={pageData.aboutUs} />
            <Story data={pageData.aboutUs} />
            <Values coreValues={pageData.cleaningServices.coreValues} />
            <Contact contactInfo={pageData.chrome.contactInfo} />
          </>
        )}
      </AsyncState>
    </PageLayout>
  );
}

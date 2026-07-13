import PageLayout from '../../../shared/components/PageLayout';
import AsyncState from '../../../shared/components/AsyncState';
import { useAboutUsViewModel } from '../viewModels/useAboutUsViewModel';
import Hero from './Hero';
import Story from './Story';
import Values from './Values';
import Contact from './Contact';

/**
 * About Us used to also pull in the Property Management "Why Choose Us"
 * panel and the Cleaning Services "Core Values" flip-card section. Both
 * repeated the same "family-owned, we care for it like our own" message and
 * the same trust stats that already appear in Story below, so this page
 * ended up telling the same story three times. Now it's just: hero, story +
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

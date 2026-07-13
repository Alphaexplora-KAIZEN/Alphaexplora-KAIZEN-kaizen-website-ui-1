import PageHero from '../../../shared/components/PageHero';
import type { CleaningServicesData } from '../../../shared/models/types';

interface HeroProps {
  data: CleaningServicesData;
}

export default function Hero({ data }: HeroProps) {
  return (
    <PageHero
      eyebrow={data.eyebrow}
      headline={data.headline}
      subheadline={data.subheadline}
      primaryCta={data.primaryCta}
      primaryHref={data.bookingHref}
      secondaryCta={data.secondaryCta}
      secondaryHref="#services"
      image={data.heroImage}
    />
  );
}

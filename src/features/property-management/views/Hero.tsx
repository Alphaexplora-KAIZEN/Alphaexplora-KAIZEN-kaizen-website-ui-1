import PageHero from '../../../shared/components/PageHero';
import type { PropertyManagementData } from '../../../shared/models/types';

interface HeroProps {
  data: PropertyManagementData;
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
      secondaryHref="#process"
      image={data.heroImage}
    />
  );
}

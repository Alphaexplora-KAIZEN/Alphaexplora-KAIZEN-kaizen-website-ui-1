import PageHero from '../../../shared/components/PageHero';
import type { AirconCareData } from '../../../shared/models/types';

interface HeroProps {
  data: AirconCareData;
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
      secondaryHref="#plans"
      image={data.heroImage}
    />
  );
}

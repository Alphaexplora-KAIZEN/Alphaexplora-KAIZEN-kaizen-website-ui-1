import PageHero from '../../../shared/components/PageHero';
import type { AboutUsData } from '../../../shared/models/types';

interface HeroProps {
  data: AboutUsData;
}

export default function Hero({ data }: HeroProps) {
  return (
    <PageHero
      eyebrow={data.eyebrow}
      headline={data.headline}
      subheadline={data.subheadline}
      primaryCta={data.primaryCta}
      primaryHref={data.primaryHref}
      secondaryCta={data.secondaryCta}
      secondaryHref={data.secondaryHref}
      image={data.heroImage}
    />
  );
}

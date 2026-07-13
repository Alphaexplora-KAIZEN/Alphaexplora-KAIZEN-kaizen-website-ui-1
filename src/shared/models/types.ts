// ============================================================================
// Domain types & schemas — MODEL layer. Pure TypeScript, no React/JSX.
// ============================================================================

export interface NavLink {
  id: string;
  label: string;
  href: string;
}

export interface SiteBrand {
  name: string;
  shortName: string;
}

export interface SocialLink {
  id: string;
  icon: string;
  href: string;
}

export interface FooterLinkGroup {
  id: string;
  title: string;
  links: NavLink[];
}

export interface ContactInfo {
  propertyManagementPhone: string;
  propertyManagementPhoneHref: string;
  cleaningServicesPhone: string;
  cleaningServicesPhoneHref: string;
  email: string;
  emailHref: string;
  facebookHandle: string;
  facebookUrl: string;
}

export interface SiteChrome {
  brand: SiteBrand;
  navLinks: NavLink[];
  footerGroups: FooterLinkGroup[];
  footerBlurb: string;
  copyright: string;
  contactInfo: ContactInfo;
}

// ---- Homepage --------------------------------------------------------------

export interface ServiceTeaser {
  id: string;
  icon: string;
  title: string;
  description: string;
  href: string;
  image: { src: string; alt: string };
}

export interface HomepageData {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryCta: string;
  primaryHref: string;
  secondaryCta: string;
  secondaryHref: string;
  heroImage: { src: string; alt: string };
  servicesHeading: string;
  servicesSubheading: string;
  services: ServiceTeaser[];
  trustStats: TrustStat[];
  ctaHeadline: string;
  ctaSubheading: string;
  ctaLabel: string;
  ctaHref: string;
}

// ---- About Us page ----------------------------------------------------------

export interface Milestone {
  id: string;
  value: string;
  label: string;
}

export interface AboutUsData {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryCta: string;
  primaryHref: string;
  secondaryCta: string;
  secondaryHref: string;
  heroImage: { src: string; alt: string };
  storyHeading: string;
  storyParagraphs: string[];
  storyImage: { src: string; alt: string };
  milestones: Milestone[];
}

// ---- Property Management page -------------------------------------------

export interface ProcessStep {
  id: string;
  step: number;
  icon: string;
  title: string;
  features: string[];
  image: { src: string; alt: string };
}

export interface TrustStat {
  id: string;
  value: string;
  label: string;
}

export interface PropertyManagementData {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryCta: string;
  secondaryCta: string;
  bookingHref: string;
  heroImage: { src: string; alt: string };
  processHeading: string;
  processSubheading: string;
  steps: ProcessStep[];
  whyChooseHeading: string;
  whyChooseBody: string;
  trustStats: TrustStat[];
  whyChooseImage: { src: string; alt: string };
}

// ---- Cleaning Services page ----------------------------------------------

export interface CleaningPlan {
  id: string;
  icon: string;
  badge?: string;
  title: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaStyle: 'filled' | 'outline';
  image: { src: string; alt: string };
}

export interface TargetSpace {
  id: string;
  icon: string;
  label: string;
  description: string;
  image: { src: string; alt: string };
}

export interface CoreValue {
  id: string;
  title: string;
  description: string;
}

export interface CleaningServicesData {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryCta: string;
  secondaryCta: string;
  bookingHref: string;
  heroImage: { src: string; alt: string };
  servicesHeading: string;
  servicesSubheading: string;
  plans: CleaningPlan[];
  targetSpacesHeading: string;
  targetSpacesSubheading: string;
  targetSpaces: TargetSpace[];
  coreValuesHeading: string;
  coreValuesSubheadingLine1: string;
  coreValuesSubheadingLine2: string;
  coreValues: CoreValue[];
  coreValuesBackgroundImages: { src: string; alt: string }[];
}

// ---- Aircon Care page -----------------------------------------------------

export interface CarePlan {
  id: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  ctaLabel: string;
  variant: 'default' | 'highlight';
}

export interface Benefit {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface AirconCareData {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryCta: string;
  secondaryCta: string;
  bookingHref: string;
  heroImage: { src: string; alt: string };
  plansHeading: string;
  plansSubheading: string;
  plans: CarePlan[];
  benefitsHeading: string;
  benefitsSubheading: string;
  benefits: Benefit[];
  benefitsImage: { src: string; alt: string };
  ctaHeadline: string;
  ctaSubheading: string;
  ctaLabel: string;
  ctaImage: { src: string; alt: string };
}

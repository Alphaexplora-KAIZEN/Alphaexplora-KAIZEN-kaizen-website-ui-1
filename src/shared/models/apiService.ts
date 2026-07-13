// ============================================================================
// Data fetching layer — MODEL. No React/JSX here, only data + async functions.
// In production these would call a real backend/CMS. They resolve with typed
// content so the ViewModel layer has a real async contract to work against.
// ============================================================================

import type {
  SiteChrome,
  PropertyManagementData,
  CleaningServicesData,
  AirconCareData,
  HomepageData,
  AboutUsData,
} from './types';
import condominiumImg from '../../assets/target-spaces/Condominium.jpg';
import residentialHomeImg from '../../assets/target-spaces/Residential_Home.jpg';
import officesImg from '../../assets/target-spaces/Offices.jpg';
import postConstructionImg from '../../assets/target-spaces/Post_Construction.jpg';

// Property Management
import pmHeroImg from '../../assets/property-management/hero-living-room.jpg';
import pmFamilyImg from '../../assets/property-management/family-couch.jpg';
import pmProcessMarketImg from '../../assets/property-management/process-market.jpg';
import pmProcessLeaseImg from '../../assets/property-management/process-lease.jpg';
import pmProcessMaintainImg from '../../assets/property-management/process-maintain.jpeg';

// Cleaning Services
import csHeroImg from '../../assets/cleaning-services/hero-clean-house.jpg';
import csPlanCondoImg from '../../assets/cleaning-services/plan-condo.jpg';
import csPlanDeepCleanImg from '../../assets/cleaning-services/plan-deep-clean-detail.jpg';
import csPlanHousekeepingImg from '../../assets/cleaning-services/plan-housekeeping.jpeg';
import cleaner1Img from '../../assets/cleaners/Cleaner_1.jpg';
import cleaner2Img from '../../assets/cleaners/Cleaner_2.jpg';
import cleaner3Img from '../../assets/cleaners/Cleaner_3.jpg';
import cleaner4Img from '../../assets/cleaners/Cleaner_4.jpeg';

// Aircon Care
import acHeroImg from '../../assets/aircon-care/hero-technician.jpg';
import acBenefitsImg from '../../assets/aircon-care/benefits-technician.jpg';
import acCtaImg from '../../assets/aircon-care/cta-background.jpg';

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// ---- Shared site chrome ---------------------------------------------------

const SITE_CHROME: SiteChrome = {
  brand: { name: 'Kaizen Optima Solutions', shortName: 'Kaizen Optima' },
  navLinks: [
    { id: 'homepage', label: 'Homepage', href: '/' },
    { id: 'what-we-do', label: 'What We Do', href: '/what-we-do' },
    { id: 'about-us', label: 'About Us', href: '/about-us' },
  ],
  footerGroups: [
    {
      id: 'services',
      title: 'What We Do',
      links: [
        { id: 'f-pm', label: 'Property Management', href: '/what-we-do#property-management' },
        { id: 'f-cs', label: 'Cleaning Services', href: '/what-we-do#cleaning-services' },
        { id: 'f-ac', label: 'Aircon Care', href: '/what-we-do#aircon-care' },
      ],
    },
    {
      id: 'company',
      title: 'Company',
      links: [
        { id: 'f-about', label: 'About Us', href: '/about-us' },
        { id: 'f-contact', label: 'Contact Us', href: '/about-us#contact' },
      ],
    },
    {
      id: 'contact',
      title: 'Contact',
      links: [
        { id: 'f-pm-phone', label: '0919 677 8350 (Property Mgmt)', href: 'tel:+639196778350' },
        { id: 'f-cs-phone', label: '0912 087 5598 (Cleaning)', href: 'tel:+639120875598' },
        { id: 'f-email', label: 'kaizenoptimasolutions@gmail.com', href: 'mailto:kaizenoptimasolutions@gmail.com' },
        {
          id: 'f-facebook',
          label: '@kaizenoptimasolutions',
          href: 'https://facebook.com/kaizenoptimasolutions',
        },
      ],
    },
  ],
  footerBlurb: 'We Market. We Manage. We Maintain. Peace of mind for property owners, spotless spaces for everyone else.',
  copyright: '© 2026 Kaizen Optima Solutions. All rights reserved.',
  contactInfo: {
    propertyManagementPhone: '0919 677 8350',
    propertyManagementPhoneHref: 'tel:+639196778350',
    cleaningServicesPhone: '0912 087 5598',
    cleaningServicesPhoneHref: 'tel:+639120875598',
    email: 'kaizenoptimasolutions@gmail.com',
    emailHref: 'mailto:kaizenoptimasolutions@gmail.com',
    facebookHandle: '@kaizenoptimasolutions',
    facebookUrl: 'https://facebook.com/kaizenoptimasolutions',
  },
};

export async function fetchSiteChrome(): Promise<SiteChrome> {
  return delay(SITE_CHROME);
}

// ---- Property Management page ---------------------------------------------

const PROPERTY_MANAGEMENT_DATA: PropertyManagementData = {
  eyebrow: 'We Market. We Manage. We Maintain.',
  headline: 'Peace of Mind for Property Owners.',
  subheadline:
    'Providing peace of mind for property owners through comprehensive management and maintenance services \u2014 from sourcing qualified tenants to keeping your property in excellent condition.',
  primaryCta: 'Get a Free Appraisal',
  secondaryCta: 'View Our Process',
  bookingHref: 'tel:+639196778350',
  heroImage: {
    src: pmHeroImg,
    alt: 'Spacious, wide-angle view of a modern high-end residential living room with warm minimalist decor',
  },
  processHeading: 'Our 3-Step Management Process',
  processSubheading:
    'We\u2019ve refined our approach to ensure seamless operation, steady income, and meticulous care for your investment.',
  steps: [
    {
      id: 'source',
      step: 1,
      icon: 'photo_camera',
      title: 'Market & Source',
      features: [
        'Effective marketing of your property',
        'Finding qualified tenants or lessees',
        'Competitive market analysis',
      ],
      image: { src: pmProcessMarketImg, alt: 'Bright, well-styled kitchen photographed for a property listing' },
    },
    {
      id: 'manage',
      step: 2,
      icon: 'vpn_key',
      title: 'Lease & Manage',
      features: [
        'Crafting solid lease contracts',
        'Managing the full operational cycle',
        'Complete accountability, turnover to tenancy',
      ],
      image: { src: pmProcessLeaseImg, alt: 'Comfortable, well-kept bedroom in a managed rental property' },
    },
    {
      id: 'maintain',
      step: 3,
      icon: 'handyman',
      title: 'Maintain & Repair',
      features: [
        'All types of repairs handled',
        'Regular maintenance & general upkeep',
        'Properties preserved in excellent condition',
      ],
      image: { src: pmProcessMaintainImg, alt: 'Spotless, well-maintained bathroom in a managed property' },
    },
  ],
  whyChooseHeading: 'Why Choose Kaizen',
  whyChooseBody:
    'As a family-owned business, we don\u2019t just manage properties; we care for them as if they were our own. We combine corporate-level precision with the warmth and personal touch of a boutique hospitality service.',
  trustStats: [
    { id: 'retention', value: '98%', label: 'Tenant Retention Rate' },
    { id: 'support', value: '24/7', label: 'Dedicated Local Support' },
  ],
  whyChooseImage: {
    src: pmFamilyImg,
    alt: 'Family relaxing together on a couch at home, reflecting the peace of mind Kaizen provides property owners',
  },
};

export async function fetchPropertyManagementData(): Promise<PropertyManagementData> {
  return delay(PROPERTY_MANAGEMENT_DATA);
}

// ---- Cleaning Services page -------------------------------------------------

const CLEANING_SERVICES_DATA: CleaningServicesData = {
  eyebrow: 'On T.I.M.E. Cleaning Services',
  headline: 'Spotless Spaces. Stress-Free Living.',
  subheadline:
    'Experience the Kaizen standard of clean. Professional, reliable, and meticulous condo and deep cleaning services designed for modern properties and busy families.',
  primaryCta: 'Book Now',
  secondaryCta: 'View Plans',
  bookingHref: 'tel:+639120875598',
  heroImage: {
    src: csHeroImg,
    alt: 'Bright, sunlit clean home with pristine surfaces after a Kaizen deep clean',
  },
  servicesHeading: 'Tailored Cleaning Solutions',
  servicesSubheading:
    'Whether you need daily upkeep or a thorough post-construction scrub, our expert teams deliver uncompromising quality.',
  plans: [
    {
      id: 'condo',
      icon: 'apartment',
      title: 'Condo & Apartment Cleaning',
      description:
        'Optimized for compact, modern living spaces. We focus on maximizing freshness and order in every square foot.',
      features: ['Efficient turnaround', 'Dusting & sanitization'],
      ctaLabel: 'Learn More',
      ctaStyle: 'outline',
      image: { src: csPlanCondoImg, alt: 'Modern, tidy condo living space' },
    },
    {
      id: 'deep-clean',
      icon: 'cleaning_services',
      badge: 'Popular',
      title: 'Deep Cleaning',
      description:
        'Intensive cleaning for post-construction, move-ins, or seasonal resets. We reach the spots daily cleaning misses.',
      features: ['Grime & build-up removal', 'Inside cabinets & appliances'],
      ctaLabel: 'Get Quote',
      ctaStyle: 'filled',
      image: { src: csPlanDeepCleanImg, alt: 'Close-up of a thorough, detailed deep clean in progress' },
    },
    {
      id: 'housekeeping',
      icon: 'calendar_month',
      title: 'Regular Housekeeping',
      description:
        'Consistent, reliable maintenance tailored to your schedule. Keep your home welcoming week after week.',
      features: ['Flexible scheduling', 'Dedicated staff'],
      ctaLabel: 'View Plans',
      ctaStyle: 'outline',
      image: { src: csPlanHousekeepingImg, alt: 'Kaizen staff member performing routine housekeeping' },
    },
  ],
  targetSpacesHeading: 'Spaces We Care For',
  targetSpacesSubheading:
    'From high-rise condos to active job sites, our teams tailor every clean to the space at hand.',
  targetSpaces: [
    {
      id: 'condos',
      icon: 'apartment',
      label: 'Condominiums',
      description: 'Routine and move-in/move-out cleans for units of any size.',
      image: { src: condominiumImg, alt: 'High-rise condominium building exterior against a blue sky' },
    },
    {
      id: 'homes',
      icon: 'cottage',
      label: 'Residential Homes',
      description: 'Deep cleans and regular upkeep that keep family homes spotless.',
      image: { src: residentialHomeImg, alt: 'Warm, tidy residential living room interior' },
    },
    {
      id: 'offices',
      icon: 'corporate_fare',
      label: 'Corporate Offices',
      description: 'After-hours servicing that keeps workspaces sharp for the team.',
      image: { src: officesImg, alt: 'Modern corporate office workspace with clean, organized desks' },
    },
    {
      id: 'construction',
      icon: 'construction',
      label: 'Post-Construction Sites',
      description: 'Dust and debris removal that gets a finished site move-in ready.',
      image: { src: postConstructionImg, alt: 'Post-construction site ready for a deep clean-up' },
    },
  ],
  coreValuesHeading: 'Our Core Values',
  coreValuesSubheadingLine1: 'On T.I.M.E.',
  coreValuesSubheadingLine2: 'the standard behind every clean we deliver.',
  coreValues: [
    { id: 'trust', title: 'Trust', description: 'Reliable service delivery you can rely on.' },
    { id: 'integrity', title: 'Integrity', description: 'Honest and transparent professional conduct.' },
    { id: 'mastery', title: 'Mastery', description: 'High-skilled execution of cleaning practices.' },
    { id: 'efficiency', title: 'Efficiency', description: 'Timely and productive operational performance.' },
  ],
  coreValuesBackgroundImages: [
    { src: cleaner1Img, alt: 'Professional cleaner at work' },
    { src: cleaner2Img, alt: 'Professional cleaners tidying a home' },
    { src: cleaner3Img, alt: 'Professional cleaner vacuuming an office space' },
    { src: cleaner4Img, alt: 'Professional cleaners preparing supplies' },
  ],
};

export async function fetchCleaningServicesData(): Promise<CleaningServicesData> {
  return delay(CLEANING_SERVICES_DATA);
}

// ---- Aircon Care page --------------------------------------------------------

const AIRCON_CARE_DATA: AirconCareData = {
  eyebrow: 'Professional Aircon Care',
  headline: 'Clean Air. Better Life.',
  subheadline:
    'Breathe clean, live better. Professional air conditioning maintenance keeps your systems operating efficiently, minimizes unnecessary energy expenditure, and maintains healthy, fresh indoor air.',
  primaryCta: 'Book an Inspection',
  secondaryCta: 'Explore Services',
  bookingHref: 'tel:+639120875598',
  heroImage: {
    src: acHeroImg,
    alt: 'Kaizen technician inspecting a wall-mounted air conditioning unit',
  },
  plansHeading: 'Comprehensive Care Plans',
  plansSubheading: 'Tailored maintenance solutions to keep your environment perfectly calibrated.',
  plans: [
    {
      id: 'general-cleaning',
      icon: 'air',
      title: 'General Cleaning',
      description: 'Routine maintenance to ensure optimal airflow and prevent dust buildup.',
      features: ['Filter washing', 'Coil brushing', 'System check'],
      ctaLabel: 'Details',
      variant: 'default',
    },
    {
      id: 'chemical-wash',
      icon: 'water_drop',
      title: 'Chemical Wash',
      description: 'Deep sanitization to eradicate mold, bacteria, and stubborn grime.',
      features: ['Deep coil cleaning', 'Odor removal', 'Efficiency boost'],
      ctaLabel: 'Most Popular',
      variant: 'highlight',
    },
    {
      id: 'pro-maintenance',
      icon: 'handyman',
      title: 'Pro Maintenance',
      description: 'Comprehensive diagnostic and repair services for failing units.',
      features: ['Gas top-up', 'Parts replacement', 'Performance tuning'],
      ctaLabel: 'Details',
      variant: 'default',
    },
  ],
  benefitsHeading: 'Why Professional Care Matters',
  benefitsSubheading:
    'Regular servicing isn\u2019t just about cooling; it\u2019s an investment in your home\u2019s ecosystem and your family\u2019s well-being.',
  benefits: [
    {
      id: 'air-quality',
      icon: 'health_and_safety',
      title: 'Improves Air Quality',
      description: 'Complete removal of accumulated dust, dangerous mold spores, and common airborne allergens.',
    },
    {
      id: 'efficiency',
      icon: 'eco',
      title: 'Boosts Efficiency',
      description: 'Ensures optimal operations, reducing monthly energy bills and supplying superior room cooling.',
    },
    {
      id: 'longevity',
      icon: 'update',
      title: 'Extends Lifespan',
      description: 'Regular professional servicing prevents mechanical failures and decreases unexpected breakdowns.',
    },
  ],
  benefitsImage: {
    src: acBenefitsImg,
    alt: 'Technician wearing gloves cleaning an air conditioning unit filter',
  },
  ctaHeadline: 'Ready for a breath of fresh air?',
  ctaSubheading: 'Schedule your comprehensive inspection today and experience the Kaizen standard of care.',
  ctaLabel: 'Book an Inspection',
  ctaImage: {
    src: acCtaImg,
    alt: 'Close-up of a technician servicing an air conditioning unit filter',
  },
};

export async function fetchAirconCareData(): Promise<AirconCareData> {
  return delay(AIRCON_CARE_DATA);
}

// ---- Homepage ----------------------------------------------------------------

const HOMEPAGE_DATA: HomepageData = {
  eyebrow: 'We Market. We Manage. We Maintain.',
  headline: 'One Team for Your Property, Your Space, and Your Air.',
  subheadline:
    'Kaizen Optima Solutions brings property management, professional cleaning, and aircon care together under one trusted, family-run roof \\u2014 so you get consistent quality without juggling multiple vendors.',
  primaryCta: 'See What We Do',
  primaryHref: '/what-we-do',
  secondaryCta: 'About Us',
  secondaryHref: '/about-us',
  heroImage: {
    src: pmHeroImg,
    alt: 'Spacious, wide-angle view of a modern high-end residential living room with warm minimalist decor',
  },
  servicesHeading: 'Everything Your Property Needs',
  servicesSubheading: 'Three specialties, one standard of care. Explore what we do in detail on a single page.',
  services: [
    {
      id: 'property-management',
      icon: 'apartment',
      title: 'Property Management',
      description: 'Marketing, leasing, and full operational management for property owners.',
      href: '/what-we-do#property-management',
      image: { src: pmProcessLeaseImg, alt: 'Comfortable, well-kept bedroom in a managed rental property' },
    },
    {
      id: 'cleaning-services',
      icon: 'cleaning_services',
      title: 'Cleaning Services',
      description: 'On T.I.M.E. condo, home, and deep-cleaning services for modern living.',
      href: '/what-we-do#cleaning-services',
      image: { src: csPlanCondoImg, alt: 'Modern, tidy condo living space' },
    },
    {
      id: 'aircon-care',
      icon: 'air',
      title: 'Aircon Care',
      description: 'Cleaning, chemical wash, and pro maintenance for healthier indoor air.',
      href: '/what-we-do#aircon-care',
      image: { src: acHeroImg, alt: 'Kaizen technician inspecting a wall-mounted air conditioning unit' },
    },
  ],
  trustStats: [
    { id: 'retention', value: '98%', label: 'Tenant Retention Rate' },
    { id: 'support', value: '24/7', label: 'Dedicated Local Support' },
  ],
  ctaHeadline: 'Ready to experience the Kaizen standard?',
  ctaSubheading: 'Whichever service you need, our team is one call away.',
  ctaLabel: 'Get in Touch',
  ctaHref: '/about-us#contact',
};

export async function fetchHomepageData(): Promise<HomepageData> {
  return delay(HOMEPAGE_DATA);
}

// ---- About Us page -------------------------------------------------------------

const ABOUT_US_DATA: AboutUsData = {
  eyebrow: 'About Kaizen Optima Solutions',
  headline: 'Family-Owned. Community-Trusted.',
  subheadline:
    'We started Kaizen Optima Solutions with a simple belief: property owners and everyday families deserve the same level of care a five-star hospitality brand gives its guests.',
  primaryCta: 'Get a Free Appraisal',
  primaryHref: 'tel:+639196778350',
  secondaryCta: 'Book a Cleaning',
  secondaryHref: 'tel:+639120875598',
  heroImage: {
    src: pmFamilyImg,
    alt: 'Family relaxing together on a couch at home, reflecting the peace of mind Kaizen provides property owners',
  },
  storyHeading: 'Why Choose Kaizen',
  storyParagraphs: [
    'As a family-owned business, we don\\u2019t just manage properties, clean homes, or service aircon units \\u2014 we care for every space as if it were our own.',
    'We combine corporate-level precision with the warmth and personal touch of a boutique hospitality service, guided by our T.I.M.E. values: Trust, Integrity, Mastery, and Efficiency.',
  ],
  storyImage: {
    src: pmHeroImg,
    alt: 'Spacious, wide-angle view of a modern high-end residential living room with warm minimalist decor',
  },
  milestones: [
    { id: 'retention', value: '98%', label: 'Tenant Retention Rate' },
    { id: 'support', value: '24/7', label: 'Dedicated Local Support' },
    { id: 'values', value: 'T.I.M.E.', label: 'Trust \\u00b7 Integrity \\u00b7 Mastery \\u00b7 Efficiency' },
  ],
};

export async function fetchAboutUsData(): Promise<AboutUsData> {
  return delay(ABOUT_US_DATA);
}

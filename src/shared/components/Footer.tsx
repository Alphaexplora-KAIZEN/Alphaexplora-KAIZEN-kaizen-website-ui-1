import { Link } from 'react-router-dom';
import type { SiteChrome } from '../models/types';
import MaterialIcon from './MaterialIcon';

interface FooterProps {
  chrome: SiteChrome;
}

function isInternalHref(href: string) {
  return href.startsWith('/');
}

function FooterLink({ href, label }: { href: string; label: string }) {
  const className =
    'link-underline font-label-sm text-label-sm text-on-primary/80 hover:text-gold transition-colors';
  if (isInternalHref(href)) {
    return (
      <Link to={href} className={className}>
        {label}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className={className}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {label}
    </a>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.45 2.91h-2.33V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
    </svg>
  );
}

export default function Footer({ chrome }: FooterProps) {
  const { contactInfo } = chrome;

  return (
    <footer className="relative w-full bg-navy-deep bg-grain py-8 md:py-10 overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-teal/10 blur-3xl" />
      <div className="relative max-w-container-max-width mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr_1fr_1fr] gap-x-grid-gutter gap-y-6 pb-6 md:pb-8 border-b border-on-primary/15">
          <div className="space-y-3">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <img
                src="/assets/logo.png"
                alt={chrome.brand.shortName}
                className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.04]"
              />
            </Link>
            <p className="font-body-md text-body-md text-on-primary/80 max-w-xs">{chrome.footerBlurb}</p>
            <div className="flex gap-4 pt-1">
              <a
                href={contactInfo.emailHref}
                aria-label="Email us"
                className="text-on-primary/80 hover:text-gold hover:-translate-y-0.5 transition-all duration-200"
              >
                <MaterialIcon name="mail" />
              </a>
              <a
                href={contactInfo.propertyManagementPhoneHref}
                aria-label="Call us"
                className="text-on-primary/80 hover:text-gold hover:-translate-y-0.5 transition-all duration-200"
              >
                <MaterialIcon name="call" />
              </a>
              <a
                href={contactInfo.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
                className="text-on-primary/80 hover:text-gold hover:-translate-y-0.5 transition-all duration-200"
              >
                <FacebookIcon />
              </a>
            </div>
          </div>

          {chrome.footerGroups.map((group) => (
            <div key={group.id} className="space-y-2.5">
              <h4 className="font-label-bold text-label-bold text-gold uppercase tracking-wider">{group.title}</h4>
              <ul className="space-y-1.5">
                {group.links.map((link) => (
                  <li key={link.id}>
                    <FooterLink href={link.href} label={link.label} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-4 flex flex-col md:flex-row items-center md:items-end justify-between gap-3 text-center md:text-left">
          <p className="font-body-md text-body-md text-on-primary/80">{chrome.copyright}</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group inline-flex items-center gap-1.5 font-label-bold text-label-bold text-on-primary/70 hover:text-gold transition-colors focus-ring rounded"
          >
            Back to top
            <MaterialIcon
              name="arrow_upward"
              className="text-base transition-transform duration-200 group-hover:-translate-y-0.5"
            />
          </button>
        </div>
      </div>
    </footer>
  );
}

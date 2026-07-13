const JUMP_LINKS = [
  { id: 'property-management', href: '#property-management', label: 'Property Management' },
  { id: 'cleaning-services', href: '#cleaning-services', label: 'Cleaning Services' },
  { id: 'aircon-care', href: '#aircon-care', label: 'Aircon Care' },
];

export default function QuickNav() {
  return (
    <nav
      aria-label="Jump to a service"
      className="sticky top-20 z-30 bg-surface/95 backdrop-blur-md border-b border-outline-variant"
    >
      <div className="max-w-container-max-width mx-auto px-6 flex flex-wrap gap-x-8 gap-y-2 py-4 justify-center">
        {JUMP_LINKS.map((link) => (
          <a
            key={link.id}
            href={link.href}
            className="font-label-bold text-label-bold text-on-surface-variant hover:text-primary transition-colors focus-ring rounded"
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

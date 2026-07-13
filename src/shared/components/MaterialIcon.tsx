interface MaterialIconProps {
  name: string;
  filled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Renders a Google Material Symbols Outlined glyph by name, matching the
 * icon usage in the Serene Trust design system (e.g. "check_circle",
 * "vpn_key", "handyman").
 */
export default function MaterialIcon({ name, filled = false, className = '', style }: MaterialIconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontVariationSettings: `'FILL' ${filled ? 1 : 0}`, ...style }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

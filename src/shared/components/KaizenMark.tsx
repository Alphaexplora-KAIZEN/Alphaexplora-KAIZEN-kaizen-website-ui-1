interface KaizenMarkProps {
  className?: string;
  size?: number;
}

/**
 * The site's signature mark: two dashed arcs slowly counter-rotating around a
 * fixed dot. It's a small abstraction of "kaizen" itself — continuous,
 * incremental motion around a stable center — and doubles as the loading
 * indicator so the brand shows up even while data is still arriving.
 */
export default function KaizenMark({ className = '', size = 48 }: KaizenMarkProps) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 48 48" width={size} height={size} className="absolute inset-0 animate-spin-slow">
        <circle
          cx="24"
          cy="24"
          r="21"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.9"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="34 92"
        />
      </svg>
      <svg viewBox="0 0 48 48" width={size} height={size} className="absolute inset-0 animate-spin-slower">
        <circle
          cx="24"
          cy="24"
          r="14"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.45"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="20 60"
        />
      </svg>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
    </span>
  );
}

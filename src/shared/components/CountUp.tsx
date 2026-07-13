import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  value: string;
  active: boolean;
  className?: string;
  duration?: number;
}

/**
 * Animates the numeric portion of a stat string (e.g. "500+", "98%") from 0
 * up to its target once `active` becomes true, keeping any prefix/suffix
 * text intact. Falls back to rendering the raw string if no number is found.
 */
export default function CountUp({ value, active, className = '', duration = 1.4 }: CountUpProps) {
  const match = value.match(/(-?\d[\d,]*)(\.\d+)?/);
  const target = match ? parseFloat(match[0].replace(/,/g, '')) : null;
  const prefix = match ? value.slice(0, match.index) : '';
  const suffix = match ? value.slice((match.index ?? 0) + match[0].length) : '';
  const decimals = match?.[2] ? match[2].length - 1 : 0;

  const [display, setDisplay] = useState(target === null ? value : '0');
  const started = useRef(false);

  useEffect(() => {
    if (!active || target === null || started.current) return;
    started.current = true;
    const start = performance.now();
    const goal = target;

    function tick(now: number) {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = goal * eased;
      setDisplay(current.toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: decimals }));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [active, target, duration, decimals]);

  if (target === null) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

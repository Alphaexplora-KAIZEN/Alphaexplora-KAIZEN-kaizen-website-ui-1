import { useEffect, useRef } from 'react';

/**
 * A quiet radial glow that follows the pointer across the whole page.
 * Mounted once at the layout root. Updates a CSS custom property via rAF
 * (never React state) so it never triggers a re-render, and does nothing on
 * touch devices or when the pointer hasn't moved yet.
 */
export default function AmbientGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    function onMove(event: PointerEvent) {
      if (frame.current !== null) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        if (!node) return;
        node.style.setProperty('--mx', `${event.clientX}px`);
        node.style.setProperty('--my', `${event.clientY}px`);
      });
    }

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  return <div ref={ref} className="ambient-glow" />;
}

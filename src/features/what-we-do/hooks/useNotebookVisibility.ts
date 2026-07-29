import { useEffect, useState, type RefObject } from 'react';
import { useMediaQuery } from '../../../shared/hooks/useMediaQuery';

/**
 * QuickNav is a wayfinder for the service notebook section specifically —
 * on mobile, where vertical space is scarce, it should fade out once that
 * section has actually scrolled out of view (past the top, behind the
 * fixed navbar/QuickNav bars, or scrolled down past its bottom edge)
 * rather than staying sticky-pinned all the way down through TargetSpaces
 * and TrustCTA below it. Desktop has room to spare, so it keeps the bar
 * visible regardless of scroll position.
 */
export function useNotebookVisibility(notebookRef: RefObject<HTMLElement | null>) {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!isMobile) {
      setVisible(true);
      return undefined;
    }

    const el = notebookRef.current;
    if (!el) return undefined;

    const update = () => {
      const offset =
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--wwd-sticky-offset')) || 0;
      const rect = el.getBoundingClientRect();
      setVisible(rect.bottom > offset && rect.top < window.innerHeight);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [isMobile, notebookRef]);

  return visible;
}

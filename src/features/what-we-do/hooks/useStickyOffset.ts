import { useEffect, type RefObject } from 'react';

const CSS_VAR = '--wwd-sticky-offset';

/**
 * The page's snap points previously used a guessed, fixed `scroll-mt-36`
 * (9rem) to keep each section's image from landing underneath the fixed
 * navbar + sticky QuickNav bar. That guess didn't match their real
 * combined height, so scroll-snap either left a visible gap above the
 * image or cut its top edge off, instead of the image sitting flush right
 * below both bars.
 *
 * This measures the two bars' actual rendered heights (which do change —
 * the navbar shrinks on scroll, QuickNav's row height can vary with font
 * loading or viewport width) and publishes their live sum as the
 * `--wwd-sticky-offset` CSS variable on the document root. Sections then
 * set `scroll-margin-top: var(--wwd-sticky-offset)` so the snap position
 * is always exactly the height of what's actually covering the top of the
 * viewport — no gap, nothing clipped.
 */
export function useStickyOffset(quickNavRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const quickNavEl = quickNavRef.current;
    if (!quickNavEl) return undefined;

    function measure() {
      const navbarEl = document.querySelector('[data-site-navbar]');
      const navbarHeight = navbarEl instanceof HTMLElement ? navbarEl.offsetHeight : 0;
      const quickNavHeight = quickNavEl instanceof HTMLElement ? quickNavEl.offsetHeight : 0;
      document.documentElement.style.setProperty(CSS_VAR, `${navbarHeight + quickNavHeight}px`);
    }

    measure();

    // Both bars can change height after mount: the navbar shrinks once the
    // page is scrolled (a CSS transition, not a layout thrash we trigger),
    // and QuickNav's row can wrap or resize with the viewport or once web
    // fonts finish loading. ResizeObserver catches all of that without
    // polling.
    const observer = new ResizeObserver(measure);
    observer.observe(quickNavEl);
    const navbarEl = document.querySelector('[data-site-navbar]');
    if (navbarEl instanceof HTMLElement) observer.observe(navbarEl);

    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty(CSS_VAR);
    };
  }, [quickNavRef]);
}

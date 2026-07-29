import { useEffect, type RefObject } from 'react';

const OFFSET_VAR = '--wwd-sticky-offset';
const NAVBAR_VAR = '--wwd-navbar-offset';

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
 *
 * On mobile the navbar also fades out entirely while scrolling down
 * (see Navbar's `data-hidden` attribute) and only a small pinned burger
 * button remains. When that happens this treats the navbar's contribution
 * to both offsets as 0, and publishes that separately as
 * `--wwd-navbar-offset` so QuickNav can stick flush to the top of the
 * viewport instead of leaving a blank gap where the faded navbar used to be.
 */
export function useStickyOffset(quickNavRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const quickNavEl = quickNavRef.current;
    if (!quickNavEl) return undefined;

    const navbarEl = document.querySelector('[data-site-navbar]');

    function measure() {
      const isNavbarHidden = navbarEl instanceof HTMLElement && navbarEl.getAttribute('data-hidden') === 'true';
      const navbarHeight = navbarEl instanceof HTMLElement && !isNavbarHidden ? navbarEl.offsetHeight : 0;
      const quickNavHeight = quickNavEl instanceof HTMLElement ? quickNavEl.offsetHeight : 0;
      document.documentElement.style.setProperty(NAVBAR_VAR, `${navbarHeight}px`);
      document.documentElement.style.setProperty(OFFSET_VAR, `${navbarHeight + quickNavHeight}px`);
    }

    measure();

    // Both bars can change height after mount: the navbar shrinks once the
    // page is scrolled (a CSS transition, not a layout thrash we trigger),
    // and QuickNav's row can wrap or resize with the viewport or once web
    // fonts finish loading. ResizeObserver catches all of that without
    // polling.
    const observer = new ResizeObserver(measure);
    observer.observe(quickNavEl);
    if (navbarEl instanceof HTMLElement) observer.observe(navbarEl);

    // The navbar fading out doesn't change its own dimensions (opacity
    // only), so ResizeObserver won't fire for that — watch its
    // `data-hidden` attribute directly instead.
    let attrObserver: MutationObserver | undefined;
    if (navbarEl instanceof HTMLElement) {
      attrObserver = new MutationObserver(measure);
      attrObserver.observe(navbarEl, { attributes: true, attributeFilter: ['data-hidden'] });
    }

    return () => {
      observer.disconnect();
      attrObserver?.disconnect();
      document.documentElement.style.removeProperty(OFFSET_VAR);
      document.documentElement.style.removeProperty(NAVBAR_VAR);
    };
  }, [quickNavRef]);
}

import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LoadingState } from './shared/components/LoadingState';

const Homepage = lazy(() => import('./features/homepage/views/Homepage'));
const WhatWeDo = lazy(() => import('./features/what-we-do/views/WhatWeDo'));
const AboutUs = lazy(() => import('./features/about-us/views/AboutUs'));

function PageFallback() {
  return <LoadingState fullScreen />;
}

/**
 * React Router doesn't reset scroll position between route changes on its
 * own (that's a browser-native, full-page-load behavior it deliberately
 * opts out of for SPA navigation). Without this, clicking a nav link while
 * scrolled down on the current page lands you at that same scroll depth on
 * the new page — which on a page like What We Do can skip its own landing
 * section entirely and drop you straight into the middle of the content.
 * Jumps instantly (not smooth) so it reads as a fresh page load, not an
 * animated scroll the person has to watch happen.
 *
 * When the destination URL carries a hash (e.g. a homepage "Learn more"
 * link pointing at /what-we-do#property-management), the page still opens
 * at the top first — same instant jump as any other navigation — and then
 * smoothly scrolls down to that section once it's mounted. That two-step
 * "page opens, then scrolls to the section" reads as the page actively
 * taking you there, rather than silently teleporting you mid-page with no
 * sense of where you landed relative to the rest of it. Lazy-loaded route
 * content can still be rendering on the first tick after navigation, so
 * this retries briefly until the target element exists.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });

    if (!hash) return undefined;

    const id = hash.replace('#', '');
    let cancelled = false;
    let attempts = 0;

    const tryScroll = () => {
      if (cancelled) return;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (attempts < 20) {
        attempts += 1;
        window.requestAnimationFrame(tryScroll);
      }
    };

    // A short delay after the top-of-page jump so the two steps read as
    // distinct beats (land, then travel) instead of one blurred motion.
    const timeoutId = window.setTimeout(tryScroll, 220);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/what-we-do" element={<WhatWeDo />} />
          <Route path="/about-us" element={<AboutUs />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

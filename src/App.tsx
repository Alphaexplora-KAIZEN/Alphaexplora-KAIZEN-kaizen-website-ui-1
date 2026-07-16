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
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
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

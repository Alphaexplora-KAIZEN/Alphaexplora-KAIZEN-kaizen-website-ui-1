import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoadingState } from './shared/components/LoadingState';

const Homepage = lazy(() => import('./features/homepage/views/Homepage'));
const WhatWeDo = lazy(() => import('./features/what-we-do/views/WhatWeDo'));
const AboutUs = lazy(() => import('./features/about-us/views/AboutUs'));

function PageFallback() {
  return <LoadingState fullScreen />;
}

export default function App() {
  return (
    <BrowserRouter>
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

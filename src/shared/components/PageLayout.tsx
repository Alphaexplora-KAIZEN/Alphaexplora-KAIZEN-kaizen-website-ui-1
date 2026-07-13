import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import AmbientGlow from './AmbientGlow';
import { LoadingState, ErrorState } from './LoadingState';
import { useSiteChromeViewModel } from '../hooks/useSiteChromeViewModel';

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  const { data, isLoading, error } = useSiteChromeViewModel();

  if (isLoading || !data) return <LoadingState fullScreen />;
  if (error) return <ErrorState message={error} fullScreen />;

  return (
    <div className="relative min-h-screen bg-background">
      <AmbientGlow />
      <div className="relative z-[1]">
        <Navbar brand={data.brand} links={data.navLinks} />
        <main className="pt-20">{children}</main>
        <Footer chrome={data} />
      </div>
    </div>
  );
}

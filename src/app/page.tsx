import HeroSection from '@/components/sections/HeroSection';
import ProblemSection from '@/components/sections/ProblemSection';
import RequestSection from '@/components/sections/RequestSection';
import VerificationSection from '@/components/sections/VerificationSection';
import MapSection from '@/components/sections/MapSection';
import MatchingSection from '@/components/sections/MatchingSection';
import AlertsSection from '@/components/sections/AlertsSection';
import AcceptSection from '@/components/sections/AcceptSection';
import ImpactSection from '@/components/sections/ImpactSection';
import CtaSection from '@/components/sections/CtaSection';

export default function Home() {
  return (
    <main className="w-full relative">
      <HeroSection />
      <ProblemSection />
      <RequestSection />
      <VerificationSection />
      <MapSection />
      <MatchingSection />
      <AlertsSection />
      <AcceptSection />
      <ImpactSection />
      <CtaSection />
    </main>
  );
}

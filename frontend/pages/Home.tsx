
import React from 'react';
import LandingNavbar from '../components/LandingNavbar';
import LandingHero from '../components/LandingHero';
import PurpleNavbar from '../components/PurpleNavbar';
import WhatIsStudlyf from '../components/WhatIsStudlyf';
import VoicesThatInspire from '../components/VoicesThatInspire';
import StatsSection from '../components/StatsSection';
import ProblemSection from '../components/ProblemSection';
import AIReality from '../components/AIReality';
import VerificationProcess from '../components/VerificationProcess';
import Differentiation from '../components/Differentiation';
import TrackPreview from '../components/TrackPreview';
import AudienceFilter from '../components/AudienceFilter';
import SocialProof from '../components/SocialProof';
import FAQ from '../components/FAQ';
import FinalCTA from '../components/FinalCTA';

const Home: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* First Fold */}
      <div className="h-screen flex flex-col relative overflow-hidden">
        <LandingNavbar />
        <LandingHero />
        <PurpleNavbar />
      </div>

      {/* Scrollable content starts here */}
      <WhatIsStudlyf />
      <VoicesThatInspire />
      <StatsSection />
      <ProblemSection />
      <AIReality />
      <VerificationProcess />
      <Differentiation />
      <TrackPreview />
      <AudienceFilter />
      <SocialProof />
      <FAQ />
      <FinalCTA />
    </div>
  );
};

export default Home;

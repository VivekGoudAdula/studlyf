
import React from 'react';
import Hero from '../components/Hero';
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
    <>
      <Hero />
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
    </>
  );
};

export default Home;


import React from 'react';
import LandingNavbar from '../components/LandingNavbar';
import LandingHero from '../components/LandingHero';
import PurpleNavbar from '../components/PurpleNavbar';
import WhatIsStudlyf from '../components/WhatIsStudlyf';
import VoicesThatInspire from '../components/VoicesThatInspire';
import OldVsNewSection from '../components/OldVsNewSection';
import MentorCredibility from '../components/MentorCredibility';
import RoadmapSection from '../components/RoadmapSection';
import WhoWeServe from '../components/WhoWeServe';
import FeaturedInstitutions from '../components/FeaturedInstitutions';
import OurPartners from '../components/OurPartners';



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
      <OldVsNewSection />
      <MentorCredibility />
      <WhoWeServe />
      <RoadmapSection />
      <FeaturedInstitutions />
      <OurPartners />
    </div>
  );
};

export default Home;
